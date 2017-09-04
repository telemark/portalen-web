'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')
const logger = require('../../src/lib/logger')

function getMyIp (request) {
  const ip = request.headers['x-forwarded-for'] ? request.headers['x-forwarded-for'] : request.info.remoteAddress
  return `&myIp=${ip}`
}

module.exports.shortcuts = (request, reply) => {
  const roles = request.query.roles.split(',').join('|')
  const url = `https://shortcuts.portalen.win/shortcuts?roles=${roles}${getMyIp(request)}`
  logger('info', ['shortcuts', url])
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    return reply(Boom.internal(error))
  })
}
