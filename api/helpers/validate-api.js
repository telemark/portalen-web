'use strict'

module.exports = (decoded, request, callback) => {
  if (!decoded) {
    return callback(null, false)
  } else {
    return callback(null, true)
  }
}
