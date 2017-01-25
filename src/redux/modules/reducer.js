import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import {reducer as reduxAsyncConnect} from 'redux-connect'

import auth from './auth'
import messages from './messages'
import message from './message'
import search from './search'
import info from './info'
import feedback from './feedback'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  messages,
  message,
  search,
  info,
  feedback
})
