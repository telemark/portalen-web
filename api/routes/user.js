import jwt from 'jsonwebtoken'
import shortid from 'shortid'
import {fetchUrl, makeUrl} from '../helpers/fetch'
import config from '../../src/config'
import configLDAP from '../../src/configLDAP'
import verifySigninJwt from '../../src/lib/verify-signin-jwt'

function signin (request, reply) {
  const token = request.query.jwt
  verifySigninJwt(token).then(data => {
    const makeUrlFunc = makeUrl(request.server.info.uri.toLowerCase(), data)
    fetchUrl(makeUrlFunc(config.api.userRoles))
      .then((roles) => {
        data.roles = roles
        data.rolesJoined = roles.join()
        const token = jwt.sign(data, config.tokenSecret, {
          expiresIn: `${config.sessionTimeoutDays} days`
        })
        const sid = shortid.generate()
        request.server.app.cache.set(sid, {token: token}, 0, (err) => {
          if (err) {
            return reply(err)
          }
          request.cookieAuth.set({sid: sid})
          reply(data)
        })
      })
      .catch((err) => {
        reply(err)
      })
  }).catch(error => {
    console.error(error)
    reply({error: error.name || JSON.stringify(error)}).code(500)
  })
}

function login (request, reply) {
  const payload = request.payload
  const username = payload.username
  const password = payload.password
  const LdapAuth = require('ldapauth-fork')
  const auth = new LdapAuth(configLDAP)
  auth.authenticate(username, password, (err, user) => {
    if (err) {
      reply({error: err.name || JSON.stringify(err)}).code(500)
    } else {
      var data = {
        cn: user.cn,
        userId: user.sAMAccountName || user.uid || '',
        company: user.company || config.api.defaults.company,
        mail: user.mail || config.api.defaults.mail
      }
      const makeUrlFunc = makeUrl(request.server.info.uri.toLowerCase(), data)
      fetchUrl(makeUrlFunc(config.api.userRoles))
      .then((roles) => {
        data.roles = roles
        data.rolesJoined = roles.join()
        const token = jwt.sign(data, config.tokenSecret, {
          expiresIn: `${config.sessionTimeoutDays} days`
        })
        const sid = shortid.generate()
        request.server.app.cache.set(sid, {token: token}, 0, (err) => {
          if (err) {
            return reply(err)
          }
          request.cookieAuth.set({sid: sid})
          reply(data)
        })
      })
      .catch((err) => {
        reply(err)
      })
    }
  })
}

function logout (request, reply) {
  request.cookieAuth.clear()
  reply(null)
}

function decodeToken (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err) {
        return reject(null)
      }
      resolve(decoded)
    })
  })
}

function loadAuth (request, reply) {
  if (request.auth.isAuthenticated) {
    return reply(Object.assign({}, request.auth.credentials, {
      token: request.headers.cookie
    }))
  }
  reply({})
}

function requireAuth (request, session, callback) {
  request.server.app.cache.get(session.sid, (err, cached) => {
    if (err) {
      return callback(err, false)
    }
    if (!cached) {
      return callback(null, false)
    }
    decodeToken(cached.token)
      .then((user) => {
        callback(null, true, user)
      })
      .catch((err) => {
        callback(err, false)
      })
  })
}

const User = {
  login,
  logout,
  loadAuth,
  requireAuth,
  signin
}
export default User
