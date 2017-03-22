[![Build Status](https://travis-ci.org/telemark/portalen-web.svg?branch=master)](https://travis-ci.org/telemark/portalen-web)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Greenkeeper badge](https://badges.greenkeeper.io/telemark/portalen-web.svg)](https://greenkeeper.io/)

# portalen-web

web frontend for portalen

## Installasjon

```bash
npm install
```

## Starte utviklingsserver

```bash
# Du må kjøre en build før du kjører npm run dev første gangen for at webpack-isomorphic-tools skal få bygd en config-fil over frontend-ressurser som brukes i appen.
npm run build
npm run dev
```

## Bygging og kjøring av prod server

```bash
npm run build
npm run start
```
## Docker

Sett opp evt nødvendige endringer i portale.env

```bash
$ docker-compose up
```

## License

[MIT](LICENSE)

![Robohash image of portalen-web](https://robots.kebabstudios.party/portalen-web.png "Robohash image of portalen-web")
