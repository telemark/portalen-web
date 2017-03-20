const LOAD = 'tfk-portalen/auth/LOAD'
const LOAD_SUCCESS = 'tfk-portalen/auth/LOAD_SUCCESS'
const LOAD_FAIL = 'tfk-portalen/auth/LOAD_FAIL'
const LOGIN = 'tfk-portalen/auth/LOGIN'
const LOGIN_SUCCESS = 'tfk-portalen/auth/LOGIN_SUCCESS'
const LOGIN_FAIL = 'tfk-portalen/auth/LOGIN_FAIL'
const LOGOUT = 'tfk-portalen/auth/LOGOUT'
const LOGOUT_SUCCESS = 'tfk-portalen/auth/LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'tfk-portalen/auth/LOGOUT_FAIL'

const initialState = {
  loaded: false
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    case LOGIN:
      return {
        ...state,
        loggingIn: true,
        loginError: null
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result,
        redirect: action.redirect
      }
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      }
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      }
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      }
    default:
      return state
  }
}

export function isLoaded (globalState) {
  return globalState.auth && globalState.auth.loaded
}

export function load () {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/user/load')
  }
}

export function login (token) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.get('/user/signin', {
      params: {
        token
      }
    })
  }
}

export function logout () {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/user/logout')
  }
}
