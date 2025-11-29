FROM node:18-bullseye AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code and config files
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Build the application
RUN npx nest build

# List what was created
RUN echo "Build completed. Contents:" && ls -la && ls -la dist/

# Production stage
FROM node:18-bullseye
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy any other runtime files needed
# COPY --from=builder /app/.env ./ 

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]