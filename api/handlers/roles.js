'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')

module.exports.mapRoles = (request, reply) => {
  const company = request.query.company
  const url = `https://roles.portalen.win/roles?company=${company}`
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    return reply(Boom.internal(error))
  })
}

module.exports.listRoles = (request, reply) => {
  const url = `https://roles.portalen.win/roles`
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    return reply(Boom.internal(error))
  })
}
