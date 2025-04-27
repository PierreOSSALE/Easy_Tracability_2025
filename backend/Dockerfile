# backend/Dockerfile
FROM node:18-alpine

RUN apk add --no-cache bash

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

COPY . .

EXPOSE 3001
CMD ["./entrypoint.sh"]
