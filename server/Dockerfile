# Dependencies

FROM node:16 as deps
WORKDIR /usr/src/app

COPY ./server/package.json package.json
COPY ./server/package-lock.json* package-lock.json

# I have such a love hate relationship with Docker
# Thanks to @Grasume#1295 on Discord btw for showing me this syntax
RUN npm install -g typescript
RUN npm install -g tsoa
RUN npm install -g jest
RUN npm install -g pm2
RUN npm install -g
RUN npm install

# Build

FROM deps as build
COPY ./server/ /usr/src/app/
COPY ./config.jsonc /usr/src/app/

RUN tsoa spec-and-routes

RUN tsc

EXPOSE 8000

# Deploy

FROM build as deploy
CMD node ./dist/index.js

# Test

FROM build as test
RUN chmod u+x ./test.sh
CMD ./test.sh