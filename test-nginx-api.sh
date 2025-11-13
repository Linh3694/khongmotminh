#!/bin/bash

# Script test API qua Nginx

echo "🔍 Kiểm tra API qua Nginx..."
echo ""

# Test localhost
echo "1️⃣  Test localhost:2222/api/health:"
curl -v http://localhost:2222/api/health 2>&1 | head -20
echo ""

# Test từ server
echo "2️⃣  Test từ server (42.96.40.246:2222/api/health):"
curl -v http://42.96.40.246:2222/api/health 2>&1 | head -20
echo ""

# Kiểm tra backend trực tiếp
echo "3️⃣  Test backend trực tiếp (localhost:3333/api/health):"
curl -v http://localhost:3333/api/health 2>&1 | head -20
echo ""

# Kiểm tra Nginx config
echo "4️⃣  Kiểm tra Nginx config:"
if [ -f /etc/nginx/sites-enabled/khongmotminh ]; then
    echo "✅ Config file tồn tại"
    echo "Kiểm tra location /api:"
    grep -A 10 "location /api" /etc/nginx/sites-enabled/khongmotminh
else
    echo "❌ Config file không tồn tại"
fi
echo ""

# Kiểm tra Nginx logs
echo "5️⃣  Nginx error logs (10 dòng cuối):"
if [ -f /var/log/nginx/error.log ]; then
    sudo tail -10 /var/log/nginx/error.log
fi
echo ""

echo "✅ Hoàn tất kiểm tra!"

