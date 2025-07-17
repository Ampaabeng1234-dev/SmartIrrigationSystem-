# Deployment Guide

This guide covers different deployment options for the Smart Irrigation Management System.

## Local Development

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Git (optional, for cloning)

### Setup Steps

1. **Extract and Install**
   ```bash
   # Extract the zip file
   unzip smart-irrigation-system.zip
   cd smart-irrigation-system
   
   # Install dependencies
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb irrigation_system
   
   # Or using psql
   psql -c "CREATE DATABASE irrigation_system;"
   ```

3. **Environment Configuration**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit with your database credentials
   nano .env  # or your preferred editor
   ```

4. **Initialize Database**
   ```bash
   # Push database schema
   npm run db:push
   ```

5. **Start Application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## Cloud Deployment

### Railway

1. **Prepare for Railway**
   ```bash
   # Add railway.json (already included)
   # Ensure package.json has correct scripts
   ```

2. **Deploy**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway deploy
   ```

3. **Environment Variables**
   Set in Railway dashboard:
   - `DATABASE_URL` (use Railway PostgreSQL)
   - `SESSION_SECRET`
   - `NODE_ENV=production`

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure vercel.json** (already included)

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Database**
   - Use Neon, PlanetScale, or Railway PostgreSQL
   - Set `DATABASE_URL` in Vercel environment variables

### Heroku

1. **Create Heroku App**
   ```bash
   # Install Heroku CLI
   # Create app
   heroku create your-app-name
   
   # Add PostgreSQL
   heroku addons:create heroku-postgresql:mini
   ```

2. **Configure Environment**
   ```bash
   heroku config:set SESSION_SECRET=your-secure-secret
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Digital Ocean App Platform

1. **Create App Spec** (app.yaml included)

2. **Deploy via Dashboard**
   - Upload code or connect Git repository
   - Configure environment variables
   - Add managed PostgreSQL database

### Docker Deployment

1. **Build Image**
   ```bash
   docker build -t irrigation-system .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Or run manually**
   ```bash
   # Start PostgreSQL
   docker run --name postgres -e POSTGRES_DB=irrigation -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   
   # Run application
   docker run --name irrigation-app -p 5000:5000 -e DATABASE_URL=postgresql://postgres:password@postgres:5432/irrigation --link postgres irrigation-system
   ```

## Production Considerations

### Security
- Use strong `SESSION_SECRET` (32+ characters)
- Enable HTTPS with reverse proxy (nginx)
- Implement rate limiting
- Regular security updates

### Performance
- Enable gzip compression
- Configure CDN for static assets
- Database connection pooling
- Monitor resource usage

### Monitoring
- Application logs
- Database performance
- Error tracking (Sentry)
- Uptime monitoring

### Backup
- Database backups (automated)
- Application data export
- Environment configuration backup

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SESSION_SECRET` | Yes | Session encryption key | `super-secure-random-string` |
| `NODE_ENV` | Recommended | Environment mode | `production` |
| `PORT` | No | Server port | `5000` (default) |
| `OPENWEATHER_API_KEY` | No | Weather service API key | `abc123...` |
| `WEATHER_API_KEY` | No | Alternative weather API | `xyz789...` |

## Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

### Database Issues
```bash
# Test connection
npm run db:push

# Check schema
npm run db:studio
```

### Runtime Issues
```bash
# Check logs
npm run dev  # Development logs
pm2 logs    # Production logs (if using PM2)
```

### Performance Issues
- Enable database connection pooling
- Add database indexes
- Implement caching
- Use CDN for static assets

## Scaling

### Horizontal Scaling
- Load balancer configuration
- Session store (Redis)
- Database read replicas
- CDN for static content

### Database Scaling
- Connection pooling
- Read replicas
- Database optimization
- Caching layer

## Maintenance

### Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Database migrations
npm run db:push
```

### Monitoring
- Set up health checks
- Monitor database performance
- Track error rates
- Monitor resource usage

### Backup Strategy
- Daily database backups
- Configuration backups
- Disaster recovery plan
- Test restore procedures