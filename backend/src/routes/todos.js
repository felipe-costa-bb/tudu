const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/auth');

// Route to get all todo lists for a user
router.get('/', authMiddleware, todoController.getTodoLists);

// Route to create a new to-do list
router.post('/', authMiddleware, todoController.createTodoList);

// Route to add an item to a to-do list
router.post('/:todoListId/items', authMiddleware, todoController.addItem);

// Route to modify an item in a to-do list
router.put('/:todoListId/items/:itemId', authMiddleware, todoController.modifyItem);

// Route to remove a to-do list
router.delete('/:todoListId', authMiddleware, todoController.removeTodoList);

// Route to remove an item from a to-do list
router.delete('/:todoListId/items/:itemId', authMiddleware, todoController.removeItem);

// Route to share a to-do list with other users
router.post('/:todoListId/share', authMiddleware, todoController.shareTodoList);

// Route to assign an item to a specific user
router.post('/:todoListId/items/:itemId/assign', authMiddleware, todoController.assignItemToUser);

module.exports = router;