// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


router.post('/signup', async (req, res) => {
    try {
        const { name, email, username, password } = req.body
        console.log(name,username,password)

        // Validate required fields
        if (!name || !email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        let user = await User.findOne({ $or: [{ email }, { username }] })
        if (user) {
            return res.status(400).json({ error: user.email === email ? 'Email already exists' : 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        user = new User({
            name,
            email,
            username,
            password: hashedPassword
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username' });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;