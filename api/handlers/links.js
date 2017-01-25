'use strict'

const Boom = require('boom')

function links (request, reply) {
  var pattern = {cmd: 'collect-links', type: 'user'}
  var roles = request.query.roles.split(',')
  var payload = {roles: roles}

  request.seneca.act(pattern, payload, function (error, data) {
    if (error) {
      return reply(Boom.internal(error))
    } else {
      return reply(data)
    }
  })
}

module.exports.links = links
