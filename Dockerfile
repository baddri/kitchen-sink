FROM node:latest
WORKDIR /code
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build
EXPOSE ${WEB_PORT}
CMD ["pnpm", "run", "start"]
