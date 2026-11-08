FROM node:24-alpine
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/
RUN pnpm install --frozen-lockfile --filter backend

COPY backend backend
WORKDIR /app/backend

CMD ["pnpm", "dev"]
