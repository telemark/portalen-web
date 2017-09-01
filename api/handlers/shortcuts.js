'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')
const logger = require('../../src/lib/logger')

function getMyIp (info) {
  return info.remoteAddress ? `&myIp=${info.remoteAddress}` : ''
}

module.exports.shortcuts = (request, reply) => {
  const roles = request.query.roles.split(',').join('|')
  const url = `https://shortcuts.portalen.win/shortcuts?roles=${roles}${getMyIp(request.info)}`
  logger('info', ['shortcuts', url])
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    return reply(Boom.internal(error))
  })
}
