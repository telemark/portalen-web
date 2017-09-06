import {fetchUrl, makeUrl, filterContentItems} from '../helpers/fetch'
import {getTasks} from '../handlers/tasks'
import NewsItem from '../models/NewsItem'
import UserLink from '../models/UserLink'
import MessageSubscription from '../models/MessageSubscription'
import config from '../../src/config'

function customizeRoles (items, userSubscription, roles) {
  return items.map((item) => {
    if (roles.find((id) => item.id === id)) {
      return {...item, subscription: true, required: true}
    }
    return {...item, subscription: !!userSubscription.find((hidden) => hidden.role === item.id)}
  })
}

function readAll (request, reply) {
  const makeUrlFunc = makeUrl(request.server.info.uri.toLowerCase(), {...request.auth.credentials, ip: request.headers['x-forwarded-for']})
  const errorFunction = (error) => reply({error: `Lasting av ${request.query.infoType} feilet`, errorObject: error}).code(403)
  switch (request.query.infoType) {
    case 'links':
      return fetchUrl(makeUrlFunc(config.api.links)).then((data) => {
        reply(data)
      }).catch(errorFunction)
    case 'roles':
      return Promise.all([
        fetchUrl(makeUrlFunc(config.api.roles)),
        MessageSubscription.find({user: request.auth.credentials.userId})
      ]).then((data) => reply(customizeRoles(data[0], data[1], request.auth.credentials.roles)))
      .catch(errorFunction)
    case 'shortcuts':
      return fetchUrl(makeUrlFunc(config.api.shortcuts)).then((data) => reply(data)).catch(errorFunction)
    case 'tasks':
      return getTasks(request).then((data) => reply(data.data || [])).catch(errorFunction)
    case 'ads':
      return Promise.all([
        fetchUrl(makeUrlFunc(config.api.content)),
        NewsItem.find({user: request.auth.credentials.userId})
      ]).then((data) => reply(data[0].ads ? filterContentItems(data[0].ads, data[1]) : []))
      .catch(errorFunction)
    case 'news':
      return Promise.all([
        fetchUrl(makeUrlFunc(config.api.content)),
        NewsItem.find({user: request.auth.credentials.userId})
      ]).then((data) => reply(data[0].news ? filterContentItems(data[0].news, data[1]) : []))
      .catch(errorFunction)
    case 'urls':
      return UserLink.find({user: request.auth.credentials.userId}).then((data) => reply(data || [])).catch(errorFunction)
    default:
      return reply(null)
  }
}

function remove (request, reply) {
  new NewsItem({
    user: request.auth.credentials.userId,
    key: request.payload.key
  })
  .save()
  .then((item) => reply(item))
  .catch((err) => reply(err).code(403))
}

/* Urls */
function createLink (request, reply) {
  new UserLink({
    user: request.auth.credentials.userId,
    title: request.payload.title,
    url: request.payload.url
  })
  .save()
  .then((item) => reply(item))
  .catch((err) => reply(err).code(403))
}

function editLink (request, reply) {
  UserLink.findOne({_id: request.params.id, user: request.auth.credentials.userId})
  .then((doc) => {
    doc.title = request.payload.title
    doc.url = request.payload.url
    return doc.save()
  })
  .then((doc) => {
    reply(doc)
  })
  .catch((err) => {
    reply(err).code(403)
  })
}

function removeLink (request, reply) {
  UserLink.findOne({_id: request.params.id, user: request.auth.credentials.userId})
  .then((doc) => {
    return doc.remove()
  })
  .then((doc) => {
    reply(doc)
  })
  .catch((err) => {
    reply(err).code(403)
  })
}

/* Message subscription */

function addSubscription (request, reply) {
  new MessageSubscription({
    user: request.auth.credentials.userId,
    role: request.payload.role
  })
  .save()
  .then((item) => reply(item))
  .catch((err) => reply(err).code(403))
}

function removeSubscription (request, reply) {
  MessageSubscription.findOne({role: request.payload.role, user: request.auth.credentials.userId})
  .then((doc) => {
    return doc.remove()
  })
  .then((doc) => {
    reply(doc)
  })
  .catch((err) => {
    reply(err).code(403)
  })
}

const Info = {
  readAll,
  remove,
  createLink,
  editLink,
  removeLink,
  addSubscription,
  removeSubscription
}

export default Info
