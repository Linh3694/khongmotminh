# Hướng dẫn fix lỗi SQLite3 "invalid ELF header"

## Nguyên nhân

Lỗi này xảy ra khi `sqlite3` được build trên một kiến trúc/hệ điều hành khác (ví dụ: macOS) và đang chạy trên Linux server. File binary `.node` không tương thích.

## Giải pháp

### Cách 1: Rebuild sqlite3 trên server (Khuyến nghị)

**Trên server Linux, chạy các lệnh sau:**

```bash
cd /srv/app/khongmotminh/Backend

# Xóa node_modules của sqlite3
rm -rf node_modules/sqlite3

# Rebuild và cài đặt lại
npm install sqlite3 --build-from-source

# Hoặc cài đặt lại toàn bộ dependencies
rm -rf node_modules package-lock.json
npm install
```

### Cách 2: Sử dụng script tự động

```bash
# Cấp quyền thực thi
chmod +x fix-sqlite3.sh

# Chạy script
./fix-sqlite3.sh
```

### Cách 3: Cài đặt build tools (BẮT BUỘC nếu thiếu)

**Lỗi "not found: make"** nghĩa là server thiếu build tools. Cài đặt ngay:

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y build-essential python3
```

**CentOS/RHEL:**
```bash
sudo yum groupinstall -y "Development Tools"
sudo yum install -y python3
```

**Sau đó rebuild sqlite3:**
```bash
cd /srv/app/khongmotminh/Backend
rm -rf node_modules/sqlite3
npm install sqlite3 --build-from-source
```

### Sau khi rebuild xong:

```bash
# Restart PM2 backend
pm2 restart khong1minh-backend

# Kiểm tra logs
pm2 logs khong1minh-backend
```

## Kiểm tra kiến trúc hệ thống

```bash
# Kiểm tra kiến trúc
uname -m

# Kiểm tra Node.js version
node -v

# Kiểm tra npm version
npm -v
```

## Lưu ý

- Luôn rebuild native modules trên cùng hệ thống sẽ chạy production
- Không copy `node_modules` từ máy dev (macOS/Windows) sang server Linux
- Sử dụng `.gitignore` để không commit `node_modules`
- Có thể sử dụng `npm ci` thay vì `npm install` trong production để đảm bảo consistency

