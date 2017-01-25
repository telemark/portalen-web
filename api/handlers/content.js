'use strict'

const Boom = require('boom')

function getContent (request, reply) {
  var pattern = {role: 'info', type: 'user'}
  var user = request.params.user
  var roles = request.query.roles.split(',')
  var payload = {
    roles: roles,
    user: user
  }

  request.seneca.act(pattern, payload, function (error, data) {
    if (error) {
      return reply(Boom.internal(error))
    } else {
      return reply(data)
    }
  })
}

module.exports.getContent = getContent
