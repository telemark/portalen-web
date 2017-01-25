'use strict'

const Handler = require('../handlers/shortcuts')

module.exports = [
  {
    method: 'GET',
    path: '/api/shortcuts',
    config: {
      handler: Handler.shortcuts,
      auth: false
    }
  }
]
