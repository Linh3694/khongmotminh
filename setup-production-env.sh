#!/bin/bash

# Script để setup environment variables cho production

echo "🔧 Đang setup environment variables cho production..."

cd Frontend || exit 1

# Tạo file .env.production với relative path (qua Nginx)
echo "📝 Tạo file .env.production..."
cat > .env.production << EOF
# Production API Base URL
# Để trống để sử dụng relative path /api (qua Nginx proxy)
# Nginx sẽ proxy /api đến backend localhost:3333
VITE_API_BASE_URL=
EOF

echo "✅ Đã tạo file .env.production"
echo ""
echo "📋 Nội dung file:"
cat .env.production
echo ""
echo "📝 Các bước tiếp theo:"
echo "1. Rebuild frontend: npm run build"
echo "2. Restart PM2: pm2 restart khong1minh-frontend"
echo ""
echo "🌐 Frontend sẽ sử dụng relative path /api để gọi API qua Nginx proxy"

