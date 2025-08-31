const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const TodoList = require('./TodoList');

const TodoItem = sequelize.define('TodoItem', {
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
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending'
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  todo_list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'list_id', // Map to the actual database column
    references: {
      model: TodoList,
      key: 'id'
    }
  }
}, {
  tableName: 'todo_items',
  timestamps: true,
  underscored: true
});

// Define associations
TodoItem.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
TodoItem.belongsTo(TodoList, { foreignKey: 'todo_list_id', as: 'todo_list' });
User.hasMany(TodoItem, { foreignKey: 'assigned_to', as: 'assigned_items' });

module.exports = TodoItem;