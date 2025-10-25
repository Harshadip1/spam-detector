#!/usr/bin/env node

/**
 * Setup script for SecureMessage AI
 * Helps new contributors get started quickly
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up SecureMessage AI...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        // Copy .env.example to .env
        const envExample = fs.readFileSync(envExamplePath, 'utf8');
        
        // Generate a secure JWT secret
        const jwtSecret = crypto.randomBytes(64).toString('hex');
        
        // Replace placeholder with generated secret
        const envContent = envExample.replace(
            'your_super_secret_jwt_key_here_change_this_in_production',
            jwtSecret
        );
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Created .env file with secure JWT secret');
    } else {
        console.log('❌ .env.example file not found');
        process.exit(1);
    }
} else {
    console.log('✅ .env file already exists');
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
    console.log('⚠️  Warning: Node.js 16+ is recommended. Current version:', nodeVersion);
} else {
    console.log('✅ Node.js version:', nodeVersion);
}

// Check if MongoDB URI is configured
const envContent = fs.readFileSync(envPath, 'utf8');
if (envContent.includes('YOUR_USERNAME:YOUR_PASSWORD')) {
    console.log('\n⚠️  IMPORTANT: Update your MongoDB Atlas credentials in .env file');
    console.log('   1. Sign up at https://www.mongodb.com/atlas');
    console.log('   2. Create a free cluster');
    console.log('   3. Create a database user');
    console.log('   4. Get your connection string');
    console.log('   5. Update MONGODB_URI in .env file\n');
} else {
    console.log('✅ MongoDB URI appears to be configured');
}

console.log('🎉 Setup complete! Next steps:');
console.log('   1. Update .env with your MongoDB Atlas credentials (if not done)');
console.log('   2. Run: npm run dev');
console.log('   3. In another terminal: python -m http.server 8000');
console.log('   4. Visit: http://localhost:8000\n');

console.log('📚 Need help? Check DEPLOYMENT.md for detailed instructions');
