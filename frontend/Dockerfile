FROM node:24-alpine
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/
RUN pnpm install --frozen-lockfile --filter frontend

COPY frontend frontend
WORKDIR /app/frontend

CMD ["pnpm", "dev", "--host", "0.0.0.0"]
