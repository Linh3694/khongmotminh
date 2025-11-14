#!/bin/bash

# Script để enable SSL sau khi certbot thành công
# Chạy script này SAU khi certbot đã lấy được SSL certificate

set -e

echo "🔓 Đang enable HTTPS cho khongmotminh.vn..."

# Backup config hiện tại
cp nginx.conf nginx.conf.before_ssl

# Uncomment HTTPS server block
sed -i 's/# server {/server {/' nginx.conf
sed -i 's/#     listen 443/listen 443/' nginx.conf
sed -i 's/#     listen \[::\]:443/listen [::]:443/' nginx.conf
sed -i 's/#     server_name khongmotminh.vn/server_name khongmotminh.vn/' nginx.conf
sed -i 's/#     ssl_certificate/ssl_certificate/' nginx.conf
sed -i 's/#     ssl_certificate_key/ssl_certificate_key/' nginx.conf
sed -i 's/#     ssl_protocols/ssl_protocols/' nginx.conf
sed -i 's/#     ssl_ciphers/ssl_ciphers/' nginx.conf
sed -i 's/#     ssl_prefer_server_ciphers/ssl_prefer_server_ciphers/' nginx.conf
sed -i 's/#     access_log khongmotminh-frontend-ssl/access_log \/var\/log\/nginx\/khongmotminh-frontend-ssl/' nginx.conf
sed -i 's/#     error_log khongmotminh-frontend-ssl/error_log \/var\/log\/nginx\/khongmotminh-frontend-ssl/' nginx.conf
sed -i 's/#     client_max_body_size/client_max_body_size/' nginx.conf
sed -i 's/#     gzip on;/    gzip on;/' nginx.conf
sed -i 's/#     gzip_vary on;/    gzip_vary on;/' nginx.conf
sed -i 's/#     gzip_min_length 1024;/    gzip_min_length 1024;/' nginx.conf
sed -i 's/#     gzip_types/    gzip_types/' nginx.conf

# Uncomment các location blocks trong HTTPS
sed -i 's/#     location \/api {/    location \/api {/' nginx.conf
sed -i 's/#         proxy_pass/        proxy_pass/' nginx.conf
sed -i 's/#         proxy_http_version/        proxy_http_version/' nginx.conf
sed -i 's/#         proxy_set_header/        proxy_set_header/' nginx.conf
sed -i 's/#         proxy_connect_timeout/        proxy_connect_timeout/' nginx.conf
sed -i 's/#         proxy_send_timeout/        proxy_send_timeout/' nginx.conf
sed -i 's/#         proxy_read_timeout/        proxy_read_timeout/' nginx.conf
sed -i 's/#     }/    }/' nginx.conf

sed -i 's/#     location \/ {/    location \/ {/' nginx.conf
# Uncomment các proxy headers và timeouts cho frontend location

# Uncomment health check location
sed -i 's/#     location \/health {/    location \/health {/' nginx.conf
sed -i 's/#         access_log off;/        access_log off;/' nginx.conf
sed -i 's/#         return 200/        return 200/' nginx.conf
sed -i 's/#         add_header/        add_header/' nginx.conf

echo "✅ Đã enable HTTPS trong nginx.conf"

# Copy vào nginx
sudo cp nginx.conf /etc/nginx/sites-available/khongmotminh

# Test config
echo "🔍 Đang kiểm tra cấu hình..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Cấu hình hợp lệ! Đang reload Nginx..."
    sudo systemctl reload nginx
    echo "🎉 HOÀN TẤT! Website giờ chạy HTTPS!"
    echo "🌐 Frontend: https://khongmotminh.vn"
    echo "📡 Backend API: https://khongmotminh.vn/api"
else
    echo "❌ Cấu hình có lỗi. Đang khôi phục..."
    sudo cp nginx.conf.before_ssl nginx.conf
    sudo cp nginx.conf.before_ssl /etc/nginx/sites-available/khongmotminh
    exit 1
fi
