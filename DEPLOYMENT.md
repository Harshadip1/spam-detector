# Deployment Guide - SecureMessage AI

## 🚀 Quick Start for Contributors

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/SecureMessage-AI.git
cd SecureMessage-AI
```

### 2. Setup Environment
```bash
# Install dependencies
npm run setup

# Copy environment template
cp .env.example .env
```

### 3. Configure MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create database user with read/write permissions
4. Get connection string from Atlas dashboard
5. Update `.env` file with your credentials:
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/SecureMessageDB
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

### 4. Start Development
```bash
# Start backend server
npm run dev

# In another terminal, start frontend
python -m http.server 8000
# OR
npx http-server -p 8000
```

### 5. Access Application
- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🌐 Production Deployment

### Heroku Deployment
1. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_connection_string"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set NODE_ENV="production"
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

### Netlify/Vercel (Frontend Only)
For frontend-only deployment, you'll need to update API URLs to point to your backend server.

### Railway Deployment
1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

## 🔧 Environment Variables

### Required Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
PORT=5000
NODE_ENV=production
```

### Optional Variables
```env
FRONTEND_URL=https://your-frontend-domain.com
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔐 Security Checklist

### Before Going Live
- [ ] Change default JWT_SECRET to a secure random string
- [ ] Use strong MongoDB Atlas credentials
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and logging
- [ ] Test all API endpoints
- [ ] Verify rate limiting is working

### Generate Secure JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📊 Testing

### API Testing
```bash
# Health check
curl https://your-app.herokuapp.com/api/health

# Test registration
curl -X POST https://your-app.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'

# Test login
curl -X POST https://your-app.herokuapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Frontend Testing
1. Visit your deployed frontend URL
2. Test user registration and login
3. Verify spam detection functionality
4. Check responsive design on mobile devices

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
- Verify connection string format
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

#### CORS Errors
- Update FRONTEND_URL in environment variables
- Check CORS configuration in server.js

#### JWT Token Issues
- Verify JWT_SECRET is set correctly
- Check token expiration settings
- Ensure consistent secret across deployments

#### Port Issues
- Use PORT environment variable for deployment platforms
- Default port 5000 for local development

## 📱 Mobile Deployment

### Progressive Web App (PWA)
The frontend is PWA-ready. To enable:
1. Add service worker registration
2. Configure manifest.json
3. Test offline functionality

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Heroku
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 📈 Monitoring

### Recommended Tools
- **Uptime**: UptimeRobot or Pingdom
- **Performance**: New Relic or DataDog
- **Errors**: Sentry for error tracking
- **Analytics**: Google Analytics for frontend

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Need Help?** Open an issue on GitHub or check the main README.md for more information.
