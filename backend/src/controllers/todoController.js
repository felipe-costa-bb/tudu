const TodoList = require('../models/TodoList');
const TodoItem = require('../models/TodoItem');

// Get all todo lists for a user
exports.getTodoLists = async (req, res) => {
    try {
        const todoLists = await TodoList.findAll({
            where: { 
                owner_id: req.user.userId 
            },
            include: [{
                model: TodoItem,
                as: 'items'
            }]
        });
        res.status(200).json(todoLists);
    } catch (error) {
        console.error('Error fetching todo lists:', error);
        res.status(500).json({ message: 'Error fetching todo lists', error: error.message });
    }
};

// Create a new to-do list
exports.createTodoList = async (req, res) => {
    console.log('createTodoList called');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const { title, description } = req.body;
    const owner_id = req.user.userId; // Use userId from auth middleware

    try {
        console.log('Creating todo list with:', { title, description, owner_id });
        const newTodoList = await TodoList.create({ title, description, owner_id });
        console.log('Created todo list:', newTodoList.toJSON());
        res.status(201).json(newTodoList);
    } catch (error) {
        console.error('Error creating todo list:', error);
        res.status(500).json({ message: 'Error creating to-do list', error: error.message });
    }
};

// Add an item to a to-do list
exports.addItem = async (req, res) => {
    const { todoListId } = req.params;
    const { title, description, completed = false } = req.body;

    try {
        const newItem = await TodoItem.create({ 
            title, 
            description, 
            status: completed ? 'completed' : 'pending', // Use status instead of completed
            todo_list_id: todoListId // This maps to list_id in the database
        });
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ message: 'Error adding item', error: error.message });
    }
};

// Modify an existing item
exports.modifyItem = async (req, res) => {
    const { itemId } = req.params;
    const updates = req.body;

    try {
        const [updatedRowsCount] = await TodoItem.update(updates, { 
            where: { id: itemId },
            returning: true 
        });
        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const updatedItem = await TodoItem.findByPk(itemId);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error modifying item', error });
    }
};

// Remove a to-do list
exports.removeTodoList = async (req, res) => {
    const { todoListId } = req.params;
    const userId = req.user.userId;

    try {
        // First check if the list exists and belongs to the user
        const todoList = await TodoList.findOne({ 
            where: { 
                id: todoListId,
                owner_id: userId 
            }
        });
        
        if (!todoList) {
            return res.status(404).json({ message: 'Todo list not found or you do not have permission to delete it' });
        }

        const deletedRowsCount = await TodoList.destroy({ 
            where: { 
                id: todoListId,
                owner_id: userId 
            }
        });
        
        if (deletedRowsCount === 0) {
            return res.status(404).json({ message: 'Todo list not found' });
        }
        
        res.status(204).send();
    } catch (error) {
        console.error('Error removing todo list:', error);
        res.status(500).json({ message: 'Error removing to-do list', error: error.message });
    }
};

// Remove an item from a to-do list
exports.removeItem = async (req, res) => {
    const { itemId } = req.params;

    try {
        const deletedRowsCount = await TodoItem.destroy({ where: { id: itemId } });
        if (deletedRowsCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error removing item', error });
    }
};

// Share a to-do list with other users
exports.shareTodoList = async (req, res) => {
    const { todoListId } = req.params;
    const { sharedWith } = req.body; // Array of user IDs

    try {
        const todoList = await TodoList.findByPk(todoListId);
        if (!todoList) {
            return res.status(404).json({ message: 'Todo list not found' });
        }
        await todoList.update({ sharedWith });
        res.status(200).json(todoList);
    } catch (error) {
        console.error('Error sharing todo list:', error);
        res.status(500).json({ message: 'Error sharing to-do list', error: error.message });
    }
};

// Assign an item to a specific user
exports.assignItemToUser = async (req, res) => {
    const { itemId } = req.params;
    const { userId } = req.body;

    try {
        const [updatedRowsCount] = await TodoItem.update(
            { assignedTo: userId },
            { where: { id: itemId } }
        );
        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const updatedItem = await TodoItem.findByPk(itemId);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning item', error });
    }
};