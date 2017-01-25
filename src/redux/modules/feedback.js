const ADD = 'tfk-portalen/feedback/ADD'
const ADD_SUCCESS = 'tfk-portalen/feedback/ADD_SUCCESS'
const ADD_FAIL = 'tfk-portalen/feedback/ADD_FAIL'
const RESET = 'tfk-portalen/feedback/RESET'

const initialState = {
  error: false,
  loading: false,
  successMessage: false
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        loading: true
      }
    case ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        successMessage: action.result.successMessage
      }
    case ADD_FAIL:
      return {
        ...state,
        loading: false,
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

export function add (item) {
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client.post('/feedback', {
      data: item
    })
  }
}

export function reset () {
  return {
    type: RESET
  }
}
