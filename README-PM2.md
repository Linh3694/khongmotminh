# Hướng dẫn sử dụng PM2

## Cài đặt PM2

```bash
npm install -g pm2
```

## Cấu hình

- **Backend**: Chạy trên port `3333`
- **Frontend**: Chạy trên port `2222`
- **Backup Database**: Tự động backup mỗi 4 giờ

## Các lệnh PM2

### Khởi động tất cả apps
```bash
pm2 start ecosystem.config.js
```

### Khởi động từng app riêng lẻ
```bash
pm2 start ecosystem.config.js --only backend
pm2 start ecosystem.config.js --only frontend
pm2 start ecosystem.config.js --only backup-cron
```

### Xem trạng thái
```bash
pm2 status
pm2 list
```

### Xem logs
```bash
# Xem tất cả logs
pm2 logs

# Xem log của từng app
pm2 logs backend
pm2 logs frontend
pm2 logs backup-cron

# Xem log realtime
pm2 logs --lines 100
```

### Dừng apps
```bash
# Dừng tất cả
pm2 stop ecosystem.config.js

# Dừng từng app
pm2 stop backend
pm2 stop frontend
pm2 stop backup-cron
```

### Restart apps
```bash
# Restart tất cả
pm2 restart ecosystem.config.js

# Restart từng app
pm2 restart backend
pm2 restart frontend
```

### Xóa apps khỏi PM2
```bash
pm2 delete ecosystem.config.js
pm2 delete backend
pm2 delete frontend
pm2 delete backup-cron
```

### Lưu cấu hình PM2 để tự động khởi động khi reboot
```bash
pm2 save
pm2 startup
```

### Monitor
```bash
pm2 monit
```

## Backup Database

- Backup tự động chạy mỗi 4 giờ (0:00, 4:00, 8:00, 12:00, 16:00, 20:00)
- Backup được lưu trong thư mục `Backend/backups/`
- Chỉ giữ lại 7 bản backup gần nhất
- Tên file: `database-backup-YYYY-MM-DD_HH-MM-SS.sqlite`

### Chạy backup thủ công
```bash
node Backend/backup-database.js
```

## Cấu trúc thư mục logs

```
logs/
├── backend-error.log
├── backend-out.log
├── frontend-error.log
├── frontend-out.log
├── backup-error.log
└── backup-out.log
```

## Lưu ý

1. Đảm bảo đã cài đặt tất cả dependencies:
   ```bash
   cd Backend && npm install
   cd ../Frontend && npm install
   ```

2. Tạo thư mục logs nếu chưa có:
   ```bash
   mkdir -p logs
   ```

3. Kiểm tra ports 2222 và 3333 có đang được sử dụng không:
   ```bash
   lsof -i :2222
   lsof -i :3333
   ```

