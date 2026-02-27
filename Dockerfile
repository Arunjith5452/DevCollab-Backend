# Stage 1: Build stage
FROM node:22.19.0-alpine AS base

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of your source code
COPY . .

# Build the project (creates the dist/ folder)
RUN npm run build

# Stage 2: Production stage
FROM node:22.19.0-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled code from the base stage
COPY --from=base /app/dist ./dist

# Expose the port your app runs on
EXPOSE 3001

# Start the application from the correct nested path
CMD ["node", "dist/presentation/express/settings/index.js"]