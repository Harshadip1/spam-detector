# OAuth Setup Guide - Google & GitHub Login

This guide will help you set up Google and GitHub OAuth authentication for SecureMessage AI.

## 🚀 Quick Start (Demo Mode)

The application is currently configured to work in **demo mode** with simulated OAuth responses. You can test the login functionality immediately:

1. Go to the login page
2. Click "Google" or "GitHub" buttons
3. The system will simulate a successful login with mock user data
4. You'll be redirected to the dashboard

## 🔧 Production Setup

For production deployment, follow these steps to configure real OAuth providers:

### Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API

2. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in application details:
     - App name: SecureMessage AI
     - User support email: your-email@domain.com
     - Developer contact: your-email@domain.com

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Set authorized redirect URIs:
     - `http://localhost:5000/auth/google/callback` (development)
     - `https://yourdomain.com/auth/google/callback` (production)

4. **Update Environment Variables**
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-actual-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback
   ```

### GitHub OAuth Setup

1. **Create GitHub OAuth App**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"
   - Fill in application details:
     - Application name: SecureMessage AI
     - Homepage URL: `http://localhost:3000` (or your domain)
     - Authorization callback URL: `http://localhost:5000/auth/github/callback`

2. **Get Client Credentials**
   - After creating the app, note the Client ID
   - Generate a new client secret

3. **Update Environment Variables**
   ```env
   GITHUB_CLIENT_ID=your-actual-github-client-id
   GITHUB_CLIENT_SECRET=your-actual-github-client-secret
   GITHUB_REDIRECT_URI=http://localhost:5000/auth/github/callback
   ```

## 📁 File Structure

```
backend/
├── config/
│   └── oauth.js              # OAuth configuration
├── routes/
│   └── oauth.js              # OAuth route handlers
├── .env.example              # Environment variables template
└── package.json              # Dependencies (includes axios)

frontend/
└── js/
    └── socialAuth.js         # Frontend OAuth handler
```

## 🔄 How It Works

### Frontend Flow
1. User clicks Google/GitHub button
2. `socialAuth.js` handles the click
3. Shows loading state
4. In demo mode: simulates OAuth response
5. In production: redirects to OAuth provider
6. Completes authentication with `authManager.js`

### Backend Flow (Production)
1. `/auth/google` or `/auth/github` - Redirects to OAuth provider
2. OAuth provider redirects back with authorization code
3. `/auth/google/callback` or `/auth/github/callback` - Exchanges code for tokens
4. Fetches user profile from OAuth provider
5. Creates JWT token and returns user data

## 🛠️ Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your OAuth credentials
   ```

3. **Start Backend Server**
   ```bash
   npm run dev
   ```

## 🔐 Security Features

- **JWT Token Generation**: Secure token creation with configurable expiration
- **State Parameter**: CSRF protection for OAuth flows
- **Scope Limitation**: Minimal required permissions
- **Token Verification**: Middleware for protected routes
- **Error Handling**: Comprehensive error handling and user feedback

## 🧪 Testing

### Demo Mode Testing
- No setup required
- Simulated user data
- Full authentication flow
- Perfect for development

### Production Testing
1. Set up OAuth apps (Google/GitHub)
2. Configure environment variables
3. Test with real OAuth providers
4. Verify user data retrieval

## 📱 Mobile Support

The OAuth implementation supports:
- Mobile web browsers
- Responsive design
- Touch-optimized buttons
- Mobile-specific OAuth flows

## 🔍 Troubleshooting

### Common Issues

1. **"OAuth app not found"**
   - Check client ID in environment variables
   - Verify OAuth app is properly configured

2. **"Redirect URI mismatch"**
   - Ensure redirect URIs match exactly in OAuth app settings
   - Check for trailing slashes and protocol (http/https)

3. **"Invalid client secret"**
   - Regenerate client secret
   - Update environment variables

4. **CORS Issues**
   - Configure CORS in backend for your domain
   - Check allowed origins

### Debug Mode
Enable debug logging by setting:
```env
LOG_LEVEL=debug
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
GOOGLE_CLIENT_ID=prod-google-client-id
GOOGLE_CLIENT_SECRET=prod-google-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
GITHUB_CLIENT_ID=prod-github-client-id
GITHUB_CLIENT_SECRET=prod-github-secret
GITHUB_REDIRECT_URI=https://yourdomain.com/auth/github/callback
JWT_SECRET=your-super-secure-jwt-secret
```

### Frontend Configuration
Update `socialAuth.js` for production:
- Set production OAuth client IDs
- Update redirect URIs
- Configure production API endpoints

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review OAuth provider documentation
3. Check browser console for errors
4. Verify environment variable configuration

---

**Note**: The current implementation includes both demo mode (for immediate testing) and production-ready OAuth integration. Switch between modes by configuring the appropriate environment variables.
