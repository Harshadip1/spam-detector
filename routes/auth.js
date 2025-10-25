const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Validation middleware
const validateRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            profile: {
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' ') || ''
            }
        });

        // Set password (will be hashed by pre-save middleware)
        user.password = password;

        await user.save();

        // Log registration activity
        user.addActivity('registration', 'User account created');
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile: user.profile,
                    stats: user.stats,
                    preferences: user.preferences,
                    joinDate: user.createdAt,
                    lastLogin: user.lastLogin
                }
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findByEmail(email).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is locked
        if (user.isLocked()) {
            const remainingTime = Math.ceil((user.loginAttempts.lockedUntil - new Date()) / 60000);
            return res.status(423).json({
                success: false,
                message: `Account is locked. Try again in ${remainingTime} minutes.`
            });
        }

        // Check password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            // Increment login attempts
            user.incrementLoginAttempts();
            await user.save();

            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Reset login attempts on successful login
        user.resetLoginAttempts();
        user.lastLogin = new Date();
        user.addActivity('login', 'User logged in successfully', {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return success response
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile: user.profile,
                    stats: user.stats,
                    preferences: user.preferences,
                    joinDate: user.createdAt,
                    lastLogin: user.lastLogin
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user and invalidate token
// @access  Private
router.post('/logout', auth, async (req, res) => {
    try {
        // User is already available from auth middleware
        const user = req.user;

        // Log the logout activity
        user.addActivity('logout', 'User logged out', {
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });
        await user.save();

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user information
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        // User is already available from auth middleware
        const user = req.user;

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile: user.profile,
                    stats: user.stats,
                    preferences: user.preferences,
                    joinDate: user.createdAt,
                    lastLogin: user.lastLogin,
                    initials: user.initials
                }
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error getting user information'
        });
    }
});

// @route   POST /api/auth/check-status
// @desc    Check authentication status
// @access  Public
router.post('/check-status', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.json({
                authenticated: false,
                user: null
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.json({
                authenticated: false,
                user: null
            });
        }

        res.json({
            authenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile: user.profile,
                stats: user.stats,
                preferences: user.preferences,
                joinDate: user.createdAt,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Check status error:', error);
        res.json({
            authenticated: false,
            user: null
        });
    }
});

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.put('/update-profile', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User not found or account deactivated'
            });
        }

        const { name, profile, preferences } = req.body;

        // Update fields if provided
        if (name) user.name = name;
        if (profile) user.profile = { ...user.profile, ...profile };
        if (preferences) user.preferences = { ...user.preferences, ...preferences };

        await user.save();
        user.addActivity('setting_change', 'Profile updated');
        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profile: user.profile,
                    stats: user.stats,
                    preferences: user.preferences
                }
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update'
        });
    }
});

module.exports = router;
