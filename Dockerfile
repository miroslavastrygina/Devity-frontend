# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npmjs.org/ && \
    npm ci --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=20000

COPY . .
ARG VITE_APP_BACKEND
ARG VITE_WS_HOST
ARG VITE_WS_PORT
ARG VITE_WS_TLS
ARG VITE_WS_APP_KEY
ENV VITE_APP_BACKEND=${VITE_APP_BACKEND}
ENV VITE_WS_HOST=${VITE_WS_HOST}
ENV VITE_WS_PORT=${VITE_WS_PORT}
ENV VITE_WS_TLS=${VITE_WS_TLS}
ENV VITE_WS_APP_KEY=${VITE_WS_APP_KEY}

RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
