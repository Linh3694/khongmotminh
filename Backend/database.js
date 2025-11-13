const { Sequelize } = require('sequelize');

// Khởi tạo Sequelize với SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: true, // Tắt logging SQL trong console
});

// Test kết nối database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error);
  }
};

module.exports = { sequelize, connectDB };
