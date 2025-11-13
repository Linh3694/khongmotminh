const path = require('path');

module.exports = {
  apps: [
    {
      name: 'khong1minh-backend',
      script: path.join(__dirname, 'Backend', 'server.js'),
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3333
      },
      error_file: path.join(__dirname, 'logs', 'backend-error.log'),
      out_file: path.join(__dirname, 'logs', 'backend-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'khong1minh-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: path.join(__dirname, 'Frontend'),
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 2222
      },
      error_file: path.join(__dirname, 'logs', 'frontend-error.log'),
      out_file: path.join(__dirname, 'logs', 'frontend-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
    {
      name: 'khong1minh-backup-cron',
      script: path.join(__dirname, 'Backend', 'backup-cron.js'),
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '0 */4 * * *', // Chạy mỗi 4 giờ (0 phút của giờ 0, 4, 8, 12, 16, 20)
      autorestart: false, // Không tự restart, chỉ chạy theo cron
      watch: false,
      error_file: path.join(__dirname, 'logs', 'backup-error.log'),
      out_file: path.join(__dirname, 'logs', 'backup-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    }
  ]
};

