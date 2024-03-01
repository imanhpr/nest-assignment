# NestJS Code Assignment
This project is meant to be used as a code assignment which was given to me for a job interview.

## How To Run The Project ?
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