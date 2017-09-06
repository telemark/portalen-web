'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')
const logger = require('../../src/lib/logger')

module.exports.shortcuts = (request, reply) => {
  const roles = request.query.roles.split(',').join('|')
  const myIp = request.query.ip ? `&myIp=${request.query.ip}` : ''
  const url = `https://shortcuts.portalen.win/shortcuts?roles=${roles}${myIp}`
  logger('info', ['shortcuts', url])
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    return reply(Boom.internal(error))
  })
}
