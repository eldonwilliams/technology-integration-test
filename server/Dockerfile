FROM node:16

COPY . .

# I have such a love hate relationship with Docker
# Thanks to @Grasume#1295 on Discord btw for showing me this syntax
RUN npm install -g
RUN npm install

RUN tsc

EXPOSE 8000

CMD node ./dist/index.js