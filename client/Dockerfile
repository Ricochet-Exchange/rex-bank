FROM node:alpine as builder
WORKDIR /app
COPY . .
COPY ./env.sh .
RUN chmod +x env.sh
RUN ls
RUN yarn build

FROM nginx:1.19.0
COPY build/ /usr/share/nginx/html
