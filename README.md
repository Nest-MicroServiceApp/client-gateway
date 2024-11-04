<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>



## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Librerías

```bash 
#microservice
yarn add  @nestjs/microservices
#joi
$ yarn add joi
#dotenv
$ yarn add dotenv
```

## Nats

```
$ docker run -d --name nats-main -p 4222:4222  -p 8222:8222 nats
```