FROM node:alpine as builder
WORKDIR /app
COPY . .
COPY ./env.sh .
RUN chmod +x env.sh
CMD chmod 755 env.sh && ./env.sh
RUN npm install
RUN yarn build

FROM nginx:1.19.0
COPY build/ /usr/share/nginx/html
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
