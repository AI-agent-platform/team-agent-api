# Builder stage

FROM node:18-bullseye AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npx nest build
RUN echo "Build completed. Contents of dist:" && ls -la dist/

# Production stage

FROM node:18-bullseye
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

# Copy email templates so they are accessible at runtime
COPY --from=builder /app/src/api/email/templates ./dist/api/email/templates

COPY .env .env
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]
