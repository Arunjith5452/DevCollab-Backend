# Base stage for building TypeScript
FROM node:22.19.0-alpine AS base

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy source code and tsconfig
COPY src ./src
COPY tsconfig.json ./

# Build TypeScript to /app/dist
RUN npm run build

# -----------------
# Production stage
FROM node:22.19.0-alpine

WORKDIR /app

# Copy node_modules and build output from base stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the app
CMD ["node", "dist/index.js"]
