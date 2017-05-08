'use strict'

var Handler = require('../handlers/ping')

const Ping = [
  {
    method: 'GET',
    path: '/system/ping',
    config: {
      handler: Handler.ping,
      auth: false
    }
  }
]

module.exports = Ping
