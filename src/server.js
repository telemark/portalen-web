import {Server} from 'hapi'
import h2o2 from 'h2o2'
import inert from 'inert'
import httpProxy from 'http-proxy'

import React from 'react'
import ReactDOM from 'react-dom/server'
import config from './config'
import createStore from './redux/create'
import ApiClient from './helpers/ApiClient'
import Html from './helpers/Html'
import PrettyError from 'pretty-error'
import {match} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import {ReduxAsyncConnect, loadOnServer} from 'redux-connect'
import createHistory from 'react-router/lib/createMemoryHistory'
import {Provider} from 'react-redux'
import getRoutes from './routes'
const good = require('good')
const pretty = new PrettyError()
const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
})

const goodOptions = {
  ops: {
    interval: 1000
  },
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{log: '*', response: '*', request: '*', error: '*'}]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
}

const server = new Server()
server.connection({port: config.port})
server.register([
  {register: good, options: goodOptions},
  h2o2,
  inert
], (err) => {
  if (err) {
    throw err
  }
  server.start(() => {
    console.info('==> ✅  Server is listening')
    console.info('==> 🌎  Go to ' + server.info.uri.toLowerCase())
  })
})

proxy.on('error', (error, req, res) => {
  console.error('proxy error', error)
})

server.ext('onPreResponse', (request, reply) => {
  if (request.path.substring(0, 4) === '/api') {
    request.raw.req.url = request.raw.req.url.replace('/api', '')
    return proxy.web(request.raw.req, request.raw.res, {target: targetUrl})
  }
  return reply.continue()
})

server.route({
  method: 'GET',
  path: '/{params*}',
  handler: {
    file: (request) => 'static' + request.path
  }
})

server.ext('onPreResponse', (request, reply) => {
  if (typeof request.response.statusCode !== 'undefined' || request.path.substring(0, 3) === '/ws') {
    return reply.continue()
  }
  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh()
  }

  const client = new ApiClient(request)
  const memoryHistory = createHistory(request.path)
  const store = createStore(memoryHistory, client)
  const history = syncHistoryWithStore(memoryHistory, store)

  function hydrateOnClient () {
    reply('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store} />)).code(500)
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient()
    return
  }

  match({history, routes: getRoutes(store), location: {pathname: request.path, query: request.query}}, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      return reply.redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error))
      // reply.code(500)
      return hydrateOnClient()
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const {auth: {user}} = store.getState()
        if (!user && request.path === '/reauth') {
          const authUrl = `${config.authServiceUrl}?origin=${config.originUrl}`
          reply.redirect(authUrl)
        }
        const component = (
          <Provider store={store} key='provider'>
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        )

        global.navigator = {userAgent: request.headers['user-agent']}

        reply('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />)).code(200)
      })
    } else {
      reply('Not found').code(404)
    }
  })
})
