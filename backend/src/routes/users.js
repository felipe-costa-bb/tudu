const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Get user details
router.get('/:id', authMiddleware, userController.getUser);

// Update user details
router.put('/:id', authMiddleware, userController.updateUser);

// Assign item to user
router.post('/:id/assign-item', authMiddleware, userController.assignItemToUser);

module.exports = router;