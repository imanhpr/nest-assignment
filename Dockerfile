FROM node:20.11.0-alpine3.19 as base

EXPOSE 3000
RUN corepack enable
WORKDIR /build

COPY ./package.json .
COPY ./pnpm-lock.yaml .


FROM base AS build
RUN pnpm install --frozen-lockfile --loglevel info
COPY . ./
RUN pnpm build

FROM base AS prod-dep
RUN pnpm install --prod --frozen-lockfile --loglevel info

FROM base AS release
WORKDIR /app
COPY --from=build /build/dist /app/dist
COPY --from=prod-dep /build/node_modules /app/node_modules

ENTRYPOINT ["node","--experimental-detect-module","--trace-exit","--trace-sigint" , "--trace-uncaught", "--trace-warnings" , "dist/main.js"]
