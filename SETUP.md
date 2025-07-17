# Quick Setup Guide

This is a step-by-step guide to get the Smart Irrigation Management System running locally.

## Prerequisites

✅ **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)  
✅ **PostgreSQL** - Local install or cloud database (Neon, Railway, etc.)  
✅ **Git** (optional) - For version control

## Step 1: Extract and Install

```bash
# Extract the downloaded zip file
unzip smart-irrigation-system.zip
cd smart-irrigation-system

# Install all dependencies
npm install
```

## Step 2: Database Setup

### Option A: Local PostgreSQL
```bash
# Create database
createdb irrigation_system

# Or using psql
psql -c "CREATE DATABASE irrigation_system;"
```

### Option B: Cloud Database (Recommended)
1. Sign up for [Neon](https://neon.tech) (free tier available)
2. Create a new database
3. Copy the connection string

## Step 3: Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your database details
nano .env  # or use any text editor
```

**Required environment variables:**
```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-super-secure-random-string
```

## Step 4: Initialize Database

```bash
# Push database schema (creates all tables)
npm run db:push
```

## Step 5: Start the Application

```bash
# Development mode (with hot reload)
npm run dev

# Or production mode
npm run build
npm start
```

The application will be available at: **http://localhost:5000**

## Step 6: Create Admin Account

1. Open the app in your browser
2. Register a new account
3. Manually set admin role in database:

```sql
UPDATE users SET role = 'admin' WHERE username = 'your-username';
```

**Or use the existing admin account:**
- Username: `Samuel`
- Password: `Alpha@22`

## Test User Account

- Username: `Ashie`
- Password: `test123`

## Common Issues & Solutions

### Database Connection Error
- Check your `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify database exists

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Check what's using port 5000
lsof -i :5000

# Kill the process or change PORT in .env
PORT=3000
```

## Next Steps

✅ **Explore Features**: Dashboard, irrigation zones, weather data  
✅ **Add Users**: Use admin panel to manage users  
✅ **Configure Weather**: Add weather API key for forecasts  
✅ **Customize**: Modify settings and add your own data  

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Use the built-in chat system for support

**Ready to start smart irrigation management!** 🌱💧