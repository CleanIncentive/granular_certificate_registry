FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./package.json 
COPY ./package-lock.json ./package-lock.json 
COPY ./webpack.config.js ./webpack.config.js
COPY ./frontend ./frontend                      

RUN npm install

RUN npm run build

EXPOSE 8080

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "8080"]
