'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')

module.exports.links = (request, reply) => {
  const roles = request.query.roles.split(',').join('|')

  const url = `https://links.portalen.win/links?roles=${roles}`
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    return reply(Boom.internal(error))
  })
}
