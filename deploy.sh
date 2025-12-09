#!/bin/bash

# Script deploy tự động cho Backend và Database
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Backend Deployment..."

# ============================================
# Bước 1: Kiểm tra và cài đặt Docker
# ============================================
echo ""
echo "📦 Step 1: Checking Docker installation..."

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Installing Docker..."
    
    # Detect OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    else
        echo "❌ Cannot detect OS. Please install Docker manually."
        exit 1
    fi
    
    # Install Docker based on OS
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        echo "📥 Installing Docker for Ubuntu/Debian..."
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl gnupg lsb-release
        
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        
        # Add user to docker group
        sudo usermod -aG docker $USER
        echo "✅ Docker installed. Please logout and login again, then run this script again."
        exit 0
    else
        echo "❌ Auto-install not supported for $OS. Please install Docker manually:"
        echo "   https://docs.docker.com/get-docker/"
        exit 1
    fi
else
    echo "✅ Docker is installed: $(docker --version)"
fi

# ============================================
# Bước 2: Kiểm tra Docker Compose
# ============================================
echo ""
echo "📦 Step 2: Checking Docker Compose..."

if ! command -v docker compose &> /dev/null; then
    echo "⚠️  Docker Compose is not installed. Installing..."
    
    if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
    else
        echo "❌ Please install Docker Compose manually"
        exit 1
    fi
else
    echo "✅ Docker Compose is installed: $(docker compose version)"
fi

# ============================================
# Bước 3: Kiểm tra file .env
# ============================================
echo ""
echo "⚙️  Step 3: Checking environment configuration..."

# Tạo docker-compose.yml nếu chưa có
if [ ! -f ../docker-compose.yml ]; then
    echo "📝 Creating docker-compose.yml..."
    cat > ../docker-compose.yml << 'EOF'
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: bike-key-db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-rootpassword}
      MYSQL_DATABASE: ${DB_NAME:-sms_demo}
      MYSQL_USER: ${DB_USER:-bikeuser}
      MYSQL_PASSWORD: ${DB_PASS:-bikepassword}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./bicycle-web/data/database.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - bike-key-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${DB_ROOT_PASSWORD:-rootpassword}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API (NestJS)
  backend:
    build:
      context: ./bicycle-web
      dockerfile: Dockerfile
    container_name: bike-key-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USER=${DB_USER:-bikeuser}
      - DB_PASS=${DB_PASS:-bikepassword}
      - DB_NAME=${DB_NAME:-sms_demo}
      - JWT_SECRET=${JWT_SECRET:-516b508ace08b91b46ed9b88b9ef0361}
      - APP_URL=${APP_URL:-http://localhost:3000}
      - GEMINI_API_KEY=${GEMINI_API_KEY:-}
      - GEMINI_EMBED_MODEL=${GEMINI_EMBED_MODEL:-gemini-embedding-001}
    ports:
      - "3000:3000"
    volumes:
      - ./bicycle-web/uploads:/app/uploads
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - bike-key-network

volumes:
  mysql_data:

networks:
  bike-key-network:
    driver: bridge
EOF
    echo "✅ docker-compose.yml created"
fi

# Kiểm tra file .env ở thư mục gốc
if [ ! -f ../.env ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    if [ -f env.example ]; then
        cp env.example ../.env
        echo "📝 .env file created. Please edit it with your configuration:"
        echo "   nano ../.env"
        echo ""
        echo "Required variables:"
        echo "   - DB_ROOT_PASSWORD"
        echo "   - DB_USER"
        echo "   - DB_PASS"
        echo "   - DB_NAME"
        echo "   - JWT_SECRET"
        echo "   - APP_URL"
        echo ""
        read -p "Press Enter after editing .env file to continue..."
    else
        echo "❌ env.example not found. Creating basic .env..."
        cat > ../.env << 'ENVEOF'
# Database Configuration
DB_ROOT_PASSWORD=rootpassword
DB_USER=bikeuser
DB_PASS=bikepassword
DB_NAME=sms_demo

# Backend Configuration
JWT_SECRET=516b508ace08b91b46ed9b88b9ef0361
APP_URL=http://localhost:3000
PORT=3000

# Gemini API (Optional)
GEMINI_API_KEY=
GEMINI_EMBED_MODEL=gemini-embedding-001
ENVEOF
        echo "✅ Basic .env created. Please edit: nano ../.env"
        read -p "Press Enter after editing .env file to continue..."
    fi
else
    echo "✅ .env file found"
fi

# ============================================
# Bước 4: Kiểm tra database.sql
# ============================================
echo ""
echo "🗄️  Step 4: Checking database file..."

if [ ! -f data/database.sql ]; then
    echo "⚠️  Warning: data/database.sql not found."
    echo "   Database will be created but may be empty."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ database.sql found"
fi

# ============================================
# Bước 5: Build và Deploy
# ============================================
echo ""
echo "🔨 Step 5: Building and deploying..."

# Di chuyển về thư mục gốc để chạy docker-compose
cd ..

# Stop containers nếu đang chạy
echo "🛑 Stopping existing containers (if any)..."
docker compose down 2>/dev/null || true

# Build và start
echo "🚀 Starting MySQL and Backend..."
docker compose up -d --build mysql backend

# Đợi services khởi động
echo ""
echo "⏳ Waiting for services to start..."
sleep 15

# ============================================
# Bước 6: Kiểm tra Status
# ============================================
echo ""
echo "📊 Step 6: Checking service status..."

# Kiểm tra database health
DB_HEALTH=$(docker compose ps mysql 2>/dev/null | grep -c "healthy" || echo "0")
if [ "$DB_HEALTH" -eq 0 ]; then
    echo "⚠️  Database may still be starting..."
    echo "   Check logs: docker compose logs mysql"
else
    echo "✅ Database is healthy"
fi

# Kiểm tra backend
BACKEND_STATUS=$(docker compose ps backend 2>/dev/null | grep -c "Up" || echo "0")
if [ "$BACKEND_STATUS" -eq 0 ]; then
    echo "⚠️  Backend may still be starting..."
else
    echo "✅ Backend container is running"
fi

# Hiển thị status
echo ""
echo "📋 Service Status:"
docker compose ps mysql backend

# ============================================
# Bước 7: Test Backend
# ============================================
echo ""
echo "🧪 Step 7: Testing backend..."

sleep 5
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Backend is responding at http://localhost:3000"
else
    echo "⚠️  Backend may still be starting..."
    echo "   Check logs: docker compose logs -f backend"
fi

# ============================================
# Kết quả
# ============================================
echo ""
echo "✅ Deployment completed!"
echo ""
echo "🌐 Services:"
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}' || echo "localhost")
echo "   - Backend API: http://${SERVER_IP}:3000"
echo "   - API Docs: http://${SERVER_IP}:3000/api"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: docker compose logs -f [mysql|backend]"
echo "   - Stop: docker compose down"
echo "   - Restart: docker compose restart [mysql|backend]"
echo "   - Check database: docker compose exec mysql mysql -u bikeuser -p sms_demo"
echo "   - Rebuild: docker compose up -d --build backend"
echo ""

