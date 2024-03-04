# NestJS ![nestjs32x32](https://github.com/imanhpr/nest-assignment/assets/56130647/facef099-7c17-4d9c-ae36-84265b05e31a) Code Assignment
This project is meant to be used as a code assignment which was given to me for a job interview.


## How To Run The Project ?
Try to install dependency with ```pnpm``` and then set these enviroment varibles.
```
DB_PASSWORD=<postgres_db_password>
DB_USERNAME=<postgres_db_username>
DB_NAME=<database name>
DB_HOST=<database host>
JWT_SECRET_KEY=<set a secret key here>
```

### This Instruction doesn't work
Please follow the below instructions.
1. At first install ```docker``` on your system and then use
2. Run this command ```docker compose up -d```

You can change ```docker compose.yml``` file as you want.
```yml
version: "3"

services:
  pgdb:
    image: postgres:latest
    container_name: postgres_db
    restart: always
    environment:
      POSTGRES_USER: <SET_DB_USERNAME>
      POSTGRES_PASSWORD: <SET_DB_PASSWORD>
      POSTGRES_DB: <SET_DB_NAME>

  nest-api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nest-api
    restart: always
    ports:
      - 3000:3000
    depends_on:
      - pgdb
    environment:
      DB_PASSWORD: <DB_PASSWORD>
      DB_USERNAME: <DB_USERNAME>
      DB_NAME: <DB_NAME>
      DB_HOST: pgdb
      JWT_SECRET_KEY: <SECRET_KEY>

```
## HTTP API Endpoints document
In the root of project there is ```hopp-http-collection.json``` file. import this file into [hoppscotch](https://hoppscotch.io/)

## Helper Scripts
- ```pnpm build``` : It builds project and generates transpiled .js files.
- ```pnpm start:dev``` : It starts development server
- ```pnpm test``` : It runs unit tests.
- ```pnpm test:coverage``` : It runs the tests and then generate ```html``` coverage file.
- ```pnpm test:watch``` : It runs test in watch mode.

## Project Features
- It uses [Fastify](https://fastify.dev/) ![fastify16x16](https://github.com/imanhpr/nest-assignment/assets/56130647/3213f226-085c-4963-88cb-58f43649a626)
 as the webserver to achieve blazing-fast speed 🔥.
- It uses [SWC](https://swc.rs/) 🦀 compiler for faster build time during development and CI/CD pipelines.
- It uses [Vitest](https://vitest.dev/) 🧪 as the main test runner to have great fetureas like test graph. checkout ```pnpm vitest --ui```
- It uses [pnpm](https://pnpm.io/) 📦 as the package manager to save extra disk space to save a little bit money 💸.
- It uses [Mikro-ORM](https://mikro-orm.io/) with different patterns like **DataMapper** to showcase mikro-orm capabilities 💪
- It uses [decimal.js](https://mikemcl.github.io/decimal.js/) to have a high precision of numbers and to avoid [IEEE 754 floating point](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) pitfalls when working with monetary system

## The Things We Can Improve
- Useing [**DAO (Data Access Object) Pattern**](https://www.digitalocean.com/community/tutorials/dao-design-pattern) to eliminate dependency between **ORM** And **Business Logics**
- Adding more integration and unit tests. One of the project modules doesn't have any tests at all.
  - Test Coverage :
    - UtilModule - 100% - ✅
    - AuthModule - 80% - ✅
    - CurrencyModule 70% - ⚠️
    - WalletModule - No Test - ❌
- Adding End2End testing pipeline to the project.
