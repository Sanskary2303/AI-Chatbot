# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S chatbot -u 1001

# Change ownership of the app directory
RUN chown -R chatbot:nodejs /app

# Switch to non-root user
USER chatbot

# Start the application
CMD ["npm", "start"]
