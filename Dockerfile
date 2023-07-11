FROM node:alpine AS app-build
WORKDIR /app
COPY . .
RUN npm config set registry https://appsdev.stlgarv.com:2000/repository/npm-proxy && \
    npm config set _auth Z2FydmRldm9wczpTaW1wbGVAMjAyMg== && \
    npm install && \
    npm install -g nx
# RUN npm install -g nx
RUN nx run stl-garv:build:production --base-href=/stlgarv/ --deploy-url=/stlgarv/

# run server stage
FROM nginx:alpine
COPY --from=app-build /app/dist/apps/stl-garv /usr/share/nginx/html/stlgarv
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 4200
