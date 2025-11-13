#!/bin/bash

# Script để rebuild sqlite3 trên Linux server
# Chạy script này trên server Linux để fix lỗi "invalid ELF header"

echo "🔧 Đang rebuild sqlite3 cho Linux..."

# Kiểm tra quyền root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Script này cần quyền sudo để cài đặt build tools"
    echo "Vui lòng chạy: sudo ./fix-sqlite3.sh"
    exit 1
fi

# Kiểm tra và cài đặt build tools
echo "📦 Đang kiểm tra build tools..."

# Kiểm tra xem có make không
if ! command -v make &> /dev/null; then
    echo "🔨 Không tìm thấy make, đang cài đặt build-essential..."
    
    # Kiểm tra distro
    if [ -f /etc/debian_version ]; then
        # Ubuntu/Debian
        apt-get update
        apt-get install -y build-essential python3 node-gyp
    elif [ -f /etc/redhat-release ]; then
        # CentOS/RHEL
        yum groupinstall -y "Development Tools"
        yum install -y python3 node-gyp
    else
        echo "❌ Không xác định được distro. Vui lòng cài đặt thủ công:"
        echo "   Ubuntu/Debian: sudo apt-get install -y build-essential python3"
        echo "   CentOS/RHEL: sudo yum groupinstall -y 'Development Tools' && sudo yum install -y python3"
        exit 1
    fi
else
    echo "✅ Build tools đã được cài đặt"
fi

# Di chuyển vào thư mục Backend
cd Backend || exit 1

# Xóa node_modules và package-lock.json của sqlite3
echo "🗑️  Đang xóa node_modules cũ..."
rm -rf node_modules/sqlite3

# Cài đặt lại sqlite3 với build tools
echo "📦 Đang rebuild sqlite3..."
npm install sqlite3 --build-from-source

if [ $? -eq 0 ]; then
    echo "✅ Hoàn tất rebuild sqlite3!"
    echo ""
    echo "📝 Restart PM2 backend:"
    echo "pm2 restart khong1minh-backend"
    echo "pm2 logs khong1minh-backend"
else
    echo "❌ Có lỗi khi rebuild sqlite3"
    echo "Thử cách khác:"
    echo "cd Backend"
    echo "rm -rf node_modules package-lock.json"
    echo "npm install"
    exit 1
fi

