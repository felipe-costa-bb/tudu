const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash' // Explicitly map to database column
  },
  password: {
    type: DataTypes.VIRTUAL,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password cannot be empty'
      },
      len: {
        args: [6, 255],
        msg: 'Password must be between 6 and 255 characters'
      }
    },
    set(value) {
      // Hash the password when it's set
      if (value) {
        console.log('Password setter called with value');
        // We'll hash it in the beforeCreate hook instead
        this.setDataValue('password', value);
      }
    }
  },
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'full_name'
  }
}, {
  tableName: 'users',
  timestamps: true, // This adds createdAt and updatedAt automatically
  underscored: true // This converts camelCase to snake_case for database columns
});

// Hash password before saving
User.beforeCreate(async (user) => {
  console.log('beforeCreate hook called with user:', { 
    username: user.username, 
    email: user.email, 
    password: user.password ? '[PROVIDED]' : '[MISSING]',
    passwordHash: user.passwordHash ? '[EXISTS]' : '[MISSING]'
  });
  
  if (user.password) {
    console.log('Hashing password...');
    const saltRounds = 12;
    user.passwordHash = await bcrypt.hash(user.password, saltRounds);
    console.log('Password hashed successfully');
    // Remove the plain password for security
    delete user.dataValues.password;
  } else {
    console.log('No password provided for hashing');
  }
});

// Hash password before updating
User.beforeUpdate(async (user) => {
  if (user.password) {
    const saltRounds = 12;
    user.passwordHash = await bcrypt.hash(user.password, saltRounds);
    // Remove the plain password for security
    delete user.dataValues.password;
  }
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

module.exports = User;