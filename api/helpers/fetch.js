import superagent from 'superagent'
import format from 'string-template'

export function fetchUrl (url, fallback = []) {
  return new Promise((resolve, reject) => {
    superagent
    .get(url)
    .end((err, { body } = {}) => err ? reject(err) : resolve(body.data || body))
  })
}

export function makeUrl (serverUrl, userObject) {
  return (url) => {
    const path = format(url, userObject)
    return `${serverUrl}${path}`
  }
}

export function filterContentItems (items, itemsHidden) {
  return items.filter((item) => {
    return !itemsHidden.find((hidden) => hidden.key === item.url)
  })
}
