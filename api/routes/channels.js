'use strict'

const handlers = require('../handlers/channels')

module.exports = [
  {
    method: 'POST',
    path: '/channels/update/content',
    handler: handlers.updateContent,
    config: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/channels/update/messages',
    handler: handlers.updateMessages,
    config: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/channels/update/tasks',
    handler: handlers.updateTasks,
    config: {
      auth: 'jwt'
    }
  }
]
