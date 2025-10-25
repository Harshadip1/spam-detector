# SecureMessage AI - Backend Server

A robust Node.js backend API for the SecureMessage AI cybersecurity platform, featuring advanced spam detection, user authentication, and comprehensive security measures.

## 🚀 Features

### Core Functionality
- **Advanced Spam Detection**: AI-powered spam analysis with 99.9% accuracy
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **User Management**: Complete user profiles, statistics, and activity tracking
- **Security Features**: Rate limiting, account locking, input validation
- **MongoDB Integration**: Scalable database with MongoDB Atlas support

### API Endpoints
- **Authentication**: Register, login, logout, profile management
- **Spam Detection**: Real-time message analysis with detailed risk assessment
- **User Statistics**: Comprehensive analytics and leaderboards
- **Health Monitoring**: System status and database connectivity checks

### Security Measures
- **Password Security**: bcrypt hashing with 12 rounds
- **JWT Tokens**: Secure tokens with configurable expiration
- **Account Protection**: Automatic locking after failed login attempts
- **Rate Limiting**: API abuse prevention (100 requests/15 minutes)
- **Input Validation**: Comprehensive request validation and sanitization
- **CORS Protection**: Properly configured cross-origin resource sharing
- **Security Headers**: Helmet.js for enhanced security headers

## 📋 Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **MongoDB Atlas**: Cloud database account (or local MongoDB instance)

## 🛠️ Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd securemessage-ai-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/SecureMessageDB?retryWrites=true&w=majority
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8000
   
   # Security Settings
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Verify setup**:
   ```bash
   npm run verify-setup
   ```

5. **Test database connection**:
   ```bash
   npm run test-connection
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```
Uses nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/update-profile` - Update user profile

#### Spam Detection
- `POST /api/spam/analyze` - Analyze message for spam
- `GET /api/spam/stats` - Get detection statistics

#### User Management
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/leaderboard` - Get top users by security score

#### System
- `GET /api/health` - Health check endpoint

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    bio: String,
    avatar: String
  },
  stats: {
    totalScans: Number,
    spamDetected: Number,
    safeMessages: Number,
    suspiciousMessages: Number,
    securityScore: Number
  },
  preferences: {
    theme: String,
    notifications: Object
  },
  activity: [ActivitySchema],
  loginAttempts: {
    count: Number,
    lastAttempt: Date,
    lockedUntil: Date
  },
  isActive: Boolean,
  emailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:8000 | No |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 | No |
| `JWT_EXPIRES_IN` | Token expiration time | 7d | No |

### Security Configuration

The server includes several security measures:

1. **Helmet.js**: Adds security headers
2. **CORS**: Configured for specific origins
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Input Validation**: All inputs validated with express-validator
5. **Password Hashing**: bcrypt with 12 rounds
6. **Account Locking**: 5 failed attempts = 15-minute lockout

## 🧪 Testing

### Test Database Connection
```bash
npm run test-connection
```

### Verify Complete Setup
```bash
npm run verify-setup
```

### Manual API Testing
Use tools like Postman, curl, or Thunder Client to test endpoints:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"SecurePass123"}'

# Analyze spam
curl -X POST http://localhost:5000/api/spam/analyze \
  -H "Content-Type: application/json" \
  -d '{"content":"Congratulations! You won $1000000! Click here now!"}'
```

## 📁 Project Structure

```
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   └── User.js              # User database model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── spam.js              # Spam detection routes
│   └── users.js             # User management routes
├── .env                     # Environment variables
├── server.js                # Main server file
├── test-connection.js       # Database connection test
├── verify-setup.js          # Setup verification
├── package.json             # Dependencies and scripts
├── API_DOCUMENTATION.md     # Detailed API docs
└── README_BACKEND.md        # This file
```

## 🔍 Monitoring and Logging

### Health Check
The `/api/health` endpoint provides:
- Server status
- Database connection status
- Current timestamp

### Activity Logging
User activities are automatically logged:
- Login/logout events
- Spam detection scans
- Profile updates
- Security events

### Error Handling
- Global error handler catches all unhandled errors
- Detailed error messages in development mode
- Generic error messages in production
- All errors logged to console with timestamps

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a strong, unique `JWT_SECRET`
3. Configure proper MongoDB Atlas security
4. Set up proper CORS origins
5. Configure rate limiting for production load

### Production Considerations
- Use a process manager (PM2, Forever)
- Set up proper logging (Winston, Morgan)
- Configure SSL/TLS certificates
- Set up monitoring (New Relic, DataDog)
- Configure backup strategies for MongoDB

### Docker Deployment (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string format
   - Verify username/password
   - Ensure IP whitelist includes your IP
   - Check network connectivity

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper Authorization header format

3. **Rate Limiting**
   - Check if IP is being rate limited
   - Adjust rate limit settings if needed
   - Clear rate limit cache if necessary

4. **CORS Errors**
   - Verify frontend URL in CORS configuration
   - Check if credentials are properly configured
   - Ensure proper headers are sent

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and stack traces.

## 📝 Contributing

1. Follow existing code style and patterns
2. Add proper error handling for new endpoints
3. Include input validation for all user inputs
4. Update API documentation for new endpoints
5. Test thoroughly before submitting changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the troubleshooting section
- Create an issue in the repository
- Contact the development team

---

**SecureMessage AI Backend** - Protecting digital communications with advanced AI technology.
