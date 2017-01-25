'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')

module.exports.shortcuts = (request, reply) => {
  const roles = request.query.roles.split(',').join('|')

  const url = `https://shortcuts.portalen.t-fk.win/shortcuts?roles=${roles}`
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    return reply(Boom.internal(error))
  })
}
