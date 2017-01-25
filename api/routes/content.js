'use strict'

var Handler = require('../handlers/content')

const Routes = [
  {
    method: 'GET',
    path: '/api/content/{user}',
    config: {
      handler: Handler.getContent,
      auth: false
    }
  }
]

module.exports = Routes
