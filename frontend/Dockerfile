# Dependencies

FROM node:16
WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json* package.lock.json

RUN npm install -g openapi-typescript-codegen
RUN npm install -g
RUN npm install

# Deploy

COPY . /usr/src/app/
CMD npm run dev
