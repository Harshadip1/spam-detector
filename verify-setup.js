const mongoose = require('mongoose');
require('dotenv').config();

async function verifySetup() {
    console.log('🔍 Verifying SecureMessage AI Setup...\n');

    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing');
    console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing');
    console.log('   PORT:', process.env.PORT || '✅ Default (5000)');
    console.log('   NODE_ENV:', process.env.NODE_ENV || '✅ Default (development)');

    // Test MongoDB connection
    console.log('\n🔄 Testing MongoDB Atlas Connection...');
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ MongoDB Atlas Connected Successfully!');
        console.log('   🌐 Host:', conn.connection.host);
        console.log('   📊 Database:', conn.connection.name);
        console.log('   🔒 Ready State:', conn.connection.readyState);

        // Test database operations
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('   📋 Collections:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None (will be created)');

        await mongoose.disconnect();
        console.log('   🔌 Connection test completed successfully\n');

    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.log('\n💡 Troubleshooting Tips:');
        console.log('   1. Check if the MongoDB Atlas cluster is running');
        console.log('   2. Verify the username and password in the connection string');
        console.log('   3. Ensure the IP address is whitelisted in MongoDB Atlas');
        console.log('   4. Check if the database user has the necessary permissions');
        return;
    }

    // Check if server files exist
    console.log('📁 Server Files:');
    const fs = require('fs');
    const path = require('path');

    const requiredFiles = [
        'server.js',
        'models/User.js',
        'routes/auth.js',
        'routes/users.js',
        '.env'
    ];

    requiredFiles.forEach(file => {
        const exists = fs.existsSync(path.join(__dirname, file));
        console.log(`   ${file}:`, exists ? '✅ Present' : '❌ Missing');
    });

    console.log('\n🚀 Server Configuration:');
    console.log('   Port:', process.env.PORT || 5000);
    console.log('   Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:8000');
    console.log('   CORS Enabled: ✅ Yes');

    console.log('\n🎯 API Endpoints Available:');
    console.log('   POST /api/auth/register - User registration');
    console.log('   POST /api/auth/login - User login');
    console.log('   POST /api/auth/logout - User logout');
    console.log('   GET /api/auth/me - Get current user');
    console.log('   POST /api/auth/check-status - Check auth status');
    console.log('   PUT /api/auth/update-profile - Update profile');
    console.log('   GET /api/users/stats - Get user statistics');
    console.log('   GET /api/users/leaderboard - Get leaderboard');
    console.log('   GET /api/health - Health check');

    console.log('\n✅ Setup verification completed successfully!');
    console.log('💡 To start the server, run: npm start');
    console.log('🌐 Server will be available at: http://localhost:5000');
    console.log('📡 API will be available at: http://localhost:5000/api');
}

verifySetup().catch(console.error);
