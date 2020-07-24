FROM node:12-slim as builder

COPY . /app
WORKDIR /app
RUN npm install

EXPOSE 3000
CMD ["index.js"]


