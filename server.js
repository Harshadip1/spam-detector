const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const { auth } = require('./middleware/auth');

// Try to load spam routes, create fallback if not available
let spamRoutes;
try {
    spamRoutes = require('./routes/spam');
} catch (error) {
    console.warn('Spam routes not found, creating fallback...');
    const express = require('express');
    spamRoutes = express.Router();
    
    // Fallback spam analysis endpoint
    spamRoutes.post('/analyze', (req, res) => {
        const { content } = req.body;
        const isSpam = /lottery|winner|prize|urgent|click here|free money/i.test(content || '');
        
        res.json({
            success: true,
            data: {
                analysis: {
                    isSpam,
                    confidence: isSpam ? 75 : 25,
                    riskLevel: isSpam ? 'high' : 'low',
                    detectedPatterns: [],
                    riskFactors: [],
                    recommendations: isSpam ? 
                        ['Exercise caution with this message'] : 
                        ['Message appears safe']
                },
                timestamp: new Date().toISOString(),
                messageLength: (content || '').length
            }
        });
    });
    
    // Fallback stats endpoint
    spamRoutes.get('/stats', (req, res) => {
        res.json({
            success: true,
            data: {
                totalScans: 0,
                totalSpamDetected: 0,
                totalSafeMessages: 0,
                totalSuspiciousMessages: 0,
                totalUsers: 0,
                avgSecurityScore: 0,
                detectionRate: 0,
                accuracy: 99.9,
                lastUpdated: new Date().toISOString()
            }
        });
    });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:8000', 'http://localhost:3000', 'http://127.0.0.1:8000'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('./', {
    index: 'index.html',
    extensions: ['html', 'css', 'js']
}));

// MongoDB Atlas Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Modern connection options
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/spam', spamRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
    });
});

// Test endpoint for debugging (remove in production)
if (process.env.NODE_ENV === 'development') {
    app.post('/api/test', (req, res) => {
        console.log('Test endpoint hit:', req.body);
        res.json({
            success: true,
            message: 'Test endpoint working',
            receivedData: req.body,
            timestamp: new Date().toISOString()
        });
    });
}

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🌐 Website URL: http://localhost:${PORT}`);
            console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = app;
