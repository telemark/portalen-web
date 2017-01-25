const LOAD = 'tfk-portalen/info/LOAD'
const LOAD_SUCCESS = 'tfk-portalen/info/LOAD_SUCCESS'
const LOAD_FAIL = 'tfk-portalen/info/LOAD_FAIL'
const REMOVE_CONTECT = 'tfk-portalen/info/REMOVE_CONTECT'
const REMOVE_CONTECT_SUCCESS = 'tfk-portalen/info/REMOVE_CONTECT_SUCCESS'
const REMOVE_CONTECT_FAIL = 'tfk-portalen/info/REMOVE_CONTECT_FAIL'

const ADDURL = 'tfk-portalen/infos/ADDURL'
const ADDURL_SUCCESS = 'tfk-portalen/infos/ADDURL_SUCCESS'
const ADDURL_FAIL = 'tfk-portalen/infos/ADDURL_FAIL'
const EDITURL = 'tfk-portalen/infos/EDITURL'
const EDITURL_SUCCESS = 'tfk-portalen/infos/EDITURL_SUCCESS'
const EDITURL_FAIL = 'tfk-portalen/infos/EDITURL_FAIL'
const REMOVEURL = 'tfk-portalen/infos/REMOVEURL'
const REMOVEURL_SUCCESS = 'tfk-portalen/infos/REMOVEURL_SUCCESS'
const REMOVEURL_FAIL = 'tfk-portalen/infos/REMOVEURL_FAIL'

const ADDSUB = 'tfk-portalen/infos/ADDSUB'
const ADDSUB_SUCCESS = 'tfk-portalen/infos/ADDSUB_SUCCESS'
const ADDSUB_FAIL = 'tfk-portalen/infos/ADDSUB_FAIL'
const REMOVESUB = 'tfk-portalen/infos/REMOVESUB'
const REMOVESUB_SUCCESS = 'tfk-portalen/infos/REMOVESUB_SUCCESS'
const REMOVESUB_FAIL = 'tfk-portalen/infos/REMOVESUB_FAIL'

const DISMISS_ERROR = 'tfk-portalen/info/DISMISS_ERROR'

const initialState = {
  errors: [],
  data: {
    links: null,
    roles: null,
    shortcuts: null,
    tasks: null,
    ads: null,
    news: null,
    urls: null
  }
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        errors: state.errors.filter((item) => item.infoType !== action.infoType)
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          [action.infoType]: action.result
        }
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        errors: [...state.errors, {infoType: action.infoType, error: action.error, active: true}],
        data: {
          ...state.data,
          [action.infoType]: []
        }
      }
    case DISMISS_ERROR:
      return {
        ...state,
        errors: state.errors.map((item) => {
          if (item.infoType === action.infoType) {
            return {...item, active: false}
          }
          return item
        })
      }
    case REMOVE_CONTECT:
      return {
        ...state,
        loading: true,
        errors: state.errors.filter((item) => item.infoType !== action.infoType)
      }
    case REMOVE_CONTECT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: {
          ...state.data,
          [action.infoType]: state.data[action.infoType].filter((item) => item.url !== action.url)
        }
      }
    case REMOVE_CONTECT_FAIL:
      return {
        ...state,
        loading: false,
        errors: [...state.errors, {infoType: action.infoType, error: action.error, active: true}]
      }
    case ADDURL:
    case EDITURL:
    case REMOVEURL:
      return {
        ...state,
        loadinglink: true,
        errors: state.errors.filter((item) => item.infoType !== 'urls')
      }
    case ADDURL_FAIL:
    case EDITURL_FAIL:
    case REMOVEURL_FAIL:
      return {
        ...state,
        loadinglink: false,
        errors: [...state.errors, {infoType: 'urls', error: action.error, active: true}]
      }
    case ADDURL_SUCCESS:
      return {
        ...state,
        loadinglink: false,
        data: {
          ...state.data,
          urls: [...state.data.urls, action.result]
        }
      }
    case EDITURL_SUCCESS:
      return {
        ...state,
        loadinglink: false,
        data: {
          ...state.data,
          urls: state.data.urls.map((item) => {
            if (item._id === action.id) {
              return action.result
            }
            return item
          })
        }
      }
    case REMOVEURL_SUCCESS:
      return {
        ...state,
        loadinglink: false,
        data: {
          ...state.data,
          urls: state.data.urls.filter((item) => item._id !== action.id)
        }
      }
    case ADDSUB:
    case REMOVESUB:
      return {
        ...state,
        loadingSubscription: true,
        errors: state.errors.filter((item) => item.infoType !== 'roles')
      }
    case ADDSUB_FAIL:
    case REMOVESUB_FAIL:
      return {
        ...state,
        loadingSubscription: false,
        errors: [...state.errors, {infoType: 'roles', error: action.error, active: true}]
      }
    case ADDSUB_SUCCESS:
      return {
        ...state,
        loadingSubscription: false,
        data: {
          ...state.data,
          roles: state.data.roles.map((item) => {
            if (item.id === action.role) {
              return {...item, subscription: true}
            }
            return item
          })
        }
      }
    case REMOVESUB_SUCCESS:
      return {
        ...state,
        loadingSubscription: false,
        data: {
          ...state.data,
          roles: state.data.roles.map((item) => {
            if (item.id === action.role) {
              return {...item, subscription: false}
            }
            return item
          })
        }
      }
    default:
      return state
  }
}

export function load (infoType) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/info', {
      params: {
        infoType
      }
    }),
    infoType
  }
}

export function updateExternal (infoType, result) {
  return {
    type: LOAD_SUCCESS,
    infoType,
    result
  }
}

export function dismissError (infoType) {
  return {
    type: DISMISS_ERROR,
    infoType
  }
}

export function removeContent (infoType, url) {
  return {
    types: [REMOVE_CONTECT, REMOVE_CONTECT_SUCCESS, REMOVE_CONTECT_FAIL],
    promise: (client) => client.del('/info', {
      data: {
        key: url
      }
    }),
    infoType,
    url
  }
}

export function addUrl (item) {
  return {
    types: [ADDURL, ADDURL_SUCCESS, ADDURL_FAIL],
    promise: (client) => client.post('/userlink', {
      data: item
    })
  }
}

export function editUrl (id, item) {
  return {
    types: [EDITURL, EDITURL_SUCCESS, EDITURL_FAIL],
    promise: (client) => client.put(`/userlink/${id}`, {
      data: item
    }),
    id
  }
}

export function removeUrl (id) {
  return {
    types: [REMOVEURL, REMOVEURL_SUCCESS, REMOVEURL_FAIL],
    promise: (client) => client.del(`/userlink/${id}`),
    id
  }
}

export function addSubscription (role) {
  return {
    types: [ADDSUB, ADDSUB_SUCCESS, ADDSUB_FAIL],
    promise: (client) => client.post('/subscription/add', {
      data: {role}
    }),
    role
  }
}

export function removeSubscription (role) {
  return {
    types: [REMOVESUB, REMOVESUB_SUCCESS, REMOVESUB_FAIL],
    promise: (client) => client.post('/subscription/remove', {
      data: {role}
    }),
    role
  }
}
