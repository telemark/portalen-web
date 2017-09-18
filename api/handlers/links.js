'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')
const logger = require('../../src/lib/logger')

module.exports.links = (request, reply) => {
  const roles = request.query.roles.split(',').join('|')
  const url = `https://links.portalen.win/links?roles=${roles}`
  logger('info', ['links', url])
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    logger('error', ['links', error])
    return reply(Boom.internal(error))
  })
}
