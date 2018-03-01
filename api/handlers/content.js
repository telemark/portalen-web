import {fetchUrl} from '../helpers/fetch'
const Boom = require('boom')
const logger = require('../../src/lib/logger')
const config = require('../../src/config')

module.exports.getContent = (request, reply) => {
  const roles = request.query.roles.split(',').join('|')
  const url = `${config.contentApiUrl}?roles=${roles}`
  logger('info', ['content', 'getContent', url])
  fetchUrl(url).then((data) => {
    return reply(data)
  }).catch((error) => {
    logger('error', ['content', 'getContent', error])
    return reply(Boom.internal(error))
  })
}
