module.exports = {
  apps: [
    {
      name: 'khong1minh-backend',
      script: './Backend/server.js',
      cwd: './Backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3333
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
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
      cwd: './Frontend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 2222
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
    {
      name: 'khong1minh-backup-cron',
      script: './Backend/backup-cron.js',
      cwd: './Backend',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '0 */4 * * *', // Chạy mỗi 4 giờ (0 phút của giờ 0, 4, 8, 12, 16, 20)
      autorestart: false, // Không tự restart, chỉ chạy theo cron
      watch: false,
      error_file: './logs/backup-error.log',
      out_file: './logs/backup-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    }
  ]
};

