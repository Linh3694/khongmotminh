const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/ // Regex cho số điện thoại Việt Nam
    }
  },
  currentPosition: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
    validate: {
      notEmpty: true,
      len: [2, 200]
    }
  },
  termsAgreed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true, // Tự động thêm createdAt và updatedAt
});

module.exports = User;
