const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const TodoList = require('./TodoList');

const ListCollaborator = sequelize.define('ListCollaborator', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TodoList,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  permission: {
    type: DataTypes.ENUM('view', 'edit', 'admin'),
    defaultValue: 'edit'
  },
  invited_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'list_collaborators',
  timestamps: false,
  underscored: true
});


module.exports = ListCollaborator;
