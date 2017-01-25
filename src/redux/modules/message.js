const LOAD = 'tfk-portalen/message/LOAD'
const LOAD_SUCCESS = 'tfk-portalen/message/LOAD_SUCCESS'
const LOAD_FAIL = 'tfk-portalen/message/LOAD_FAIL'
const RESET = 'tfk-portalen/message/RESET'

const initialState = {
  loaded: false,
  item: {}
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
        item: action.result
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      }
    case RESET:
      return {
        ...initialState
      }
    default:
      return state
  }
}

export function isLoaded (globalState) {
  return globalState.message && globalState.message.loaded
}

export function load (id) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/messages/${id}`)
  }
}

export function reset () {
  return {
    type: RESET
  }
}
