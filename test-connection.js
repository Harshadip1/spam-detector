require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('🔄 Testing MongoDB Atlas connection...');
        console.log('📡 Connection String:', process.env.MONGODB_URI ? '***configured***' : 'NOT FOUND');

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ MongoDB Atlas Connected Successfully!');
        console.log('🌐 Host:', conn.connection.host);
        console.log('📊 Database:', conn.connection.name);
        console.log('🔒 Ready State:', conn.connection.readyState);

        // Test database operations
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('📋 Collections:', collections.map(c => c.name));

        await mongoose.disconnect();
        console.log('🔌 Disconnected successfully');

    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
}

testConnection();
