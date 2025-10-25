# MongoDB Setup Guide for SecureMessage AI

This comprehensive guide will help you set up MongoDB Atlas (cloud) or local MongoDB for your SecureMessage AI application.

## 🚀 Quick Start Options

### Option 1: MongoDB Atlas (Cloud) - Recommended
### Option 2: Local MongoDB Installation
### Option 3: Docker MongoDB

---

## 📊 Option 1: MongoDB Atlas (Cloud Database) - RECOMMENDED

MongoDB Atlas is a fully managed cloud database service that's perfect for production applications.

### Step 1: Create MongoDB Atlas Account

1. **Visit MongoDB Atlas**
   - Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Click "Try Free" or "Start Free"

2. **Sign Up**
   - Create account with email or use Google/GitHub
   - Verify your email address

### Step 2: Create a Cluster

1. **Create New Project**
   - Project Name: `SecureMessage AI`
   - Click "Next" and "Create Project"

2. **Build a Database**
   - Choose "M0 Sandbox" (Free tier)
   - Cloud Provider: AWS, Google Cloud, or Azure
   - Region: Choose closest to your location
   - Cluster Name: `SecureMessage-Cluster`
   - Click "Create"

### Step 3: Configure Database Access

1. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `securemessage_admin`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

2. **Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IP addresses
   - Click "Confirm"

### Step 4: Get Connection String

1. **Connect to Cluster**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 4.1 or later
   - Copy the connection string

2. **Connection String Format**
   ```
   mongodb+srv://securemessage_admin:<password>@securemessage-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Configure Environment Variables

1. **Update .env file**
   ```env
   # MongoDB Atlas Configuration
   MONGODB_URI=mongodb+srv://securemessage_admin:YOUR_PASSWORD@securemessage-cluster.xxxxx.mongodb.net/securemessage_ai?retryWrites=true&w=majority
   
   # Replace YOUR_PASSWORD with your actual password
   # Replace xxxxx with your cluster identifier
   ```

---

## 💻 Option 2: Local MongoDB Installation

### Windows Installation

1. **Download MongoDB**
   - Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select Windows, MSI package
   - Download and run installer

2. **Installation Steps**
   - Choose "Complete" installation
   - Install MongoDB as a Service: ✅ Yes
   - Service Name: MongoDB
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log`

3. **Install MongoDB Compass** (Optional GUI)
   - Check the box during installation
   - Or download separately from MongoDB website

4. **Verify Installation**
   ```bash
   # Open Command Prompt as Administrator
   mongod --version
   mongo --version
   ```

### macOS Installation

1. **Using Homebrew** (Recommended)
   ```bash
   # Install Homebrew if not installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Add MongoDB tap
   brew tap mongodb/brew
   
   # Install MongoDB Community Edition
   brew install mongodb-community@7.0
   
   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   ```

2. **Manual Installation**
   - Download from MongoDB website
   - Extract to `/usr/local/mongodb`
   - Add to PATH in `.bash_profile` or `.zshrc`

### Linux Installation (Ubuntu/Debian)

1. **Import MongoDB GPG Key**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
   ```

2. **Add MongoDB Repository**
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   ```

3. **Install MongoDB**
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

4. **Start MongoDB Service**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

### Local MongoDB Configuration

1. **Environment Variables**
   ```env
   # Local MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/securemessage_ai
   ```

2. **Create Database and User** (Optional)
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Switch to admin database
   use admin
   
   # Create admin user
   db.createUser({
     user: "admin",
     pwd: "your_secure_password",
     roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
   })
   
   # Switch to your app database
   use securemessage_ai
   
   # Create app user
   db.createUser({
     user: "securemessage_user",
     pwd: "your_app_password",
     roles: ["readWrite"]
   })
   ```

---

## 🐳 Option 3: Docker MongoDB

### Docker Compose Setup

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     mongodb:
       image: mongo:7.0
       container_name: securemessage_mongodb
       restart: always
       ports:
         - "27017:27017"
       environment:
         MONGO_INITDB_ROOT_USERNAME: admin
         MONGO_INITDB_ROOT_PASSWORD: your_secure_password
         MONGO_INITDB_DATABASE: securemessage_ai
       volumes:
         - mongodb_data:/data/db
         - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
       networks:
         - securemessage_network
   
     mongo-express:
       image: mongo-express:latest
       container_name: securemessage_mongo_express
       restart: always
       ports:
         - "8081:8081"
       environment:
         ME_CONFIG_MONGODB_ADMINUSERNAME: admin
         ME_CONFIG_MONGODB_ADMINPASSWORD: your_secure_password
         ME_CONFIG_MONGODB_URL: mongodb://admin:your_secure_password@mongodb:27017/
       depends_on:
         - mongodb
       networks:
         - securemessage_network
   
   volumes:
     mongodb_data:
   
   networks:
     securemessage_network:
       driver: bridge
   ```

2. **Create mongo-init.js**
   ```javascript
   // Create application user
   db = db.getSiblingDB('securemessage_ai');
   
   db.createUser({
     user: 'securemessage_user',
     pwd: 'your_app_password',
     roles: [
       {
         role: 'readWrite',
         db: 'securemessage_ai'
       }
     ]
   });
   
   // Create initial collections
   db.createCollection('users');
   db.createCollection('oauthusers');
   db.createCollection('scanhistories');
   
   console.log('Database initialized successfully!');
   ```

3. **Start Docker Services**
   ```bash
   # Start MongoDB and Mongo Express
   docker-compose up -d
   
   # View logs
   docker-compose logs -f mongodb
   
   # Stop services
   docker-compose down
   ```

4. **Environment Variables for Docker**
   ```env
   # Docker MongoDB Configuration
   MONGODB_URI=mongodb://securemessage_user:your_app_password@localhost:27017/securemessage_ai
   ```

---

## 🔧 Backend Setup and Testing

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create `.env` file in backend directory:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Application Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# OAuth Configuration (from previous setup)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:5000/auth/github/callback
```

### 3. Test Database Connection

```bash
# Test database connection
node -e "
const { connectDB, testConnection } = require('./config/database');
require('dotenv').config();

async function test() {
  try {
    await connectDB();
    const result = await testConnection();
    console.log('✅ Database connection successful!', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

test();
"
```

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

### 5. Verify API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "success",
  "message": "SecureMessage AI API is running",
  "database": {
    "status": "healthy",
    "connection": {
      "state": "Connected",
      "host": "your-host",
      "name": "securemessage_ai"
    }
  }
}
```

---

## 📊 Database Schema Overview

### Collections Created:

1. **users** - Main user accounts
   - Authentication data
   - Profile information
   - Security settings
   - Statistics and preferences

2. **oauthusers** - OAuth authentication records
   - Google/GitHub login data
   - Provider-specific information
   - Linked to main user accounts

3. **scanhistories** - Spam/phishing scan results
   - Scan content and results
   - Threat analysis data
   - User feedback and statistics

### Indexes Automatically Created:
- Email indexes for fast user lookup
- OAuth provider indexes
- Scan history indexes by user and date
- Security token indexes

---

## 🔍 Database Management Tools

### MongoDB Compass (GUI)
- **Download**: [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
- **Connection**: Use your MongoDB URI
- **Features**: Visual query builder, schema analysis, performance monitoring

### MongoDB Shell (mongosh)
```bash
# Connect to database
mongosh "your_mongodb_uri"

# Basic commands
show dbs
use securemessage_ai
show collections
db.users.find().limit(5)
db.stats()
```

### Mongo Express (Web GUI)
- **URL**: http://localhost:8081 (if using Docker setup)
- **Features**: Web-based database administration

---

## 🚨 Troubleshooting

### Common Issues:

1. **Connection Timeout**
   ```
   Error: MongoServerSelectionError
   ```
   - Check network access settings in Atlas
   - Verify IP whitelist
   - Check firewall settings

2. **Authentication Failed**
   ```
   Error: MongoServerError: Authentication failed
   ```
   - Verify username/password
   - Check database user permissions
   - Ensure correct database name in URI

3. **Local MongoDB Not Starting**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services restart mongodb-community
   
   # Linux
   sudo systemctl restart mongod
   ```

4. **Port Already in Use**
   ```bash
   # Find process using port 27017
   netstat -ano | findstr :27017
   
   # Kill process (Windows)
   taskkill /PID <process_id> /F
   ```

### Debug Mode:
```env
# Add to .env for detailed database logs
LOG_LEVEL=debug
```

---

## 🔐 Security Best Practices

### Production Security:
1. **Strong Passwords**: Use complex passwords for database users
2. **Network Security**: Restrict IP access to specific addresses
3. **SSL/TLS**: Enable encryption in transit
4. **Regular Backups**: Set up automated backups
5. **Monitoring**: Enable database monitoring and alerts

### Atlas Security Features:
- Built-in encryption at rest
- Network isolation with VPC peering
- Database auditing
- LDAP integration
- Field-level encryption

---

## 📈 Performance Optimization

### Indexes:
```javascript
// Create additional indexes if needed
db.users.createIndex({ "email": 1 })
db.users.createIndex({ "stats.lastScanDate": -1 })
db.scanhistories.createIndex({ "userId": 1, "createdAt": -1 })
```

### Connection Pooling:
```javascript
// Already configured in database.js
const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};
```

---

## 🎯 Next Steps

1. **✅ Choose your MongoDB option** (Atlas recommended)
2. **✅ Configure connection string** in .env file
3. **✅ Test database connection** with provided script
4. **✅ Start the backend server** with `npm run dev`
5. **✅ Verify API health endpoint** returns database status
6. **✅ Test OAuth login** with Google/GitHub
7. **✅ Monitor database** with Compass or Atlas dashboard

---

## 📞 Support Resources

- **MongoDB Documentation**: [https://docs.mongodb.com/](https://docs.mongodb.com/)
- **Atlas Support**: [https://support.mongodb.com/](https://support.mongodb.com/)
- **Community Forums**: [https://community.mongodb.com/](https://community.mongodb.com/)
- **Node.js Driver Docs**: [https://mongodb.github.io/node-mongodb-native/](https://mongodb.github.io/node-mongodb-native/)

---

**Your SecureMessage AI application is now ready for production-grade database integration with MongoDB!** 🚀

The database will automatically store user accounts, OAuth logins, scan histories, and all application data with proper indexing and security measures.
