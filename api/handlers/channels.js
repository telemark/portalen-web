'use strict'
import NewsItem from '../models/NewsItem'
import {filterContentItems} from '../helpers/fetch'
import {createMessage} from '../routes/messages'

module.exports.updateMessages = (request, reply) => {
  const payload = request.payload
  createMessage(payload, request)
  .then((doc) => reply({ok: true, message: 'Messages updated'}))
  .catch((err) => reply(err))
}

module.exports.updateContent = (request, reply) => {
  const {payload: {data}, auth: {credentials: {userId}}} = request
  NewsItem.find({user: userId}).then((items) => {
    request.server.publish('/contentupdates', {
      ...data,
      ads: data.ads ? filterContentItems(data.ads, items) : [],
      news: data.news ? filterContentItems(data.news, items) : []
    })
    reply({ok: true, message: 'Content updated'})
  })
  .catch((error) => reply(error).code(403))
}

module.exports.updateTasks = (request, reply) => {
  const payload = request.payload

  request.server.publish('/tasksupdates', payload)

  reply({ok: true, message: 'Tasks updated'})
}
