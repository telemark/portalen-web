'use strict'

var Handler = require('../handlers/links')

const Routes = [
  {
    method: 'GET',
    path: '/api/links',
    config: {
      handler: Handler.links,
      auth: false
    }
  }
]

module.exports = Routes
