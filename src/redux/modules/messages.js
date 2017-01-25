const LOAD = 'tfk-portalen/messages/LOAD'
const LOAD_SUCCESS = 'tfk-portalen/messages/LOAD_SUCCESS'
const LOAD_FAIL = 'tfk-portalen/messages/LOAD_FAIL'
const LOADMORE = 'tfk-portalen/messages/LOADMORE'
const LOADMORE_SUCCESS = 'tfk-portalen/messages/LOADMORE_SUCCESS'
const LOADMORE_FAIL = 'tfk-portalen/messages/LOADMORE_FAIL'
const ADD = 'tfk-portalen/messages/ADD'
const ADD_SUCCESS = 'tfk-portalen/messages/ADD_SUCCESS'
const ADD_FAIL = 'tfk-portalen/messages/ADD_FAIL'
const EDIT = 'tfk-portalen/messages/EDIT'
const EDIT_SUCCESS = 'tfk-portalen/messages/EDIT_SUCCESS'
const EDIT_FAIL = 'tfk-portalen/messages/EDIT_FAIL'
const REMOVE = 'tfk-portalen/messages/REMOVE'
const REMOVE_SUCCESS = 'tfk-portalen/messages/REMOVE_SUCCESS'
const REMOVE_FAIL = 'tfk-portalen/messages/REMOVE_FAIL'
const UPDATE_EXTERNAL = 'tfk-portalen/messages/UPDATE_EXTERNAL'
const REMOVE_EXTERNAL = 'tfk-portalen/messages/REMOVE_EXTERNAL'
const LIKE = 'tfk-portalen/messages/LIKE'
const LIKE_SUCCESS = 'tfk-portalen/messages/LIKE_SUCCESS'
const LIKE_FAIL = 'tfk-portalen/messages/LIKE_FAIL'
const UNLIKE = 'tfk-portalen/messages/UNLIKE'
const UNLIKE_SUCCESS = 'tfk-portalen/messages/UNLIKE_SUCCESS'
const UNLIKE_FAIL = 'tfk-portalen/messages/UNLIKE_FAIL'
const HIDE = 'tfk-portalen/messages/HIDE'
const HIDE_SUCCESS = 'tfk-portalen/messages/HIDE_SUCCESS'
const HIDE_FAIL = 'tfk-portalen/messages/HIDE_FAIL'

const limitIncrease = 10

const initialState = {
  loaded: false,
  limit: limitIncrease,
  moreEnabled: true,
  roles: [],
  items: []
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
        items: action.result,
        roles: action.roles
      }
    case LOADMORE_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.result,
        limit: action.limit,
        moreEnabled: ((action.result.length + 1) === action.limit)
      }
    case LOAD_FAIL:
    case LOADMORE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    case ADD:
    case EDIT:
    case REMOVE:
      return {
        ...state,
        loading: true
      }
    /* We do not insert here, but let socket pipe the added item back to us */
    case ADD_SUCCESS:
    case EDIT_SUCCESS:
    case REMOVE_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case ADD_FAIL:
    case EDIT_FAIL:
    case REMOVE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case UPDATE_EXTERNAL:
      const found = state.items.find((item) => item._id === action.item._id)
      if (found) {
        return {
          ...state,
          items: state.items.map((item) => {
            if (item._id === found._id) {
              return action.item
            }
            return item
          })
        }
      }
      return {
        ...state,
        items: [
          ...state.items,
          action.item
        ]
      }
    case REMOVE_EXTERNAL:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.id)
      }
    default:
      return state
  }
}

export function isLoaded (globalState) {
  return globalState.messages && globalState.messages.loaded
}

export function load (roles) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`/messages?roles=${roles.join('|')}&limit=${limitIncrease}`),
    roles: roles
  }
}

export function loadnext () {
  return (dispatch, getState) => {
    const {messages: {limit, roles}} = getState()
    dispatch(
      {
        types: [LOADMORE, LOADMORE_SUCCESS, LOADMORE_FAIL],
        promise: (client) => client.get(`/messages?roles=${roles.join('|')}&limit=${limit + limitIncrease}`),
        limit: limit + limitIncrease
      }
    )
  }
}

export function add (item) {
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client.post('/messages', {
      data: item
    })
  }
}

export function edit (id, item) {
  return {
    types: [EDIT, EDIT_SUCCESS, EDIT_FAIL],
    promise: (client) => client.put(`/messages/${id}`, {
      data: item
    })
  }
}

export function remove (id) {
  return {
    types: [REMOVE, REMOVE_SUCCESS, REMOVE_FAIL],
    promise: (client) => client.del(`/messages/${id}`)
  }
}

export function updateExternal (item) {
  return {
    type: UPDATE_EXTERNAL,
    item: item
  }
}

export function removeExternal (id) {
  return {
    type: REMOVE_EXTERNAL,
    id: id
  }
}

export function like (id) {
  return {
    types: [LIKE, LIKE_SUCCESS, LIKE_FAIL],
    promise: (client) => client.put(`/messages/like/${id}`)
  }
}

export function unlike (id) {
  return {
    types: [UNLIKE, UNLIKE_SUCCESS, UNLIKE_FAIL],
    promise: (client) => client.put(`/messages/unlike/${id}`)
  }
}

export function hide (id) {
  return {
    types: [HIDE, HIDE_SUCCESS, HIDE_FAIL],
    promise: (client) => client.put(`/messages/hide/${id}`)
  }
}
