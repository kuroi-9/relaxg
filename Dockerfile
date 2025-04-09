FROM node:23 AS base
WORKDIR /project
RUN npm install -g pnpm
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

# Development environment
FROM base AS dev
WORKDIR /project
COPY . ./
COPY --from=base /project/node_modules ./

# Production environment
FROM base AS build
WORKDIR /project
COPY . ./
COPY --from=base /project/node_modules ./
RUN pnpm build
