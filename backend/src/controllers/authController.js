const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const passwordMatch = await user.comparePassword(password);
        
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.SESSION_SECRET, // No default secret for security
            { expiresIn: '7d' }
        );
        
        // Return user data and token as expected by frontend
        res.status(200).json({ 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName
            },
            token: token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    // Handle logout (implementation not shown)
    res.status(200).json({ message: 'Logout successful' });
};

exports.me = async (req, res) => {
    try {
        // req.user should be set by the auth middleware
        const user = await User.findByPk(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};