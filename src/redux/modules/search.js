const LOAD = 'tfk-portalen/search/LOAD'
const LOAD_SUCCESS = 'tfk-portalen/search/LOAD_SUCCESS'
const LOAD_FAIL = 'tfk-portalen/search/LOAD_FAIL'
const RESET = 'tfk-portalen/search/RESET'

const initialState = {
  query: '',
  size: 20,
  items: []
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        query: action.query,
        page: action.page,
        loading: true
      }
    case LOAD_SUCCESS:
      if (action.result.hits.hits && action.result.hits.hits.length > 0) {
        return {
          ...state,
          loading: false,
          items: action.result.hits.hits,
          pages: Math.max(1, Math.ceil(action.result.hits.total / state.size)),
          total: action.result.hits.total
        }
      }
      return {
        ...state,
        loading: false,
        error: `Ingen treff funnet for ${state.query}`
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    case RESET:
      return initialState
    default:
      return state
  }
}

export function load (query, page = 1) {
  return (dispatch, getState) => {
    const {search: {size}} = getState()
    dispatch(
      {
        types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
        promise: (client) => client.get(`/search?query=${query}&from=${(page - 1) * size}&size=${size}`),
        query: query,
        page: page
      })
  }
}

export function reset () {
  return {
    type: RESET
  }
}
