FROM node:20-bullseye-slim

WORKDIR /app

ENV REACT_APP_API_URL=https://api-dot-rich-store-445612-c6.ew.r.appspot.com

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./webpack.config.js ./webpack.config.js
COPY ./src ./src

RUN npm install --legacy-peer-deps
RUN npm install redux-thunk@3.1.0 --legacy-peer-deps
RUN npm install react-refresh --legacy-peer-deps

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
