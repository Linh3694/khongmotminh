#!/bin/bash

# Script kiểm tra trạng thái của hệ thống

echo "🔍 Kiểm tra trạng thái hệ thống..."
echo ""

# 1. Kiểm tra PM2
echo "1️⃣  Kiểm tra PM2:"
pm2 status
echo ""

# 2. Kiểm tra ports đang listen
echo "2️⃣  Kiểm tra ports đang listen:"
echo "Port 2222 (Frontend):"
sudo netstat -tlnp | grep :2222 || sudo ss -tlnp | grep :2222 || echo "❌ Port 2222 không có process nào đang listen"
echo ""
echo "Port 3333 (Backend):"
sudo netstat -tlnp | grep :3333 || sudo ss -tlnp | grep :3333 || echo "❌ Port 3333 không có process nào đang listen"
echo ""

# 3. Kiểm tra Nginx
echo "3️⃣  Kiểm tra Nginx:"
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx đang chạy"
    echo "Nginx status:"
    sudo systemctl status nginx --no-pager -l | head -10
else
    echo "❌ Nginx không chạy"
fi
echo ""

# 4. Kiểm tra Nginx config
echo "4️⃣  Kiểm tra Nginx config:"
if [ -f /etc/nginx/sites-enabled/khongmotminh ]; then
    echo "✅ File config tồn tại"
    echo "Kiểm tra syntax:"
    sudo nginx -t
else
    echo "❌ File config không tồn tại"
    echo "Chạy: sudo ./nginx-setup.sh"
fi
echo ""

# 5. Kiểm tra firewall
echo "5️⃣  Kiểm tra firewall:"
if command -v ufw &> /dev/null; then
    echo "UFW status:"
    sudo ufw status | grep 2222 || echo "⚠️  Port 2222 chưa được mở trong UFW"
elif command -v firewall-cmd &> /dev/null; then
    echo "Firewalld status:"
    sudo firewall-cmd --list-ports | grep 2222 || echo "⚠️  Port 2222 chưa được mở trong firewalld"
else
    echo "⚠️  Không tìm thấy firewall manager"
fi
echo ""

# 6. Kiểm tra logs PM2
echo "6️⃣  Logs PM2 (10 dòng cuối):"
pm2 logs --lines 10 --nostream
echo ""

# 7. Kiểm tra logs Nginx
echo "7️⃣  Logs Nginx error (10 dòng cuối):"
if [ -f /var/log/nginx/khongmotminh-frontend-error.log ]; then
    sudo tail -10 /var/log/nginx/khongmotminh-frontend-error.log
else
    echo "⚠️  Chưa có log file"
fi
echo ""

echo "✅ Hoàn tất kiểm tra!"
echo ""
echo "📝 Các bước tiếp theo nếu có lỗi:"
echo "1. Nếu PM2 không chạy: pm2 start ecosystem.config.js"
echo "2. Nếu Nginx không chạy: sudo systemctl start nginx"
echo "3. Nếu chưa setup Nginx: sudo ./nginx-setup.sh"
echo "4. Nếu port chưa mở: sudo ufw allow 2222/tcp"

