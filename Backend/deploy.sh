#!/bin/bash

# Production deployment script
set -e

echo "🚀 Starting production deployment..."

# Build the application
echo "📦 Building application..."
npm run build

# Prune dev dependencies
echo "🧹 Pruning dev dependencies..."
npm prune --production

# Create logs directory
mkdir -p logs

# Stop existing PM2 processes
echo "🛑 Stopping existing processes..."
pm2 stop ecosystem.config.js || true

# Start with PM2
echo "▶️ Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

echo "✅ Deployment completed successfully!"
echo "📊 Check status with: pm2 status"
echo "📋 View logs with: pm2 logs"