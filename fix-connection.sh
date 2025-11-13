#!/bin/bash

# Script để fix lỗi kết nối

echo "🔧 Đang kiểm tra và sửa lỗi kết nối..."
echo ""

# 1. Kiểm tra PM2
echo "1️⃣  Kiểm tra PM2..."
if ! pm2 list | grep -q "khong1minh"; then
    echo "⚠️  PM2 apps chưa chạy, đang khởi động..."
    pm2 start ecosystem.config.js
else
    echo "✅ PM2 apps đang chạy"
fi
echo ""

# 2. Kiểm tra Nginx
echo "2️⃣  Kiểm tra Nginx..."
if ! systemctl is-active --quiet nginx; then
    echo "⚠️  Nginx chưa chạy, đang khởi động..."
    sudo systemctl start nginx
fi

# Kiểm tra config
if [ ! -f /etc/nginx/sites-enabled/khongmotminh ]; then
    echo "⚠️  Nginx chưa được cấu hình, đang setup..."
    sudo ./nginx-setup.sh
else
    echo "✅ Nginx đã được cấu hình"
    # Reload để đảm bảo
    sudo nginx -t && sudo systemctl reload nginx
fi
echo ""

# 3. Kiểm tra firewall
echo "3️⃣  Kiểm tra firewall..."
if command -v ufw &> /dev/null; then
    if ! sudo ufw status | grep -q "2222"; then
        echo "⚠️  Đang mở port 2222 trong UFW..."
        sudo ufw allow 2222/tcp
        sudo ufw reload
    else
        echo "✅ Port 2222 đã được mở"
    fi
elif command -v firewall-cmd &> /dev/null; then
    if ! sudo firewall-cmd --list-ports | grep -q "2222"; then
        echo "⚠️  Đang mở port 2222 trong firewalld..."
        sudo firewall-cmd --permanent --add-port=2222/tcp
        sudo firewall-cmd --reload
    else
        echo "✅ Port 2222 đã được mở"
    fi
fi
echo ""

# 4. Kiểm tra ports
echo "4️⃣  Kiểm tra ports đang listen..."
echo "Port 2222:"
if sudo netstat -tlnp 2>/dev/null | grep -q ":2222" || sudo ss -tlnp 2>/dev/null | grep -q ":2222"; then
    echo "✅ Port 2222 đang được sử dụng"
    sudo netstat -tlnp | grep :2222 || sudo ss -tlnp | grep :2222
else
    echo "❌ Port 2222 không có process nào đang listen"
    echo "Kiểm tra PM2 frontend có đang chạy không:"
    pm2 logs khong1minh-frontend --lines 20
fi
echo ""

echo "✅ Hoàn tất!"
echo ""
echo "🌐 Thử truy cập: http://42.96.40.246:2222"
echo "📊 Xem logs: pm2 logs"
echo "📋 Kiểm tra chi tiết: ./check-status.sh"

