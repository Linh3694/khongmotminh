const { exec } = require('child_process');
const path = require('path');

/**
 * Cron job script để backup database mỗi 4 giờ
 * Script này sẽ được PM2 chạy với cron schedule
 */

const backupScript = path.join(__dirname, 'backup-database.js');

console.log(`⏰ Cron job backup database đang chạy...`);
console.log(`📅 Thời gian: ${new Date().toLocaleString('vi-VN')}`);

// Chạy script backup
exec(`node "${backupScript}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Lỗi khi chạy backup: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️  Warning: ${stderr}`);
  }
  if (stdout) {
    console.log(stdout);
  }
});

