const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const TodoList = sequelize.define('TodoList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'todo_lists',
  timestamps: true,
  underscored: true
});

// Define associations
TodoList.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasMany(TodoList, { foreignKey: 'owner_id', as: 'todo_lists' });

module.exports = TodoList;