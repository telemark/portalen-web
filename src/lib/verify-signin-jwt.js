'use strict'

const config = require('../config')
const jwt = require('jsonwebtoken')
const encryptor = require('simple-encryptor')(config.encryptorSecret)
const superagent = require('superagent')
const logger = require('./logger')

module.exports = token => {
  return new Promise((resolve, reject) => {
    if (!token) {
      const error = new Error('Missing required signin jwt')
      logger('error', ['verify-signin-jwt', error])
      reject(error)
    } else {
      jwt.verify(token, config.jwtSecret, (error, decoded) => {
        if (error) {
          logger('error', ['verify-signin-jwt', 'JWT verification failed', error])
          reject(error)
        } else {
          const decrypted = encryptor.decrypt(decoded.data)
          const sessionUrl = `${config.sessionStorageUrl}/${decrypted.session}`
          logger('info', ['verify-signin-jwt', 'JWT ok', 'userId', decrypted.userId])
          superagent.get(sessionUrl)
            .then(result => {
              const user = encryptor.decrypt(result.body.value)
              const data = {
                cn: user.displayName || user.cn || '',
                userId: user.sAMAccountName || user.uid || '',
                company: user.company || config.api.defaults.company,
                mail: user.mail || config.api.defaults.mail
              }
              logger('info', ['verify-signin-jwt', 'external session ok', 'userId', data.userId])
              resolve(data)
            })
            .catch(error => {
              logger('error', ['verify-signin-jwt', 'external session', 'userId', decrypted.userId, error])
              reject(error)
            })
        }
      })
    }
  })
}
