'use strict'

var Handler = require('../handlers/ping')

const Ping = [
  {
    method: 'GET',
    path: '/api/ping',
    config: {
      handler: Handler.ping,
      auth: false
    }
  }
]

module.exports = Ping
