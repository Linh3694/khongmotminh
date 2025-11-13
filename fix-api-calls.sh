#!/bin/bash

# Script để fix API calls trong production

echo "🔧 Đang fix API calls cho production..."
echo ""

# 1. Tạo file .env.production với relative path
echo "1️⃣  Tạo file .env.production..."
cd Frontend || exit 1

cat > .env.production << 'EOF'
# Production API Base URL
# Để trống để sử dụng relative path /api (qua Nginx proxy)
VITE_API_BASE_URL=
EOF

echo "✅ Đã tạo .env.production với VITE_API_BASE_URL="
echo ""

# 2. Rebuild frontend
echo "2️⃣  Đang rebuild frontend với production env..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build thành công!"
else
    echo "❌ Build thất bại!"
    exit 1
fi

echo ""

# 3. Restart PM2
echo "3️⃣  Đang restart PM2..."
cd ..
pm2 restart khong1minh-backend
pm2 restart khong1minh-frontend

echo ""
echo "✅ Hoàn tất!"
echo ""
echo "📝 Kiểm tra:"
echo "1. Frontend sẽ gọi /api (relative path)"
echo "2. Nginx sẽ proxy /api đến localhost:3333"
echo "3. Backend đang listen trên 0.0.0.0:3333"
echo ""
echo "🌐 Test: http://42.96.40.246:2222"
echo "📊 Xem logs: pm2 logs"

