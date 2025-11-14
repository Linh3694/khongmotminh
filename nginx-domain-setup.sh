#!/bin/bash

# Script để thiết lập domain và SSL cho khongmotminh project
# Sử dụng: sudo ./nginx-domain-setup.sh yourdomain.com

set -e  # Exit on any error

# Colors cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}🚀 Thiết lập Domain & SSL cho khongmotminh${NC}"
    echo -e "${BLUE}================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Kiểm tra quyền root
if [ "$EUID" -ne 0 ]; then
    print_error "Vui lòng chạy script với quyền sudo"
    echo "Ví dụ: sudo ./nginx-domain-setup.sh yourdomain.com"
    exit 1
fi

# Kiểm tra domain parameter
if [ $# -eq 0 ]; then
    print_error "Thiếu domain name!"
    echo "Sử dụng: sudo ./nginx-domain-setup.sh yourdomain.com"
    echo "Ví dụ: sudo ./nginx-domain-setup.sh khongmotminh.vn"
    exit 1
fi

DOMAIN=$1
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONF="$PROJECT_DIR/nginx.conf"
BACKUP_CONF="$PROJECT_DIR/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)"

print_header
print_info "Domain: $DOMAIN"
print_info "Project dir: $PROJECT_DIR"

# Backup file config hiện tại
print_info "Đang backup file config hiện tại..."
cp "$NGINX_CONF" "$BACKUP_CONF"
print_success "Backup đã tạo: $BACKUP_CONF"

# Cập nhật nginx.conf với domain mới
print_info "Đang cập nhật nginx.conf với domain $DOMAIN..."

# Thay thế IP bằng domain trong server_name
sed -i "s/server_name 42\.96\.40\.246;/server_name $DOMAIN www.$DOMAIN;/" "$NGINX_CONF"

# Uncomment HTTPS server block và cập nhật domain
sed -i "s/# server {/server {/" "$NGINX_CONF"
sed -i "s/#     listen 443 ssl http2;/    listen 443 ssl http2;/" "$NGINX_CONF"
sed -i "s/#     listen \[::\]:443 ssl http2;/    listen \[::\]:443 ssl http2;/" "$NGINX_CONF"
sed -i "s/#     server_name 42\.96\.40\.246;/    server_name $DOMAIN www.$DOMAIN;/" "$NGINX_CONF"

# Uncomment SSL certificates (sẽ được cập nhật sau khi certbot tạo cert)
sed -i "s|#     ssl_certificate /path/to/your/certificate.crt;|    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;|" "$NGINX_CONF"
sed -i "s|#     ssl_certificate_key /path/to/your/private.key;|    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;|" "$NGINX_CONF"

# Uncomment các phần SSL config còn lại
sed -i 's/#     ssl_protocols/    ssl_protocols/' "$NGINX_CONF"
sed -i 's/#     ssl_ciphers/    ssl_ciphers/' "$NGINX_CONF"
sed -i 's/#     ssl_prefer_server_ciphers/    ssl_prefer_server_ciphers/' "$NGINX_CONF"

# Uncomment logging cho HTTPS
sed -i 's/#     access_log/    access_log/' "$NGINX_CONF"
sed -i 's/#     error_log/    error_log/' "$NGINX_CONF"

# Uncomment client_max_body_size cho HTTPS
sed -i 's/#     client_max_body_size/    client_max_body_size/' "$NGINX_CONF"

# Uncomment gzip cho HTTPS
sed -i 's/#     gzip on;/    gzip on;/' "$NGINX_CONF"
sed -i 's/#     gzip_vary on;/    gzip_vary on;/' "$NGINX_CONF"
sed -i 's/#     gzip_min_length 1024;/    gzip_min_length 1024;/' "$NGINX_CONF"
sed -i 's/#     gzip_types/    gzip_types/' "$NGINX_CONF"

# Uncomment location blocks cho HTTPS
sed -i 's/#     location \/ {/    location \/ {/' "$NGINX_CONF"
sed -i 's/#         proxy_pass/        proxy_pass/' "$NGINX_CONF"
sed -i 's/#         proxy_http_version/        proxy_http_version/' "$NGINX_CONF"
sed -i 's/#         proxy_set_header/        proxy_set_header/' "$NGINX_CONF"
sed -i 's/#         proxy_connect_timeout/        proxy_connect_timeout/' "$NGINX_CONF"
sed -i 's/#         proxy_send_timeout/        proxy_send_timeout/' "$NGINX_CONF"
sed -i 's/#         proxy_read_timeout/        proxy_read_timeout/' "$NGINX_CONF"
sed -i 's/#         proxy_buffering off;/        proxy_buffering off;/' "$NGINX_CONF"
sed -i 's/#     }/    }/' "$NGINX_CONF"

# Uncomment backend API proxy cho HTTPS
sed -i 's/#     location \/api {/    location \/api {/' "$NGINX_CONF"

# Thêm redirect từ HTTP sang HTTPS
cat >> "$NGINX_CONF" << EOF

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirect all HTTP traffic to HTTPS
    return 301 https://\$server_name\$request_uri;
}
EOF

print_success "Đã cập nhật nginx.conf"

# Copy config vào Nginx
CONFIG_FILE="/etc/nginx/sites-available/khongmotminh"
print_info "Đang copy config vào Nginx..."
cp "$NGINX_CONF" "$CONFIG_FILE"

# Tạo symbolic link nếu chưa có
if [ ! -L "/etc/nginx/sites-enabled/khongmotminh" ]; then
    print_info "Đang tạo symbolic link..."
    ln -s "$CONFIG_FILE" /etc/nginx/sites-enabled/khongmotminh
fi

# Tạo thư mục log
print_info "Đang tạo thư mục log..."
mkdir -p /var/log/nginx

# Cài đặt certbot nếu chưa có
print_info "Đang kiểm tra và cài đặt certbot..."
if ! command -v certbot &> /dev/null; then
    print_warning "Certbot chưa được cài đặt. Đang cài đặt..."

    # Detect OS và cài đặt certbot
    if [ -f /etc/debian_version ]; then
        # Ubuntu/Debian
        apt update
        apt install -y certbot python3-certbot-nginx
    elif [ -f /etc/redhat-release ]; then
        # CentOS/RHEL
        yum install -y certbot python-certbot-nginx
    elif [ -f /etc/fedora-release ]; then
        # Fedora
        dnf install -y certbot python3-certbot-nginx
    else
        print_error "Không thể tự động phát hiện OS. Vui lòng cài đặt certbot thủ công."
        print_info "Trên Ubuntu/Debian: sudo apt install certbot python3-certbot-nginx"
        print_info "Trên CentOS/RHEL: sudo yum install certbot python-certbot-nginx"
        exit 1
    fi
    print_success "Đã cài đặt certbot"
else
    print_success "Certbot đã được cài đặt"
fi

# Kiểm tra cấu hình Nginx
print_info "Đang kiểm tra cấu hình Nginx..."
if nginx -t; then
    print_success "Cấu hình Nginx hợp lệ!"
else
    print_error "Cấu hình Nginx có lỗi. Đang khôi phục backup..."
    cp "$BACKUP_CONF" "$NGINX_CONF"
    cp "$BACKUP_CONF" "$CONFIG_FILE"
    exit 1
fi

# Reload Nginx để áp dụng config mới (chưa có SSL)
print_info "Đang reload Nginx..."
systemctl reload nginx
print_success "Đã reload Nginx"

echo ""
print_warning "⚠️  QUAN TRỌNG: Trước khi lấy SSL certificate ⚠️"
echo ""
print_info "Bạn cần cấu hình DNS records cho domain $DOMAIN:"
echo ""
echo "1. 📝 Thêm A Record:"
echo "   - Name: @ (hoặc tên miền chính)"
echo "   - Type: A"
echo "   - Value: 42.96.40.246"
echo "   - TTL: 3600 (hoặc mặc định)"
echo ""
echo "2. 📝 Thêm CNAME Record cho www (tùy chọn):"
echo "   - Name: www"
echo "   - Type: CNAME"
echo "   - Value: $DOMAIN"
echo "   - TTL: 3600"
echo ""
print_warning "⏳ Sau khi thêm DNS records, đợi 5-10 phút để DNS propagate!"
echo ""
read -p "Bạn đã cấu hình DNS records và sẵn sàng lấy SSL certificate? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Đang lấy SSL certificate từ Let's Encrypt..."

    # Lấy SSL certificate
    if certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN; then
        print_success "Đã lấy SSL certificate thành công!"

        # Reload Nginx để áp dụng SSL
        print_info "Đang reload Nginx để áp dụng SSL..."
        systemctl reload nginx
        print_success "Đã áp dụng SSL!"

        echo ""
        print_success "🎉 HOÀN TẤT! Website của bạn đã sẵn sàng với HTTPS!"
        echo ""
        print_info "🌐 Frontend: https://$DOMAIN"
        print_info "📡 Backend API: https://$DOMAIN/api"
        echo ""
        print_info "📋 Thông tin bổ sung:"
        echo "   - SSL certificate sẽ tự động gia hạn bởi certbot"
        echo "   - Kiểm tra SSL: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
        echo "   - Logs: /var/log/nginx/"
        echo "   - Certbot logs: /var/log/letsencrypt/"

    else
        print_error "Không thể lấy SSL certificate. Vui lòng kiểm tra:"
        echo "   - Domain $DOMAIN đã trỏ đến server chưa?"
        echo "   - Firewall có block port 80 và 443?"
        echo "   - Thử chạy: sudo certbot --nginx -d $DOMAIN"
        exit 1
    fi
else
    print_info "Bạn có thể lấy SSL certificate sau bằng lệnh:"
    echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    echo ""
    print_info "Sau đó reload Nginx: sudo systemctl reload nginx"
fi

echo ""
print_success "Script hoàn tất! Chúc bạn thành công! 🎊"
