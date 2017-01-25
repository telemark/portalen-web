#!/usr/bin/env node
if (process.env.NODE_ENV !== 'production') {
  if (!require('piping')({
    hook: true,
    respawnOnExit: false,
    ignore: /(\/\.|~$|\.json$)/i})) {
    return
  }
}
require('../server.babel')
require('../api/api')
