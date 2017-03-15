'use strict'

const config = require('../config')
const jwt = require('jsonwebtoken')
const encryptor = require('simple-encryptor')(config.encryptorSecret)
const superagent = require('superagent')

module.exports = token => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('Missing required signin jwt'))
    } else {
      jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
        if (error) {
          reject(error)
        } else {
          const decrypted = encryptor.decrypt(decoded.data)
          const sessionUrl = `${config.sessionStorageUrl}/${decrypted.session}`
          superagent.get(sessionUrl)
            .then(result => {
              const user = encryptor.decrypt(result.data.value)
              const data = {
                cn: user.displayName || user.cn || '',
                userId: user.sAMAccountName || user.uid || '',
                company: user.company || config.api.defaults.company,
                mail: user.mail || config.api.defaults.mail
              }
              resolve(data)
            })
            .catch(error => {
              reject(error)
            })
        }
      })
    }
  })
}
