const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./database');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3333;

// Middleware
// CORS configuration - cho phép cả localhost và production domain
const allowedOrigins = [
  'http://localhost:2222',
  'http://42.96.40.246:2222',
  'https://khongmotminh.vn', // Vite default port
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép requests không có origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Kiểm tra origin có trong danh sách allowed không
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Trong production, có thể cho phép tất cả hoặc chỉ specific domains
      // Hiện tại cho phép tất cả để dễ debug, có thể thắt chặt sau
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Chào mừng đến với API Backend!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API cho users

// Lấy danh sách tất cả users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'phone', 'currentPosition', 'termsAgreed', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách users:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách users'
    });
  }
});

// Lấy thông tin user theo ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await User.findByPk(userId, {
      attributes: ['id', 'fullName', 'email', 'phone', 'currentPosition', 'termsAgreed', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Lỗi lấy user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin user'
    });
  }
});

// API đăng ký user mới
app.post('/api/users', async (req, res) => {
  try {
    const { fullName, email, phone, currentPosition, termsAgreed } = req.body;

    // Validation
    if (!fullName || !email || !phone || termsAgreed === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Tất cả các trường đều bắt buộc'
      });
    }

    if (!termsAgreed) {
      return res.status(400).json({
        success: false,
        message: 'Bạn phải cam kết cùng nhau an toàn trực tuyến'
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Tạo user mới
    const newUser = await User.create({
      fullName,
      email,
      phone,
      currentPosition,
      termsAgreed
    });

    // Lấy tổng số users để trả về count
    const totalUsers = await User.count();

    res.status(201).json({
      success: true,
      message: 'Ký cam kết thành công. Cảm ơn bạn đã tham gia.',
      data: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        currentPosition: newUser.currentPosition,
        termsAgreed: newUser.termsAgreed,
        createdAt: newUser.createdAt
      },
      totalUsers: totalUsers
    });

  } catch (error) {
    console.error('Lỗi tạo user:', error);

    // Xử lý lỗi validation
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo user'
    });
  }
});

// API lấy thống kê
app.get('/api/stats', async (req, res) => {
  try {
    const totalUsers = await User.count();

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers
      }
    });
  } catch (error) {
    console.error('Lỗi lấy thống kê:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi server'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại'
  });
});

// Khởi tạo database và server
const startServer = async () => {
  try {
    console.log('🔄 Đang khởi tạo server...');

    // Kết nối database
    console.log('🔗 Đang kết nối database...');
    await connectDB();
    console.log('✅ Kết nối database thành công!');

    // Sync database (tạo bảng nếu chưa có, thêm cột mới nếu cần)
    console.log('🔄 Đang sync database tables...');
    await User.sync({ force: false, alter: true });
    console.log('✅ Database tables đã được sync!');

    // Khởi động server
    console.log(`🚀 Đang khởi động server trên port ${PORT}...`);
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server đang chạy trên port ${PORT}`);
      console.log(`🌐 Frontend URL: http://localhost:2222`);
      console.log(`📡 API URL: http://0.0.0.0:${PORT}`);
      console.log(`🗄️  Database: SQLite`);
      console.log('✅ Server khởi tạo hoàn tất!');
    });

    // Xử lý tín hiệu tắt server
    process.on('SIGINT', () => {
      console.log('\n🛑 Đang tắt server...');
      server.close(() => {
        console.log('✅ Server đã tắt');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      console.log('\n🛑 Đang tắt server...');
      server.close(() => {
        console.log('✅ Server đã tắt');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Lỗi khởi tạo server:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

startServer();
