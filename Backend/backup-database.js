const fs = require('fs');
const path = require('path');

/**
 * Script backup database SQLite
 * Tạo backup với timestamp và giữ lại 7 bản backup gần nhất
 */

const DB_PATH = path.join(__dirname, 'database.sqlite');
const BACKUP_DIR = path.join(__dirname, 'backups');

// Tạo thư mục backups nếu chưa có
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function backupDatabase() {
  try {
    // Kiểm tra file database có tồn tại không
    if (!fs.existsSync(DB_PATH)) {
      console.error('❌ Không tìm thấy file database.sqlite');
      return;
    }

    // Tạo tên file backup với timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                     new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    const backupFileName = `database-backup-${timestamp}.sqlite`;
    const backupPath = path.join(BACKUP_DIR, backupFileName);

    // Copy file database
    fs.copyFileSync(DB_PATH, backupPath);
    
    console.log(`✅ Backup thành công: ${backupFileName}`);

    // Xóa các backup cũ, chỉ giữ lại 7 bản gần nhất
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('database-backup-') && file.endsWith('.sqlite'))
      .map(file => ({
        name: file,
        path: path.join(BACKUP_DIR, file),
        time: fs.statSync(path.join(BACKUP_DIR, file)).mtime
      }))
      .sort((a, b) => b.time - a.time); // Sắp xếp mới nhất trước

    // Xóa các backup cũ hơn 7 bản
    if (backups.length > 7) {
      const toDelete = backups.slice(7);
      toDelete.forEach(backup => {
        fs.unlinkSync(backup.path);
        console.log(`🗑️  Đã xóa backup cũ: ${backup.name}`);
      });
    }

    console.log(`📦 Tổng số backup hiện tại: ${Math.min(backups.length, 7)}`);
  } catch (error) {
    console.error('❌ Lỗi khi backup database:', error);
    process.exit(1);
  }
}

// Chạy backup
backupDatabase();

