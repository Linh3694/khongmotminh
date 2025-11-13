#!/bin/bash

# Script để fix Nginx API proxy

echo "🔧 Đang fix Nginx API proxy..."
echo ""

# Kiểm tra quyền root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Script này cần quyền sudo"
    echo "Vui lòng chạy: sudo ./fix-nginx-api.sh"
    exit 1
fi

# 1. Kiểm tra backend có chạy không
echo "1️⃣  Kiểm tra backend..."
if curl -s http://localhost:3333/api/health > /dev/null; then
    echo "✅ Backend đang chạy trên localhost:3333"
    curl http://localhost:3333/api/health
else
    echo "❌ Backend KHÔNG chạy hoặc không accessible"
    echo "Kiểm tra PM2: pm2 status"
    exit 1
fi
echo ""
echo ""

# 2. Kiểm tra Nginx config
echo "2️⃣  Kiểm tra Nginx config..."
if [ -f /etc/nginx/sites-enabled/khongmotminh ]; then
    echo "✅ Config file tồn tại"
    
    # Kiểm tra proxy_pass
    if grep -q "proxy_pass http://backend/api" /etc/nginx/sites-enabled/khongmotminh; then
        echo "⚠️  Tìm thấy proxy_pass không đúng, đang sửa..."
        # Backup
        cp /etc/nginx/sites-enabled/khongmotminh /etc/nginx/sites-enabled/khongmotminh.backup
        
        # Sửa proxy_pass - phải là http://backend (không có /api)
        sed -i 's|proxy_pass http://backend/api;|proxy_pass http://backend;|g' /etc/nginx/sites-enabled/khongmotminh
        echo "✅ Đã sửa proxy_pass về http://backend"
    elif grep -q "proxy_pass http://backend;" /etc/nginx/sites-enabled/khongmotminh; then
        echo "✅ proxy_pass đã đúng (http://backend)"
    else
        echo "⚠️  Không tìm thấy proxy_pass, kiểm tra lại config"
    fi
else
    echo "❌ Config file không tồn tại"
    echo "Chạy: sudo ./nginx-setup.sh"
    exit 1
fi
echo ""

# 3. Test Nginx config
echo "3️⃣  Test Nginx config..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Config hợp lệ"
    
    # Reload Nginx
    echo "4️⃣  Reload Nginx..."
    systemctl reload nginx
    
    if [ $? -eq 0 ]; then
        echo "✅ Đã reload Nginx"
    else
        echo "❌ Lỗi khi reload Nginx"
        exit 1
    fi
else
    echo "❌ Config không hợp lệ"
    exit 1
fi
echo ""

# 5. Test API qua Nginx
echo "5️⃣  Test API qua Nginx..."
sleep 2
echo "Test: curl http://localhost:2222/api/health"
RESPONSE=$(curl -s http://localhost:2222/api/health)
echo "$RESPONSE"
echo ""

# Kiểm tra response có phải JSON không
if echo "$RESPONSE" | grep -q "status"; then
    echo "✅ API trả về JSON đúng!"
else
    echo "❌ API không trả về JSON, có thể đang trả về HTML"
    echo "Kiểm tra backend có chạy không: pm2 status"
fi
echo ""

echo "✅ Hoàn tất!"
echo ""
echo "🌐 Test từ browser: http://42.96.40.246:2222/api/health"
echo "📊 Xem logs: sudo tail -f /var/log/nginx/khongmotminh-frontend-error.log"

