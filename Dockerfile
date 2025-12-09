# Backend Dockerfile (NestJS)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy uploads directory if it exists
COPY --from=builder /app/uploads ./uploads

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads/products uploads/accessories

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]

