#!/bin/bash

# Script để setup Nginx cho khongmotminh project
# Chạy script này sau khi đã cài đặt Nginx

echo "🚀 Đang thiết lập Nginx cho khongmotminh..."

# Kiểm tra quyền root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Vui lòng chạy script với quyền sudo"
    exit 1
fi

# Đường dẫn file config
CONFIG_FILE="/etc/nginx/sites-available/khongmotminh"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONF="$PROJECT_DIR/nginx.conf"

# Kiểm tra file config có tồn tại không
if [ ! -f "$NGINX_CONF" ]; then
    echo "❌ Không tìm thấy file nginx.conf trong thư mục project"
    exit 1
fi

# Copy config vào sites-available
echo "📋 Đang copy file config..."
cp "$NGINX_CONF" "$CONFIG_FILE"

# Tạo symbolic link đến sites-enabled
echo "🔗 Đang tạo symbolic link..."
if [ -L "/etc/nginx/sites-enabled/khongmotminh" ]; then
    rm /etc/nginx/sites-enabled/khongmotminh
fi
ln -s "$CONFIG_FILE" /etc/nginx/sites-enabled/khongmotminh

# Tạo thư mục log nếu chưa có
echo "📁 Đang tạo thư mục log..."
mkdir -p /var/log/nginx

# Kiểm tra cấu hình Nginx
echo "🔍 Đang kiểm tra cấu hình Nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Cấu hình Nginx hợp lệ!"
    echo ""
    echo "📝 Các bước tiếp theo:"
    echo "1. Kiểm tra lại file config tại: $CONFIG_FILE"
    echo "2. Chỉnh sửa IP hoặc domain nếu cần"
    echo "3. Chạy lệnh: sudo systemctl reload nginx"
    echo "4. Hoặc restart: sudo systemctl restart nginx"
    echo ""
    read -p "Bạn có muốn reload Nginx ngay bây giờ? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        systemctl reload nginx
        echo "✅ Đã reload Nginx thành công!"
    fi
else
    echo "❌ Có lỗi trong cấu hình Nginx. Vui lòng kiểm tra lại."
    exit 1
fi

echo ""
echo "✅ Hoàn tất setup Nginx!"
echo "🌐 Frontend sẽ accessible tại: http://42.96.40.246:2222"
echo "📡 Backend API sẽ accessible tại: http://42.96.40.246:2222/api"

