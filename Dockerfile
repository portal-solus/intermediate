# builder image

FROM node:alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN node src/index.js

# prod image

FROM node:alpine AS production

WORKDIR /usr/src/app

RUN npm install -g json-server

COPY --from=builder /usr/src/app/db.json ./

COPY json-server.json ./

EXPOSE 3000

CMD json-server --watch db.json

