FROM node:8.12.0-alpine

EXPOSE 3000

RUN apk add --no-cache --update bash

ADD ./ /opt/app
WORKDIR /opt/app

RUN yarn install

CMD yarn start