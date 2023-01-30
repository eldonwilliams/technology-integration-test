FROM node:16

COPY . .

RUN ["npm", "install"]

RUN ["tsc"]

EXPOSE 8000

CMD ["node", "./dist/index.js"]