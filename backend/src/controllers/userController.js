const User = require('../models/User');
const TodoItem = require('../models/TodoItem');

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const [updatedRowsCount] = await User.update(req.body, { 
            where: { id: userId }
        });
        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = await User.findByPk(userId);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.assignItemToUser = async (req, res) => {
    try {
        const { itemId, userId } = req.body;
        // Logic to assign the item to the user
        // This would typically involve updating the TodoItem model
        const [updatedRowsCount] = await TodoItem.update(
            { assignedTo: userId },
            { where: { id: itemId } }
        );
        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        const item = await TodoItem.findByPk(itemId);
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};