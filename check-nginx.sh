#!/bin/bash

# Script kiểm tra Nginx và firewall

echo "🔍 Kiểm tra Nginx và Firewall..."
echo ""

# 1. Kiểm tra Nginx có đang chạy không
echo "1️⃣  Kiểm tra Nginx status:"
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx đang chạy"
    sudo systemctl status nginx --no-pager -l | head -5
else
    echo "❌ Nginx KHÔNG chạy"
    echo "Chạy: sudo systemctl start nginx"
fi
echo ""

# 2. Kiểm tra Nginx có listen trên port 2222 không
echo "2️⃣  Kiểm tra Nginx có listen port 2222:"
if sudo netstat -tlnp 2>/dev/null | grep -q ":2222.*nginx" || sudo ss -tlnp 2>/dev/null | grep -q ":2222.*nginx"; then
    echo "✅ Nginx đang listen trên port 2222"
    sudo netstat -tlnp | grep :2222 | grep nginx || sudo ss -tlnp | grep :2222 | grep nginx
else
    echo "❌ Nginx KHÔNG listen trên port 2222"
    echo "Kiểm tra config:"
    if [ -f /etc/nginx/sites-enabled/khongmotminh ]; then
        echo "✅ Config file tồn tại"
        echo "Kiểm tra syntax:"
        sudo nginx -t
    else
        echo "❌ Config file không tồn tại"
        echo "Chạy: sudo ./nginx-setup.sh"
    fi
fi
echo ""

# 3. Kiểm tra config Nginx
echo "3️⃣  Kiểm tra Nginx config:"
if [ -f /etc/nginx/sites-enabled/khongmotminh ]; then
    echo "✅ Config file: /etc/nginx/sites-enabled/khongmotminh"
    echo "Kiểm tra có listen 2222 không:"
    if grep -q "listen 2222" /etc/nginx/sites-enabled/khongmotminh; then
        echo "✅ Config có listen 2222"
    else
        echo "❌ Config KHÔNG có listen 2222"
    fi
    echo ""
    echo "Kiểm tra syntax:"
    sudo nginx -t
else
    echo "❌ Config file không tồn tại"
    echo "Chạy: sudo ./nginx-setup.sh"
fi
echo ""

# 4. Kiểm tra firewall
echo "4️⃣  Kiểm tra Firewall:"
if command -v ufw &> /dev/null; then
    echo "UFW status:"
    sudo ufw status | head -10
    if sudo ufw status | grep -q "2222"; then
        echo "✅ Port 2222 đã được mở"
    else
        echo "❌ Port 2222 CHƯA được mở"
        echo "Chạy: sudo ufw allow 2222/tcp && sudo ufw reload"
    fi
elif command -v firewall-cmd &> /dev/null; then
    echo "Firewalld status:"
    sudo firewall-cmd --list-ports
    if sudo firewall-cmd --list-ports | grep -q "2222"; then
        echo "✅ Port 2222 đã được mở"
    else
        echo "❌ Port 2222 CHƯA được mở"
        echo "Chạy: sudo firewall-cmd --permanent --add-port=2222/tcp && sudo firewall-cmd --reload"
    fi
else
    echo "⚠️  Không tìm thấy firewall manager"
    echo "Kiểm tra iptables:"
    sudo iptables -L -n | grep 2222 || echo "Port 2222 không có rule trong iptables"
fi
echo ""

# 5. Test từ bên ngoài (nếu có curl)
echo "5️⃣  Test từ server:"
echo "Test localhost:2222:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:2222 || echo "❌ Không thể kết nối localhost:2222"
echo ""

# 6. Kiểm tra logs Nginx
echo "6️⃣  Nginx error logs (10 dòng cuối):"
if [ -f /var/log/nginx/error.log ]; then
    sudo tail -10 /var/log/nginx/error.log
fi
if [ -f /var/log/nginx/khongmotminh-frontend-error.log ]; then
    echo "Frontend error log:"
    sudo tail -10 /var/log/nginx/khongmotminh-frontend-error.log
fi
echo ""

echo "✅ Hoàn tất kiểm tra!"
echo ""
echo "📝 Nếu Nginx chưa setup, chạy:"
echo "   sudo ./nginx-setup.sh"
echo ""
echo "📝 Nếu firewall chưa mở port, chạy:"
echo "   sudo ufw allow 2222/tcp && sudo ufw reload"
echo "   hoặc"
echo "   sudo firewall-cmd --permanent --add-port=2222/tcp && sudo firewall-cmd --reload"

