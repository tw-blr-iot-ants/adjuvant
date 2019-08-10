# Adjuvant

[![CircleCI](https://circleci.com/gh/twlabs/kanjuice/tree/master.svg?style=svg&circle-token=87a3cf0ef964e8a31e89fc49e0c93675ad79a660)](https://circleci.com/gh/twlabs/kanjuice/tree/master)

## Steps to start the app

##### Start mongodb locally
```
docker-compose -f docker-compose-dev.yml up
```

##### Start node server locally
```sh
$ npm start

> adjuvant-admin@1.0.0 start
> node index.js

********************************************
Mongo db url mongodb://localhost:27017/adjuvant
App listening on port 8083
Mongo connection successful mongodb://localhost:27017/adjuvant
```

## Running tests

```sh
$  npm test

> adjuvant-admin@1.0.0 test
> nodemon -x 'mocha --recursive'

--- Test output ---
```
