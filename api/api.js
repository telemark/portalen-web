import {Server} from 'hapi'
import h2o2 from 'h2o2'
import HapiAuthCookie from 'hapi-auth-cookie'
import config from '../src/config'
import Nes from 'nes'
import mongoose from 'mongoose'
import queryString from 'query-string'
import omit from 'object.omit'
import {
  User,
  Messages,
  Info,
  Feedback
} from './routes'
const hapiAuthJwt2 = require('hapi-auth-jwt2')
const pingRoutes = require('./routes/ping')
const shortcutRoutes = require('./routes/shortcuts')
const roleRoutes = require('./routes/roles')
const linkRoutes = require('./routes/links')
const contentRoutes = require('./routes/content')
const channelRoutes = require('./routes/channels')
const validateApi = require('./helpers/validate-api')
const good = require('good')

mongoose.Promise = global.Promise
mongoose.connect(config.databaseUri)
  .catch(err => {
    console.error(err.message || err)
  })

const server = new Server()

const goodOptions = {
  ops: {
    interval: 1000
  },
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', response: '*', request: '*', error: '*' }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
}

server.connection({port: config.apiPort})

server.register([{register: good, options: goodOptions}, h2o2, HapiAuthCookie, hapiAuthJwt2, Nes], (err) => {
  if (err) {
    throw err
  }
  const cache = server.cache({
    segment: 'sessions',
    expiresIn: 3600000 * 24 * config.sessionTimeoutDays
  })
  server.app.cache = cache

  server.auth.strategy('session', 'cookie', true, {
    password: config.sessionSecret,
    cookie: 'portalen-session',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000 * 7,
    validateFunc: User.requireAuth
  })

  server.auth.strategy('jwt', 'jwt', {
    key: config.api.jwtSecret, // Never Share your secret key
    validateFunc: validateApi, // validate function defined above
    verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
  })

  server.route(channelRoutes)

  server.subscription('/messageupdates/{role}')
  server.subscription('/tasksupdates')
  server.subscription('/contentupdates')

  server.start(() => {
    console.info('==> ✅  Api-server is listening')
    console.info('==> 🌎  Go to ' + server.info.uri.toLowerCase())
  })
})

server.route(pingRoutes)
server.route(shortcutRoutes)
server.route(roleRoutes)
server.route(linkRoutes)
server.route(contentRoutes)

/*
server.route({
  method: 'POST',
  path: '/user/login',
  config: {
    handler: User.login,
    auth: false
  }
})
*/

server.route({
  method: 'GET',
  path: '/user/logout',
  config: {
    handler: User.logout
  }
})
server.route({
  method: 'GET',
  path: '/user/load',
  config: {
    handler: User.loadAuth
  }
})
server.route({
  method: 'GET',
  path: '/user/signin',
  handler: User.signin,
  config: {
    auth: false
  }
})
server.route({
  method: 'GET',
  path: '/info',
  config: {
    handler: Info.readAll
  }
})
server.route({
  method: 'DELETE',
  path: '/info',
  config: {
    handler: Info.remove
  }
})
/* UserLinks */
server.route({
  method: 'POST',
  path: '/userlink',
  config: {
    handler: Info.createLink
  }
})
server.route({
  method: 'PUT',
  path: '/userlink/{id}',
  config: {
    handler: Info.editLink
  }
})
server.route({
  method: 'DELETE',
  path: '/userlink/{id}',
  config: {
    handler: Info.removeLink
  }
})

/* Subscriptions */
server.route({
  method: 'POST',
  path: '/subscription/add',
  config: {
    handler: Info.addSubscription
  }
})
server.route({
  method: 'POST',
  path: '/subscription/remove',
  config: {
    handler: Info.removeSubscription
  }
})

/* Messages */
server.route({
  method: 'GET',
  path: '/messages',
  config: {
    handler: Messages.readAll
  }
})
server.route({
  method: 'GET',
  path: '/messages/{id}',
  config: {
    handler: Messages.readOne
  }
})
server.route({
  method: 'POST',
  path: '/messages',
  config: {
    handler: Messages.create
  }
})
server.route({
  method: 'PUT',
  path: '/messages/{id}',
  config: {
    handler: Messages.update
  }
})
server.route({
  method: 'DELETE',
  path: '/messages/{id}',
  config: {
    handler: Messages.remove
  }
})
server.route({
  method: 'PUT',
  path: '/messages/like/{id}',
  config: {
    handler: Messages.likeMessage
  }
})
server.route({
  method: 'PUT',
  path: '/messages/hide/{id}',
  config: {
    handler: Messages.hideMessage
  }
})
server.route({
  method: 'PUT',
  path: '/messages/unlike/{id}',
  config: {
    handler: Messages.unLikeMessage
  }
})
server.route({
  method: 'GET',
  path: '/messages/search',
  config: {
    handler: Messages.search,
    auth: false
  }
})
/* Feedback */
server.route({
  method: 'POST',
  path: '/feedback',
  config: {
    handler: Feedback.create
  }
})
if (config.api.search) {
  server.route({
    method: 'GET',
    path: '/search',
    config: {
      handler: {
        proxy: {
          mapUri: (request, callback) => {
            const url = require('url').parse(request.raw.req.url)
            const params = queryString.parse(url.query)
            const index = (params && params.faset && params.faset !== config.searchOptions.default) ? `/${params.faset}/` : '/'
            callback(null, `${config.api.search}${index}search?${queryString.stringify(omit(params, 'faset'))}`)
          },
          passThrough: true
        }
      }
    }
  })
}
