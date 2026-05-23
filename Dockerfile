# syntax=docker/dockerfile:1
# BuildKit: кэш npm + повторы npm ci помогают при ECONNRESET к registry.npmjs.org

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    sh -c '\
    npm config set registry https://registry.npmjs.org/ && \
    npm config set cache /root/.npm && \
    npm config set fetch-retries 20 && \
    npm config set fetch-retry-mintimeout 60000 && \
    npm config set fetch-retry-maxtimeout 600000 && \
    for i in 1 2 3 4 5; do \
      echo "npm ci: attempt $i of 5..." && \
      npm ci && echo "npm ci: success" && exit 0; \
      echo "npm ci: failed, sleeping 30s before retry..."; \
      sleep 30; \
    done; \
    echo "npm ci: all attempts failed"; \
    exit 1'

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
