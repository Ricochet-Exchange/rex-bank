FROM node:alpine as builder
WORKDIR /app
COPY . .
COPY ./env.sh .
RUN chmod +x env.sh
CMD chmod 755 env.sh && ./env.sh
RUN apk add --no-cache git
RUN npm install
RUN yarn build

FROM nginx:1.19.0
COPY build/ /usr/share/nginx/html
