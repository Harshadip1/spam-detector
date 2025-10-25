# SecureMessage AI - Cyber Security Website with MongoDB Atlas

A modern, responsive cyber security website with AI-powered spam detection capabilities. Built with **HTML, CSS, JavaScript frontend** and **Node.js/Express backend** with **MongoDB Atlas** database integration.

## 🚀 Features

### Core Functionality
- **AI Spam Detector**: Advanced keyword-based spam detection with real-time analysis
- **User Authentication**: Complete login/signup system with MongoDB Atlas backend
- **User Profile Dashboard**: Comprehensive profile management with statistics and preferences
- **Contact System**: Professional contact form with validation and FAQ section
- **Download Center**: Multi-platform app download pages with installation guides

### Backend Integration
- **MongoDB Atlas**: Cloud database for user data and authentication
- **JWT Authentication**: Secure token-based authentication system
- **RESTful API**: Complete API for user management and data operations
- **Rate Limiting**: Protection against abuse and spam requests
- **CORS Configuration**: Secure frontend-backend communication

### Design & UX
- **Dark Theme**: Professional cybersecurity-themed design with neon accents
- **Responsive Design**: Fully mobile-friendly and adaptive layouts
- **Advanced Animations**: 3D card effects, gradient overlays, and smooth transitions
- **Interactive Elements**: Hover effects, loading states, and micro-interactions
- **Accessibility**: Reduced motion support and high contrast mode compatibility

## 📁 Updated Project Structure

```
SecureMessage-AI/
├── index.html              # Homepage with spam detector
├── login.html              # Authentication page (updated for MongoDB)
├── profile.html            # User dashboard
├── dashboard.html          # User analytics dashboard
├── about.html              # Company information
├── contact.html            # Contact form and FAQ
├── download.html           # App download center
├── premium.html            # Premium features and pricing
├── payment.html            # Payment system (Indian Rupee support)
├── payment-success.html    # Payment confirmation
├── css/
│   └── styles.css          # Complete styling with animations
├── js/
│   ├── main.js             # Core functionality and utilities
│   ├── spam-detector.js    # Spam detection engine
│   ├── auth.js             # Authentication system
│   ├── profile.js          # Profile management
│   ├── contact.js          # Contact form handling
│   ├── download.js         # Download page interactions
│   ├── apiService.js       # MongoDB API integration
│   ├── authManager.js      # Authentication state management
│   └── userInterface.js    # UI state management
├── models/
│   └── User.js             # MongoDB User schema
├── routes/
│   ├── auth.js             # Authentication API routes
│   └── users.js            # User management routes
├── server.js               # Express server with MongoDB
├── package.json            # Node.js dependencies
├── .env                    # Environment variables
└── README.md               # Project documentation
```

## 🛠️ Backend Setup

### Prerequisites
- **Node.js** 16+ and **npm**
- **MongoDB Atlas** account and cluster

### MongoDB Atlas Configuration
1. **Connection String**:
   ```
   mongodb+srv://Maithili:nikhil123@securemessage.jv96mmu.mongodb.net/SecureMessageDB?appName=SecureMessage
   ```

2. **Environment Variables** (`.env`):
   ```env
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://Maithili:nikhil123@securemessage.jv96mmu.mongodb.net/SecureMessageDB?appName=SecureMessage

   # JWT Secret Key
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # CORS Configuration
   FRONTEND_URL=http://localhost:8000
   ```

### Installation & Setup
1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Backend Server**:
   ```bash
   npm start
   ```

3. **Verify MongoDB Connection**:
   ```bash
   node test-connection.js
   ```

4. **Start Frontend Server**:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js
   npx http-server
   ```

## 🌐 API Endpoints

### Authentication API
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login with JWT
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/check-status` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### User Management API
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/leaderboard` - Get leaderboard

### System API
- `GET /api/health` - Server health check

## 📊 Database Schema

### User Collection (MongoDB Atlas)
```javascript
{
  name: String,              // User's full name
  email: String,             // Unique email address
  password: String,          // Hashed password (bcrypt)
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    bio: String,
    avatar: String
  },
  stats: {
    totalScans: Number,      // Total messages scanned
    spamDetected: Number,    // Spam messages detected
    safeMessages: Number,    // Safe messages count
    suspiciousMessages: Number,
    securityScore: Number    // 0-100 security score
  },
  preferences: {
    theme: String,           // 'dark', 'light', 'auto'
    notifications: {
      email: Boolean,
      browser: Boolean
    }
  },
  activity: Array,           // Activity log (last 100 items)
  loginAttempts: {
    count: Number,
    lastAttempt: Date,
    lockedUntil: Date
  }
}
```

## 🔐 Authentication System

### JWT Token Flow
1. **Registration**: User data stored in MongoDB with hashed password
2. **Login**: Credentials validated, JWT token generated and returned
3. **Session Management**: Token stored in localStorage for frontend
4. **API Access**: Token sent with each API request for authentication
5. **Logout**: Token removed, session terminated

### Security Features
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: 7-day expiration with secure secrets
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Account Lockout**: 5 failed attempts trigger 15-minute lock
- **CORS Protection**: Configured for secure frontend communication

## 🎯 Usage Guide

### Starting the Application
1. **Backend Server**: `npm start` (runs on port 5000)
2. **Frontend Server**: `python -m http.server 8000` (runs on port 8000)
3. **Access Application**: `http://localhost:8000`

### User Registration & Login
1. Navigate to the login page
2. **Sign Up**: Create account with email/password (stored in MongoDB Atlas)
3. **Sign In**: Login with existing credentials (JWT token generated)
4. **Profile Access**: Secure dashboard with user data from database

### API Testing
```bash
# Health Check
curl http://localhost:5000/api/health

# User Registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "SecurePass123"}'

# User Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "SecurePass123"}'
```

## 🔧 Development

### Adding New Features
1. **Backend**: Add routes in `/routes/` directory
2. **Frontend**: Add API calls in `apiService.js`
3. **Database**: Update User model in `/models/User.js`
4. **UI**: Update HTML/CSS as needed

### Environment Variables
- **Development**: Use `.env` file with MongoDB Atlas connection
- **Production**: Set environment variables in deployment platform

## 🌟 Production Features

- ✅ **MongoDB Atlas**: Scalable cloud database
- ✅ **JWT Authentication**: Secure token-based sessions
- ✅ **RESTful API**: Complete backend API
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Security**: Rate limiting, CORS, input validation
- ✅ **Performance**: Optimized database queries
- ✅ **Scalability**: Cloud-ready architecture

## 🔄 Migration Summary

**From:** PHP + MySQL (local)
**To:** Node.js + Express + MongoDB Atlas (cloud)

### What Changed:
- ✅ Removed all PHP files and MySQL dependencies
- ✅ Added Node.js/Express backend with MongoDB Atlas
- ✅ Implemented JWT-based authentication system
- ✅ Updated frontend to use RESTful API endpoints
- ✅ Enhanced security with modern authentication practices
- ✅ Maintained all existing UI/UX functionality

### Benefits:
- **Scalability**: MongoDB Atlas handles global traffic
- **Security**: JWT tokens with proper validation
- **Performance**: Optimized database operations
- **Reliability**: Cloud database with automatic backups
- **Development**: Modern development stack and tools

## 📱 Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

For production deployment:
1. **Secure JWT Secret**: Change the JWT_SECRET in production
2. **Database Security**: Use strong MongoDB Atlas credentials
3. **HTTPS**: Enable SSL/TLS in production
4. **Environment Variables**: Never commit .env files
5. **Testing**: Add comprehensive API testing

## 📄 License

This project demonstrates modern web development with MongoDB Atlas integration. Perfect for learning full-stack development with cloud databases.

## 🎉 Demo Features

1. **MongoDB Integration**: Real database operations with Atlas
2. **JWT Authentication**: Secure login system with tokens
3. **API Testing**: Test all endpoints with curl or Postman
4. **User Management**: Complete CRUD operations
5. **Responsive Design**: Works on all device sizes

---

**SecureMessage AI** - Advanced AI-powered spam detection with MongoDB Atlas backend.

Built with ❤️ using modern web technologies and cloud databases.
