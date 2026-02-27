# Base stage for building TypeScript
FROM node:22.19.0-alpine AS base

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies) for building
COPY package*.json ./
RUN npm ci

# Copy source code and tsconfig
COPY src ./src
COPY tsconfig*.json ./

# Build TypeScript to /app/dist
RUN npm run build

# -----------------
# Production stage
FROM node:22.19.0-alpine

WORKDIR /app

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the built output from the base stage
COPY --from=base /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the app
CMD ["node", "dist/presentation/express/settings/index.js"]
