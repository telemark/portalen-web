'use strict'

const pkg = require('../../package.json')

module.exports.ping = (request, reply) => {
  reply({
    name: pkg.name,
    version: pkg.version,
    uptime: process.uptime()
  })
}
