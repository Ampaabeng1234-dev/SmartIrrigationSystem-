# Smart Irrigation Management System - Production Dockerfile

# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for building native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S irrigation -u 1001 -G nodejs

# Create logs directory
RUN mkdir -p /app/logs && \
    chown -R irrigation:nodejs /app

# Switch to non-root user
USER irrigation

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Start the application
CMD ["npm", "start"]

# Multi-stage build alternative (uncomment for smaller production image)
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# FROM node:18-alpine AS production
# WORKDIR /app
# RUN addgroup -g 1001 -S nodejs && \
#     adduser -S irrigation -u 1001 -G nodejs
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/package*.json ./
# RUN npm ci --only=production && npm cache clean --force
# USER irrigation
# EXPOSE 5000
# CMD ["node", "dist/index.js"]