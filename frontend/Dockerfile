FROM node:20-bullseye-slim

WORKDIR /app

ENV REACT_APP_API_URL=https://dev.gc-registry.com/api
ENV NODE_ENV=development

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install --legacy-peer-deps
RUN npm install redux-thunk@3.1.0 --legacy-peer-deps
RUN npm install react-refresh --legacy-peer-deps

# Don't copy source files in development - they'll be mounted as volumes
# COPY ./webpack.config.js ./webpack.config.js
# COPY ./src ./src

# Don't build in development - we'll run the dev server
# RUN npm run build

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
