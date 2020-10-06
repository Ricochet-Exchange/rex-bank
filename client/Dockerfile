FROM node:alpine as builder
WORKDIR /app
COPY . .
RUN chmod +x env.sh
RUN ./env.sh
yarn build

FROM nginx:1.19.0
COPY build/ /usr/share/nginx/html
