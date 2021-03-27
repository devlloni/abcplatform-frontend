FROM node:12-slim

#create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]

##stage 2

# FROM nginx:1.17.1-alpine
# COPY --from=build-step /app/build /usr/shar/nginx/html