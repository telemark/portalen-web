import moment from 'moment'
import pick from 'object.pick'
import omit from 'object.omit'
import Message from '../models/Message'
import config from '../../src/config'
import defaultMessage from '../../src/helpers/defaultMessage'
const logger = require('../../src/lib/logger')

function searchParams (roles = [], userId = '') {
  return {
    role: {'$in': roles},
    date_to: {
      $gte: moment().toDate()
    },
    date_from: {
      $lte: moment().toDate()
    },
    hidefor: {
      $ne: userId
    }
  }
}

function search (request, reply) {
  const start = new Date().getTime()
  const query = request.query.query || ''
  const size = request.query.size || 10
  const offset = request.query.offset || 0
  const userId = request.query.userId || false
  const roles = request.query.roles ? request.query.roles.split(',') : false

  let params = searchParams(roles, userId)
  if (!userId) {
    params = omit(params, ['hidefor'])
  }
  if (!roles) {
    params = omit(params, ['role'])
  }

  Message.search(query, null, {
    skip: parseInt(offset),
    conditions: params,
    limit: parseInt(size)
  }, (err, data) => {
    if (err) {
      return reply(err).code(500)
    }
    reply({
      took: new Date().getTime() - start,
      hits: {
        total: data.totalCount,
        hits: data.results.map((item) => {
          return {
            _type: 'message',
            _id: item._id,
            _score: item._relevance,
            _url: `${config.publicUrl}/meldinger/${item._id}`,
            _source: pick(item, ['_id', 'title', 'text', 'user', 'role', 'date_to', 'date_from'])
          }
        })
      }
    })
  })
}

function readOne (request, reply) {
  Message.findOne({_id: request.params.id})
  .then((doc) => {
    reply(doc)
  })
  .catch((err) => {
    reply(err).code(400)
  })
}

function readAll (request, reply) {
  const {roles, offset, limit} = {
    roles: request.query.roles ? request.query.roles.split('|') : request.auth.credentials.role,
    limit: request.query.limit || 20,
    offset: request.query.offset || 0
  }
  const params = searchParams(roles, request.auth.credentials.userId)
  Promise.all([
    /* First fetch all you likes */
    Message.find({...params, likes: request.auth.credentials.userId})
    .sort({'date_from': -1}),
    /* Then fill all other */
    Message.find({...params, likes: {$ne: request.auth.credentials.userId}})
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .sort({'date_from': -1})
  ]).then((promises) => {
    reply([...promises[0], ...promises[1]])
  })
  .catch((err) => {
    reply(err).code(400)
  })
}

export function createMessage (payload, request) {
  const template = defaultMessage()
  return new Promise((resolve, reject) => {
    const userId = request.auth.credentials.userId
    logger('info', ['messages', 'createMessage', 'user', userId, 'start'])
    new Message({
      ...template,
      ...pick(payload, ['title', 'text', 'user', 'role']),
      date_from: payload.date_from ? moment(payload.date_from).toDate() : template.date_from,
      date_to: payload.date_to ? moment(payload.date_to).toDate() : template.date_to
    })
    .save()
    .then((doc) => {
      logger('info', ['messages', 'createMessage', 'user', userId, 'success', doc._id])
      if (shouldShowMessage(doc)) {
        publishMessage(request, doc)
      }
      resolve(doc)
    })
    .catch((err) => {
      logger('error', ['messages', 'createMessage', 'user', userId, err])
      reject(err)
    })
  })
}

function create (request, reply) {
  const {payload, auth: {credentials}} = request
  createMessage({
    ...payload,
    user: pick(credentials, ['cn', 'mail'])
  }, request)
  .then((doc) => reply(doc))
  .catch((err) => reply(err))
}

function shouldShowMessage (doc) {
  const now = new Date().getTime()
  return (doc.date_from.getTime() < now && doc.date_to.getTime() > now)
}

function publishMessage (request, doc, obj = false) {
  doc.role.forEach((role) => {
    request.server.publish(`/messageupdates/${role}`, obj || doc)
  })
}

function update (request, reply) {
  Message.findOne({_id: request.params.id})
  .then((doc) => {
    doc.title = request.payload.title
    doc.text = request.payload.text
    doc.date_from = moment(request.payload.date_from).toDate()
    doc.date_to = moment(request.payload.date_to).toDate()
    doc.role = request.payload.role
    return doc.save()
  })
  .then((doc) => {
    reply(doc)
    if (shouldShowMessage(doc)) {
      publishMessage(request, doc)
    }
  })
  .catch((err) => {
    reply(err).code(400)
  })
}

function remove (request, reply) {
  const userId = request.auth.credentials.userId
  logger('info', ['messages', 'remove', 'user', userId, 'message', request.params.id, 'start'])
  Message.findOne({_id: request.params.id})
  .then((doc) => {
    return doc.remove()
  })
  .then((doc) => {
    reply(doc)
    if (shouldShowMessage(doc)) {
      publishMessage(request, doc, {deleted: request.params.id})
    }
  })
  .catch((err) => {
    logger('error', ['messages', 'remove', 'user', userId, 'message', request.params.id, error])
    reply(err).code(400)
  })
}

function likeMessage (request, reply) {
  Message.findOne({_id: request.params.id})
  .then((doc) => {
    const likes = [...doc.likes]
    likes.push(request.auth.credentials.userId)
    doc.likes = likes
    return doc.save()
  })
  .then((doc) => {
    reply(doc)
    if (shouldShowMessage(doc)) {
      publishMessage(request, doc)
    }
  })
  .catch((err) => {
    reply(err).code(400)
  })
}

function hideMessage (request, reply) {
  Message.findOne({_id: request.params.id})
  .then((doc) => {
    const hidefor = [...doc.hidefor]
    hidefor.push(request.auth.credentials.userId)
    doc.hidefor = hidefor
    return doc.save()
  })
  .then((doc) => {
    reply(doc)
    if (shouldShowMessage(doc)) {
      publishMessage(request, doc)
    }
  })
  .catch((err) => {
    reply(err).code(400)
  })
}

function unLikeMessage (request, reply) {
  Message.findOne({_id: request.params.id})
  .then((doc) => {
    doc.likes = doc.likes.filter((user) => user !== request.auth.credentials.userId)
    return doc.save()
  })
  .then((doc) => {
    reply(doc)
    if (shouldShowMessage(doc)) {
      publishMessage(request, doc)
    }
  })
  .catch((err) => {
    reply(err).code(400)
  })
}

const Messages = {
  readOne,
  readAll,
  create,
  update,
  remove,
  likeMessage,
  unLikeMessage,
  hideMessage,
  search
}

export default Messages
