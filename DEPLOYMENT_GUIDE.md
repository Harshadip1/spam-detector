# SecureMessage AI - Backend Deployment Guide

This guide covers deploying the SecureMessage AI backend to various environments including local development, staging, and production.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (or local MongoDB)
- Git (optional)

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Create `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/SecureMessageDB
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8000
   ```

3. **Verify Setup**
   ```bash
   npm run verify-setup
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

Server will be available at `http://localhost:5000`

## 🔧 Environment Configuration

### Development Environment
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://dev-user:password@dev-cluster.mongodb.net/SecureMessageDB-dev
JWT_SECRET=dev_jwt_secret_key
FRONTEND_URL=http://localhost:8000
BCRYPT_ROUNDS=10
JWT_EXPIRES_IN=24h
```

### Staging Environment
```env
NODE_ENV=staging
PORT=5000
MONGODB_URI=mongodb+srv://staging-user:password@staging-cluster.mongodb.net/SecureMessageDB-staging
JWT_SECRET=staging_jwt_secret_key_different_from_dev
FRONTEND_URL=https://staging.securemessage.ai
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
```

### Production Environment
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod-user:strong-password@prod-cluster.mongodb.net/SecureMessageDB
JWT_SECRET=super_strong_production_jwt_secret_key_64_chars_minimum
FRONTEND_URL=https://securemessage.ai
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🌐 Production Deployment Options

### Option 1: Traditional VPS/Server

#### Server Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Node.js**: Version 16+

#### Deployment Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 (Process Manager)
   sudo npm install -g pm2
   
   # Install Nginx (Reverse Proxy)
   sudo apt install nginx -y
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd securemessage-ai-backend
   
   # Install dependencies
   npm ci --production
   
   # Create production environment file
   sudo nano .env
   # Add production environment variables
   
   # Start with PM2
   pm2 start server.js --name "securemessage-api"
   pm2 startup
   pm2 save
   ```

3. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/securemessage-api
   server {
       listen 80;
       server_name api.securemessage.ai;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL Certificate (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d api.securemessage.ai
   ```

### Option 2: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    restart: unless-stopped
    depends_on:
      - mongodb
    networks:
      - app-network

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

### Option 3: Cloud Platform Deployment

#### Heroku Deployment

1. **Prepare for Heroku**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create securemessage-api
   ```

2. **Configure Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="mongodb+srv://..."
   heroku config:set JWT_SECRET="your-production-secret"
   heroku config:set FRONTEND_URL="https://securemessage.ai"
   ```

3. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### AWS EC2 Deployment

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - t3.medium or larger
   - Configure security groups (ports 22, 80, 443)

2. **Setup Script**
   ```bash
   #!/bin/bash
   # AWS EC2 setup script
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone and setup application
   git clone <your-repo>
   cd securemessage-ai-backend
   npm ci --production
   
   # Setup environment
   echo "MONGODB_URI=..." > .env
   echo "JWT_SECRET=..." >> .env
   echo "NODE_ENV=production" >> .env
   
   # Start application
   pm2 start server.js --name api
   pm2 startup
   pm2 save
   ```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] **Environment Variables**: All secrets in environment variables, not code
- [ ] **JWT Secret**: Strong, unique secret (64+ characters)
- [ ] **Database Security**: Restricted IP access, strong passwords
- [ ] **HTTPS**: SSL/TLS certificates installed and configured
- [ ] **Rate Limiting**: Appropriate limits for production traffic
- [ ] **CORS**: Restricted to actual frontend domains
- [ ] **Firewall**: Only necessary ports open (80, 443, 22)
- [ ] **Updates**: Regular security updates for OS and dependencies
- [ ] **Monitoring**: Error tracking and performance monitoring
- [ ] **Backups**: Regular database backups configured

### Security Headers
```javascript
// Additional security headers for production
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**
   ```bash
   # Monitor processes
   pm2 monit
   
   # View logs
   pm2 logs
   
   # Restart application
   pm2 restart api
   ```

2. **Health Checks**
   Create `healthcheck.js`:
   ```javascript
   const http = require('http');
   
   const options = {
     host: 'localhost',
     port: 5000,
     path: '/api/health',
     timeout: 2000
   };
   
   const request = http.request(options, (res) => {
     if (res.statusCode === 200) {
       process.exit(0);
     } else {
       process.exit(1);
     }
   });
   
   request.on('error', () => {
     process.exit(1);
   });
   
   request.end();
   ```

3. **Log Management**
   ```bash
   # Setup log rotation
   sudo nano /etc/logrotate.d/securemessage-api
   ```
   
   ```
   /var/log/securemessage-api/*.log {
     daily
     missingok
     rotate 52
     compress
     delaycompress
     notifempty
     create 644 nodejs nodejs
   }
   ```

### Database Monitoring

1. **MongoDB Atlas Monitoring**
   - Enable MongoDB Atlas monitoring
   - Set up alerts for high CPU, memory usage
   - Monitor connection counts and query performance

2. **Backup Strategy**
   ```bash
   # Automated backup script
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   mongodump --uri="$MONGODB_URI" --out="/backups/backup_$DATE"
   
   # Keep only last 7 days of backups
   find /backups -type d -mtime +7 -exec rm -rf {} \;
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 5000
   sudo lsof -i :5000
   
   # Kill process
   sudo kill -9 <PID>
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Test connection
   npm run test-connection
   
   # Check MongoDB Atlas IP whitelist
   # Verify connection string format
   ```

3. **PM2 Issues**
   ```bash
   # Restart PM2
   pm2 kill
   pm2 resurrect
   
   # Check PM2 logs
   pm2 logs --lines 100
   ```

4. **Memory Issues**
   ```bash
   # Check memory usage
   free -h
   
   # Monitor Node.js memory
   pm2 monit
   ```

### Performance Optimization

1. **Node.js Optimization**
   ```bash
   # Set NODE_OPTIONS for production
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

2. **Database Optimization**
   - Add proper indexes
   - Use connection pooling
   - Monitor slow queries

3. **Caching Strategy**
   - Implement Redis for session storage
   - Cache frequently accessed data
   - Use CDN for static assets

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Code reviewed and tested
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Security audit passed
- [ ] Performance testing completed
- [ ] Backup strategy in place

### Deployment
- [ ] Application deployed successfully
- [ ] Health checks passing
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Logs accessible
- [ ] Error tracking active

### Post-Deployment
- [ ] Smoke tests passed
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] User acceptance testing completed
- [ ] Documentation updated
- [ ] Team notified of deployment

## 🆘 Emergency Procedures

### Rollback Process
```bash
# Quick rollback with PM2
pm2 stop api
git checkout <previous-commit>
npm ci --production
pm2 start api
```

### Emergency Contacts
- **DevOps Team**: devops@securemessage.ai
- **Database Admin**: dba@securemessage.ai
- **Security Team**: security@securemessage.ai

---

This deployment guide ensures a secure, scalable, and maintainable deployment of the SecureMessage AI backend across various environments.
