require('babel-polyfill')

const environment = {
  development: {
    isProduction: false,
    wsFullUrl: 'ws://localhost:3030'
  },
  production: {
    isProduction: true,
    wsFullUrl: 'wss://api.portalen.t-fk.no'
  }
}[process.env.NODE_ENV || 'development']

module.exports = Object.assign({
  jwtSecret: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go, Louie Louie, oh no, I got to go',
  piwikURL: process.env.PIWIK_URL || 'https://piwik.service.t-fk.no',
  piwikSiteID: process.env.PIWIK_SITE_ID || 1,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:3000',
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT || 3030,
  originUrl: process.env.ORIGIN_URL || 'http://localhost:3000/user/signin',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'https://auth.service.t-fk.no/login',
  databaseUri: process.env.DATABASE_URI || 'mongodb://localhost:27017/tfk_portalen',
  sessionSecret: process.env.SESSION_SECRET || 'the-password-must-be-at-least-32-characters-long',
  sessionTimeoutDays: process.env.SESSION_TIMEOUT || 7,
  sessionStorageUrl: process.env.SESSION_STORAGE_URL || 'https://tmp.storage.service.t-fk.no',
  tokenSecret: process.env.TOKEN_SECRET || 'supersecret',
  encryptorSecret: process.env.ENCRYPTOR_SECRET || 'Louie Louie, oh no, I got to go, Louie Louie, oh no, I got to go',
  wsProtocol: process.env.WSPROTOCOL || 'ws',
  tasks: {
    key: process.env.PORTALEN_TASKS_JWT_KEY || 'Louie Louie, oh no, I got to go',
    url: process.env.PORTALEN_TASKS_SERVICE_URL || 'https://tasks.portalen.no'
  },
  apiTimeout: 3000,
  api: {
    links: process.env.API_LINKS || '/api/links?roles={rolesJoined}',
    userRoles: process.env.API_ROLES_USER || '/api/roles/map?company={company}',
    roles: process.env.API_ROLES || '/api/roles/list',
    shortcuts: process.env.API_SHORTCUTS || '/api/shortcuts?roles={rolesJoined}',
    tasks: process.env.API_TASKS || null,
    content: process.env.API_CONTENT || '/api/content/{userId}?roles={rolesJoined}',
    search: process.env.API_SEARCH || 'https://search.portalen.t-fk.no/api/search',
    jwtSecret: process.env.API_JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
    defaults: {
      company: process.env.DEFAULTS_COMPANY || 'Sentraladministrasjonen',
      mail: process.env.DEFAULTS_MAIL || 'post@tfk.no',
      roles: ['alle', 'administrasjonen', 'sentraladministrasjonen']
    }
  },
  feedback: {
    url: process.env.FEEDBACK_URL || 'https://api.github.com/repos/telemark/portalen-forside/issues',
    token: process.env.FEEDBACK_TOKEN || 'github token'
  },
  app: {
    title: 'Forsiden',
    description: 'Din start på arbeidsdagen',
    head: {
      titleTemplate: 'Forsiden: %s',
      meta: [
        {name: 'description', content: 'Din start på arbeidsdagen'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'Forsiden'},
        {property: 'og:image', content: ''},
        {property: 'og:locale', content: 'nb_NO'},
        {property: 'og:title', content: 'Portalen'},
        {property: 'og:description', content: 'Din start på arbeidsdagen'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@telemark'},
        {property: 'og:creator', content: '@telemark'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  }
}, environment)
