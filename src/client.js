import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './redux/create'
import ApiClient from './helpers/ApiClient'
import {Provider} from 'react-redux'
import {Router, browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import PiwikReactRouter from 'piwik-react-router'
import {ReduxAsyncConnect} from 'redux-connect'
import getRoutes from './routes'
import config from 'config'

const client = new ApiClient()
const dest = document.getElementById('content')
const store = createStore(browserHistory, client, window.__data)
const history = syncHistoryWithStore(browserHistory, store)

const piwik = PiwikReactRouter({
  url: config.piwikURL,
  siteId: config.piwikSiteID
})

const component = (
  <Router render={(props) =>
    <ReduxAsyncConnect {...props} helpers={{client}} filter={(item) => !item.deferred} />
      } history={piwik.connectToHistory(history)}>
    {getRoutes(store)}
  </Router>
)

ReactDOM.render(
  <Provider store={store} key='provider'>
    {component}
  </Provider>,
  dest
)

if (process.env.NODE_ENV !== 'production') {
  window.React = React // enable debugger

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.')
  }
}
