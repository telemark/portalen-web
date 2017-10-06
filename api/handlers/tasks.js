import config from '../../src/config'

const Wreck = require('wreck')
const jwt = require('jsonwebtoken')
const jwtKey = config.tasks.key
const tasksUrl = config.tasks.url
const logger = require('../../src/lib/logger')

export function getTasks (request) {
  return new Promise(async (resolve, reject) => {
    const user = request.auth.credentials.userId
    const name = request.auth.credentials.cn
    const url = tasksUrl + '/' + user
    const tokenOptions = {
      expiresIn: '1h',
      issuer: 'https://auth.t-fk.no'
    }
    const data = {
      user: user,
      name: name,
      system: 'portalen-forside'
    }
    const token = jwt.sign(data, jwtKey, tokenOptions)
    const options = {
      json: true,
      timeout: 1000,
      headers: {
        Authorization: token
      }
    }

    logger('info', ['tasks', 'getTasks', 'user', user])
    try {
      const { payload } = await Wreck.get(url, options)
      logger('info', ['tasks', 'getTasks', 'user', user, 'success'])
      resolve(payload)
    } catch (error) {
      logger('error', ['tasks', 'getTasks', 'user', user, error])
      reject(error)
    }
  })
}
