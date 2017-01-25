require('babel-polyfill')

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development']

function ldapTlsSettings () {
  var config = false
  var fs = require('fs')
  var path = require('path')
  if (process.env.LDAP_TLS_SETTINGS) {
    config = {
      rejectUnauthorized: process.env.LDAP_TLS_REJECT_UNAUTHORIZED ? true : false, // eslint-disable-line no-unneeded-ternary
      ca: [
        fs.readFileSync(path.join(__dirname, process.env.LDAP_TLS_CA_PATH))
      ]
    }
  }
  return config
}

module.exports = Object.assign({
  url: process.env.LDAP_URL || 'ldap://ldap.forumsys.com:389',
  bindDn: process.env.LDAP_BIND_DN || 'cn=read-only-admin,dc=example,dc=com',
  bindCredentials: process.env.LDAP_BIND_CREDENTIALS || 'password',
  searchBase: process.env.LDAP_SEARCH_BASE || 'dc=example,dc=com',
  searchFilter: process.env.LDAP_SEARCH_FILTER || '(uid={{username}})',
  tlsOptions: ldapTlsSettings()
}, environment)
