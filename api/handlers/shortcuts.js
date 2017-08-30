'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')

module.exports.shortcuts = (request, reply) => {
  const roles = request.query.roles.split(',').join('|')
  fetchUrl('https://api.ipify.org/?format=json').then(response => {
    console.log(response)
    const url = `https://shortcuts.portalen.win/shortcuts?roles=${roles}&myIp=${response.ip}`
    fetchUrl(url).then((data) => {
      return reply(data)
    }).catch((error) => {
      return reply(Boom.internal(error))
    })
  }).catch(error => {
    return reply(Boom.internal(error))
  })
}
