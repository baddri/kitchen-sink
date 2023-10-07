# Base
FROM node:latest as base
WORKDIR /code
COPY . .
RUN npm install -g pnpm
RUN pnpm install
EXPOSE ${WEB_PORT}

# Development
FROM base as dev
CMD ["pnpm", "run", "start:dev"]

# Production
FROM base as prod
RUN pnpm run build
CMD ["pnpm", "run", "start"]

# E2E Test
FROM base as test
CMD pnpm run test:e2e && kill -9 1
