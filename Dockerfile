FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src/ src/
USER node
ENTRYPOINT ["npx", "tsx", "src/index.ts"]
