const express = require('express');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', async (req, res) => {
    try {
        const stats = await User.getStats();

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error getting user statistics'
        });
    }
});

// @route   GET /api/users/leaderboard
// @desc    Get top users by security score
// @access  Public
router.get('/leaderboard', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const topUsers = await User.find({ isActive: true })
            .select('name profile stats')
            .sort({ 'stats.securityScore': -1 })
            .limit(limit);

        const leaderboard = topUsers.map((user, index) => ({
            rank: index + 1,
            name: user.name,
            initials: user.initials,
            score: user.stats.securityScore,
            totalScans: user.stats.totalScans
        }));

        res.json({
            success: true,
            data: leaderboard
        });

    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error getting leaderboard'
        });
    }
});

module.exports = router;
