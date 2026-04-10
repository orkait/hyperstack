FROM oven/bun:alpine
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY src/ src/
USER bun
ENTRYPOINT ["bun", "src/index.ts"]
