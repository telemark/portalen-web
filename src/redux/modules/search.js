import equal from 'deep-equal'

const LOAD = 'tfk-portalen/search/LOAD'
const LOAD_SUCCESS = 'tfk-portalen/search/LOAD_SUCCESS'
const LOAD_FAIL = 'tfk-portalen/search/LOAD_FAIL'
const SET_QUERY = 'tfk-portalen/search/SET_QUERY'
const TOGGLE_SEARCH_VISIBLE = 'tfk-portalen/search/TOGGLE_SEARCH_VISIBLE'
const RESET = 'tfk-portalen/search/RESET'

const initialState = {
  phrase: '',
  query: {},
  loaded: false,
  searchVisible: false
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case SET_QUERY:
      return {
        ...state,
        phrase: action.payload
      }
    case TOGGLE_SEARCH_VISIBLE:
      return {
        ...state,
        searchVisible: !state.searchVisible
      }
    case LOAD:
      return {
        ...state,
        loading: true
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        data: action.result,
        phrase: action.query.phrase || '',
        searchVisible: true,
        loading: false,
        loaded: true
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      }
    case RESET:
      return initialState
    default:
      return state
  }
}

export function isLoaded (globalState, query) {
  return globalState.search && globalState.search.loaded && equal(globalState.search.query, query)
}

export function load (query = {}) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/search', {
      params: {
        ...query,
        query: query.phrase,
        from: query.from ? query.from - 1 : 0
      }
    }),
    query
  }
}

export function setQuery (payload = '') {
  return {
    type: SET_QUERY,
    payload
  }
}

export function toggleSearchVisible () {
  return {
    type: TOGGLE_SEARCH_VISIBLE
  }
}

export function reset () {
  return {
    type: RESET
  }
}
