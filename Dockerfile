FROM nginx:1.19.0
COPY client/build/ /usr/share/nginx/html
