# Hướng dẫn cấu hình Nginx

## Yêu cầu

- Đã cài đặt Nginx
- PM2 đã chạy backend và frontend
- Port 2222 và 3333 đã được mở trên firewall

## Cài đặt Nginx (nếu chưa có)

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install nginx
```

### CentOS/RHEL:
```bash
sudo yum install nginx
# hoặc
sudo dnf install nginx
```

## Cấu hình

### Cách 1: Sử dụng script tự động (Khuyến nghị)

```bash
# Cấp quyền thực thi
chmod +x nginx-setup.sh

# Chạy script với quyền sudo
sudo ./nginx-setup.sh
```

### Cách 2: Cấu hình thủ công

1. **Copy file config vào Nginx:**
```bash
sudo cp nginx.conf /etc/nginx/sites-available/khongmotminh
```

2. **Tạo symbolic link:**
```bash
sudo ln -s /etc/nginx/sites-available/khongmotminh /etc/nginx/sites-enabled/khongmotminh
```

3. **Kiểm tra cấu hình:**
```bash
sudo nginx -t
```

4. **Reload Nginx:**
```bash
sudo systemctl reload nginx
# hoặc
sudo systemctl restart nginx
```

## Kiểm tra

Sau khi cấu hình xong, kiểm tra:

1. **Kiểm tra Nginx đang chạy:**
```bash
sudo systemctl status nginx
```

2. **Kiểm tra ports đang listen:**
```bash
sudo netstat -tlnp | grep :2222
# hoặc
sudo ss -tlnp | grep :2222
```

3. **Test từ browser:**
- Frontend: `http://42.96.40.246:2222`
- API: `http://42.96.40.246:2222/api/health`

## Cấu trúc file config

- **Frontend**: Proxy từ `42.96.40.246:2222` → `localhost:2222`
- **Backend API**: Proxy từ `42.96.40.246:2222/api` → `localhost:3333/api`

## Logs

Logs được lưu tại:
- Access log: `/var/log/nginx/khongmotminh-frontend-access.log`
- Error log: `/var/log/nginx/khongmotminh-frontend-error.log`

Xem logs realtime:
```bash
sudo tail -f /var/log/nginx/khongmotminh-frontend-access.log
sudo tail -f /var/log/nginx/khongmotminh-frontend-error.log
```

## Firewall

Đảm bảo port 2222 đã được mở:

### UFW (Ubuntu):
```bash
sudo ufw allow 2222/tcp
sudo ufw reload
```

### Firewalld (CentOS/RHEL):
```bash
sudo firewall-cmd --permanent --add-port=2222/tcp
sudo firewall-cmd --reload
```

### iptables:
```bash
sudo iptables -A INPUT -p tcp --dport 2222 -j ACCEPT
sudo iptables-save
```

## SSL/HTTPS (Tùy chọn)

Nếu bạn có SSL certificate, uncomment phần HTTPS trong file `nginx.conf` và cấu hình:

1. Chỉnh sửa đường dẫn certificate:
```nginx
ssl_certificate /path/to/your/certificate.crt;
ssl_certificate_key /path/to/your/private.key;
```

2. Uncomment phần HTTPS server trong `nginx.conf`

3. Reload Nginx:
```bash
sudo systemctl reload nginx
```

## Troubleshooting

### Lỗi 502 Bad Gateway
- Kiểm tra PM2 đang chạy: `pm2 status`
- Kiểm tra backend/frontend đang listen trên đúng port
- Kiểm tra logs: `sudo tail -f /var/log/nginx/khongmotminh-frontend-error.log`

### Lỗi 403 Forbidden
- Kiểm tra quyền truy cập file
- Kiểm tra SELinux (nếu có)

### Port đã được sử dụng
```bash
# Tìm process đang sử dụng port
sudo lsof -i :2222
# hoặc
sudo netstat -tlnp | grep :2222
```

### Test cấu hình
```bash
# Test syntax
sudo nginx -t

# Test với verbose
sudo nginx -T
```

## Các lệnh Nginx hữu ích

```bash
# Start
sudo systemctl start nginx

# Stop
sudo systemctl stop nginx

# Restart
sudo systemctl restart nginx

# Reload (không downtime)
sudo systemctl reload nginx

# Status
sudo systemctl status nginx

# Enable auto-start on boot
sudo systemctl enable nginx
```

## Cập nhật Frontend để sử dụng API qua Nginx

Nếu bạn muốn frontend gọi API qua Nginx thay vì trực tiếp đến backend, cập nhật các file:

- `Frontend/src/components/Summary.tsx`
- `Frontend/src/components/SignSection.tsx`
- `Frontend/src/components/HeroSection.tsx`

Thay đổi từ:
```javascript
const API_BASE = 'http://localhost:3333/api';
```

Thành:
```javascript
const API_BASE = '/api'; // Sử dụng relative path để đi qua Nginx
```

Hoặc nếu muốn dùng absolute URL:
```javascript
const API_BASE = 'http://42.96.40.246:2222/api';
```

