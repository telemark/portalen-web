'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')
const logger = require('../../src/lib/logger')

module.exports.mapRoles = (request, reply) => {
  const company = request.query.company
  const url = `https://roles.portalen.win/roles?company=${company}`
  logger('info', ['roles', 'mapRoles', url])
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    logger('error', ['roles', 'mapRoles', error])
    return reply(Boom.internal(error))
  })
}

module.exports.listRoles = (request, reply) => {
  const url = `https://roles.portalen.win/roles`
  logger('info', ['roles', 'listRoles', url])
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    logger('error', ['roles', 'listRoles', error])
    return reply(Boom.internal(error))
  })
}
