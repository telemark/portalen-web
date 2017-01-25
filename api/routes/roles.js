'use strict'

const Handler = require('../handlers/roles')

module.exports = [
  {
    method: 'GET',
    path: '/api/roles/map',
    config: {
      handler: Handler.mapRoles,
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/api/roles/list',
    config: {
      handler: Handler.listRoles,
      auth: false
    }
  }
]
