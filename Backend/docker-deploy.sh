#!/bin/bash

# Docker deployment script
set -e

echo "🐳 Starting Docker deployment..."

# Build and start services
echo "🏗️ Building and starting services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=50

echo "✅ Docker deployment completed!"
echo "🌐 Application should be available at http://localhost"
echo "📊 Monitor with: docker-compose logs -f"