# PageTurn Deployment Guide

This guide provides comprehensive instructions for deploying the PageTurn Educational Bookstore Platform to production environments.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm 6+
- MySQL 8.0+ database server
- Git for version control

### Local Development Setup

1. **Clone Repository**
   ```bash
   git clone <your-repository-url>
   cd online-bookstore
   ```

2. **Install Dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment templates
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

4. **Configure Environment Variables**
   
   **Frontend (`.env`):**
   ```env
   PORT=3001
   REACT_APP_API_URL=http://localhost:3002
   REACT_APP_APP_NAME=PageTurn
   ```
   
   **Backend (`backend/.env`):**
   ```env
   PORT=3002
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=online_bookstore
   DB_PORT=3306
   
   # JWT Configuration
   JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters
   JWT_EXPIRES_IN=7d
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3001
   ```

5. **Database Setup**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE online_bookstore;"
   
   # Start backend (will initialize database)
   cd backend
   npm start
   ```

6. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm start
   
   # Terminal 2: Frontend
   npm start
   ```

## 🌐 Production Deployment

### Option 1: Traditional Server Deployment

#### 1. Server Requirements
- Ubuntu 20.04+ or CentOS 8+
- Node.js 14+ and npm 6+
- MySQL 8.0+
- Nginx (recommended)
- SSL certificate

#### 2. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2
```

#### 3. Application Deployment
```bash
# Clone repository
git clone <your-repository-url>
cd online-bookstore

# Install dependencies
npm install
cd backend && npm install && cd ..

# Build frontend
npm run build

# Configure environment
cp .env.example .env
cp backend/.env.example backend/.env
# Edit environment files with production values

# Setup database
mysql -u root -p -e "CREATE DATABASE online_bookstore;"

# Start backend with PM2
cd backend
pm2 start server.js --name "pageturn-backend"

# Configure Nginx
sudo nano /etc/nginx/sites-available/pageturn
```

#### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/online-bookstore/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3002;
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

### Option 2: Docker Deployment

#### 1. Create Dockerfile (Frontend)
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Create Dockerfile (Backend)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3002
CMD ["npm", "start"]
```

#### 3. Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - DB_HOST=database
      - DB_USER=root
      - DB_PASSWORD=secure_password
      - DB_NAME=online_bookstore
    depends_on:
      - database

  database:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=secure_password
      - MYSQL_DATABASE=online_bookstore
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

### Option 3: Cloud Platform Deployment

#### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Railway/Heroku (Backend)
```bash
# Add to package.json
"scripts": {
  "start": "node server.js",
  "build": "npm install"
}

# Deploy to Railway
railway login
railway init
railway up
```

## 🔧 Environment Configuration

### Production Environment Variables

#### Frontend
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_APP_NAME=PageTurn
```

#### Backend
```env
NODE_ENV=production
PORT=3002

# Database
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=online_bookstore

# Security
JWT_SECRET=your-production-jwt-secret-minimum-32-characters
BCRYPT_SALT_ROUNDS=12

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🔒 Security Checklist

### Backend Security
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Validate all inputs
- [ ] Use prepared statements for database queries
- [ ] Keep dependencies updated

### Database Security
- [ ] Use strong database passwords
- [ ] Restrict database access to application only
- [ ] Enable SSL for database connections
- [ ] Regular database backups
- [ ] Monitor database access logs

### Frontend Security
- [ ] Build and serve static files
- [ ] Configure CSP headers
- [ ] Use HTTPS
- [ ] Validate user inputs
- [ ] Sanitize displayed data

## 📊 Performance Optimization

### Frontend
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Use CDN for static assets
- [ ] Implement lazy loading
- [ ] Minimize bundle size

### Backend
- [ ] Use connection pooling
- [ ] Implement caching
- [ ] Optimize database queries
- [ ] Use compression middleware
- [ ] Monitor performance metrics

## 🔍 Monitoring & Maintenance

### Health Checks
```bash
# Backend health check
curl http://localhost:3002/api/health

# Frontend check
curl http://localhost:3001
```

### Log Management
```bash
# PM2 logs
pm2 logs pageturn-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Maintenance
```sql
-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'online_bookstore';

-- Optimize tables
OPTIMIZE TABLE books, categories, users, newsletter_subscriptions;
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service status
   - Verify credentials in .env
   - Ensure database exists

2. **CORS Errors**
   - Check CORS_ORIGIN in backend .env
   - Verify frontend URL matches

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies are installed

4. **Performance Issues**
   - Check database query performance
   - Monitor server resources
   - Optimize images and assets

### Support Commands
```bash
# Check application status
pm2 status

# Restart application
pm2 restart pageturn-backend

# View logs
pm2 logs pageturn-backend --lines 100

# Monitor resources
pm2 monit
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database schema updated
- [ ] Security review completed
- [ ] Performance testing done

### Deployment
- [ ] Backup current production
- [ ] Deploy new version
- [ ] Run database migrations
- [ ] Verify all services running
- [ ] Test critical functionality

### Post-deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify user functionality
- [ ] Update documentation
- [ ] Notify stakeholders

## 🎯 Success Metrics

- **Uptime**: 99.9%+
- **Response Time**: < 2 seconds
- **Error Rate**: < 0.1%
- **Database Performance**: < 500ms queries
- **User Satisfaction**: Positive feedback

This deployment guide ensures a smooth, secure, and scalable deployment of the PageTurn Educational Bookstore Platform.
