[![Build Status](https://snap-ci.com/tw-blr-iot-ants/adjuvant/branch/master/build_image)](https://snap-ci.com/tw-blr-iot-ants/adjuvant/branch/master)

# Adjuvant
### Steps to start the app.

##### Start mongodb locally

```
docker-compose -f docker-compose-dev.yml up
```

##### Start node server locally
```sh
$ node index.js
```

## Steps for running Javascript Unit Tests

```sh
$ cd public
$  ./node_modules/karma/bin/karma start --single-run
```

## Steps for running APi Tests


```sh
$ ./node_modules/.bin/mocha
```
