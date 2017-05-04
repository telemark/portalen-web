'use strict'

'use strict'

import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')

module.exports.getContent = (request, reply) => {
  const roles = request.query.roles.split(',').join('|')

  const url = `https://content.portalen.win?roles=${roles}`
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    return reply(Boom.internal(error))
  })
}
