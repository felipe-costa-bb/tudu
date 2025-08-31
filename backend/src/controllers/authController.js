const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Register request:', { username, email, password: password ? '[PROVIDED]' : '[MISSING]' });
    
    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }
    
    try {
        console.log('Creating user with data:', { username, email, password: password ? '[PROVIDED]' : '[MISSING]' });
        
        // Hash password manually as a backup
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        console.log('Password hashed manually');
        
        // Create user with hashed password
        const newUser = await User.create({ 
            username, 
            email, 
            password, // This will trigger the hook
            passwordHash // This ensures we have a fallback
        });
        
        console.log('User created successfully:', { id: newUser.id, username: newUser.username });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error.message);
        console.error('Error details:', error);
        
        // Handle specific Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));
            console.error('Validation errors:', validationErrors);
            return res.status(400).json({ 
                error: 'Validation error', 
                details: validationErrors 
            });
        }
        
        // Handle unique constraint violations
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0]?.path;
            console.error('Unique constraint violation on field:', field);
            return res.status(400).json({ 
                error: `${field === 'username' ? 'Username' : 'Email'} already exists` 
            });
        }
        
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