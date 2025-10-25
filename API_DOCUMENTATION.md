# SecureMessage AI - Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... },
  "errors": [ ... ] // Only present if validation fails
}
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profile": { ... },
      "stats": { ... },
      "preferences": { ... }
    }
  }
}
```

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": { ... }
  }
}
```

### POST /auth/logout
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /auth/me
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890",
        "bio": "User bio",
        "avatar": "avatar_url"
      },
      "stats": {
        "totalScans": 150,
        "spamDetected": 45,
        "safeMessages": 100,
        "suspiciousMessages": 5,
        "securityScore": 85
      },
      "preferences": {
        "theme": "dark",
        "notifications": {
          "email": true,
          "browser": true
        }
      },
      "joinDate": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-15T10:30:00.000Z",
      "initials": "JD"
    }
  }
}
```

### POST /auth/check-status
Check if a token is valid (public endpoint).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "authenticated": true,
  "user": { ... }
}
```

### PUT /auth/update-profile
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "profile": {
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "bio": "Updated bio"
  },
  "preferences": {
    "theme": "light",
    "notifications": {
      "email": false,
      "browser": true
    }
  }
}
```

## Spam Detection Endpoints

### POST /spam/analyze
Analyze message content for spam detection.

**Request Body:**
```json
{
  "content": "Congratulations! You've won $1,000,000! Click here to claim your prize now!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "isSpam": true,
      "confidence": 85,
      "riskLevel": "high",
      "detectedPatterns": ["congratulations", "won", "click here", "prize"],
      "riskFactors": ["Phishing pattern detected", "Money amounts mentioned"],
      "recommendations": [
        "Do not click any links or download attachments",
        "Do not provide personal or financial information",
        "Report this message as spam",
        "Delete the message immediately"
      ]
    },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "messageLength": 89
  }
}
```

### GET /spam/stats
Get global spam detection statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalScans": 50000,
    "totalSpamDetected": 15000,
    "totalSafeMessages": 30000,
    "totalSuspiciousMessages": 5000,
    "totalUsers": 1000,
    "avgSecurityScore": 78.5,
    "detectionRate": 40,
    "accuracy": 99.9,
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

## User Management Endpoints

### GET /users/stats
Get user statistics (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "activeUsers": 950,
    "verifiedUsers": 800,
    "avgSecurityScore": 78.5
  }
}
```

### GET /users/leaderboard
Get top users by security score.

**Query Parameters:**
- `limit` (optional): Number of users to return (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "name": "John Doe",
      "initials": "JD",
      "score": 95,
      "totalScans": 500
    },
    {
      "rank": 2,
      "name": "Jane Smith",
      "initials": "JS",
      "score": 92,
      "totalScans": 450
    }
  ]
}
```

## Health Check

### GET /health
Check server and database status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "Connected"
}
```

## Error Codes

- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **423 Locked**: Account is temporarily locked due to failed login attempts
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 12 rounds
2. **JWT Tokens**: Secure JWT tokens with 7-day expiration
3. **Account Locking**: Accounts are locked for 15 minutes after 5 failed login attempts
4. **Input Validation**: All inputs are validated and sanitized
5. **CORS Protection**: Cross-origin requests are properly configured
6. **Rate Limiting**: API rate limiting to prevent abuse
7. **Helmet Security**: Security headers via Helmet middleware

## Environment Variables

Required environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8000
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file

3. Start the server:
   ```bash
   npm start
   ```
   
   Or for development:
   ```bash
   npm run dev
   ```

4. Server will be available at `http://localhost:5000`

## Testing

Test the connection:
```bash
node test-connection.js
```

Verify setup:
```bash
node verify-setup.js
```
