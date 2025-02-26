FROM node:20-bullseye-slim

WORKDIR /app

# ENV REACT_APP_API_URL=https://api-dot-rich-store-445612-c6.ew.r.appspot.com

# Accept build argument for NODE_ENV
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

# Copy only package files first
COPY package*.json ./                   

# Install ALL dependencies (including dev) when in development mode
RUN if [ "$NODE_ENV" = "development" ] ; then \
        npm install --include=dev ; \
    else \
        npm install --omit=dev ; \
    fi

RUN npm install -g webpack webpack-cli webpack-dev-server

COPY ./webpack.config.js ./webpack.config.js
COPY ./src ./src   

# Add volume mounting point
VOLUME ["/app/src"]

EXPOSE 8080
