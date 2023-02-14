# Package Stuffs

FROM node:16
WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json* package-lock.json

# I have such a love hate relationship with Docker
# Thanks to @Grasume#1295 on Discord btw for showing me this syntax
RUN npm install -g typescript
RUN npm install -g jest
RUN npm install -g redoc-cli
RUN npm install -g
RUN npm install

# Main
COPY . /usr/src/app/

RUN tsc

RUN node ./oa-build.js
RUN redoc-cli serve ./oa-spec.json -p=8001

RUN npm test -- --no-color 2>jest.report.txt

EXPOSE 8000

CMD node ./dist/index.js