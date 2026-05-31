FROM oven/bun:1.2.21-alpine
WORKDIR /app
COPY packages/shared ./packages/shared
COPY backend/package.json backend/bun.lock ./backend/
WORKDIR /app/backend
RUN bun install --frozen-lockfile
COPY backend/src ./src
COPY backend/tsconfig.json ./
EXPOSE 3000
CMD ["bun", "run", "start"]
