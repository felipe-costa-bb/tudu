const User = require('./User');
const TodoList = require('./TodoList');
const TodoItem = require('./TodoItem');
const ListCollaborator = require('./ListCollaborator');

// Associations
TodoList.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasMany(TodoList, { foreignKey: 'owner_id', as: 'todo_lists' });


// Many-to-many for convenience
TodoList.belongsToMany(User, {
  through: ListCollaborator,
  foreignKey: 'list_id',
  otherKey: 'user_id',
  as: 'collaboratorUsers'
});
User.belongsToMany(TodoList, {
  through: ListCollaborator,
  foreignKey: 'user_id',
  otherKey: 'list_id',
  as: 'collaborations'
});

// For eager loading collaborators as records
TodoList.hasMany(ListCollaborator, { foreignKey: 'list_id', as: 'collaborators' });
ListCollaborator.belongsTo(TodoList, { foreignKey: 'list_id', as: 'list' });
ListCollaborator.belongsTo(User, { foreignKey: 'user_id', as: 'user' });


TodoItem.belongsTo(TodoList, { foreignKey: 'todo_list_id', as: 'list' });
TodoList.hasMany(TodoItem, { foreignKey: 'todo_list_id', as: 'items' });

module.exports = {
  User,
  TodoList,
  TodoItem,
  ListCollaborator
};
