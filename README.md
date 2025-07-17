# Smart Irrigation Management System

A comprehensive full-stack web application for monitoring and controlling smart irrigation systems with real-time sensor data, weather integration, and automated scheduling capabilities.

## Features

- **Real-time Dashboard**: Monitor soil moisture, temperature, and humidity
- **Weather Integration**: Current conditions and 5-day forecasts
- **Irrigation Control**: Manual and automated watering schedules
- **User Management**: Role-based access control (Admin/User)
- **Chat Support**: Built-in communication system
- **Analytics**: Data visualization and reporting
- **Password Reset**: Secure admin and user password management
- **Mobile Responsive**: Works on all devices

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS + shadcn/ui components
- TanStack Query for state management
- Chart.js for data visualization
- Wouter for routing

### Backend
- Node.js with Express.js
- TypeScript with ES modules
- Passport.js authentication
- Session-based auth with PostgreSQL storage
- RESTful API design

### Database
- PostgreSQL with Drizzle ORM
- Neon serverless database support
- Type-safe schema management

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or cloud)
- npm or yarn

### 1. Installation

```bash
# Extract the zip file and navigate to the project
cd smart-irrigation-system

# Install dependencies
npm install
```

### 2. Database Setup

Create a PostgreSQL database and note the connection details.

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/irrigation_db

# Session Security
SESSION_SECRET=your-super-secure-random-string-here

# Weather API (Optional)
OPENWEATHER_API_KEY=your-openweather-api-key
# OR
WEATHER_API_KEY=your-weather-api-key
```

### 4. Database Migration

```bash
# Push database schema
npm run db:push
```

### 5. Start the Application

```bash
# Development mode (recommended for first run)
npm run dev

# Production mode
npm run build
npm start
```

The application will be available at `http://localhost:5000`

## Default Admin Account

After starting the application, create an admin account by registering a new user, then manually update the database:

```sql
UPDATE users SET role = 'admin' WHERE username = 'your-username';
```

Or use the existing admin account:
- Username: `Samuel`
- Password: `Alpha@22`

## User Accounts

Test user account:
- Username: `Ashie`
- Password: `test123`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Backend Express application
│   ├── services/           # Business logic services
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── auth.ts            # Authentication setup
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared type definitions
│   └── schema.ts          # Database schema and types
└── package.json           # Dependencies and scripts
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build           # Build for production
npm start              # Start production server

# Database
npm run db:push        # Push schema changes to database
npm run db:studio      # Open Drizzle Studio (database GUI)
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/sensor-readings` - Get sensor data
- `GET /api/weather` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast

### Irrigation Management
- `GET /api/zones` - Get irrigation zones
- `POST /api/zones` - Create new zone
- `PUT /api/zones/:id` - Update zone
- `POST /api/zones/:id/water` - Manual watering

### User Management (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users/:id/reset-password` - Reset user password

### Chat System
- `GET /api/chat/messages` - Get chat messages
- `POST /api/chat/messages` - Send message
- `POST /api/chat/messages/:id/reply` - Reply to message (Admin)

## Configuration Options

### Weather Service
The system supports multiple weather APIs. Configure in your `.env` file:
- OpenWeatherMap: `OPENWEATHER_API_KEY`
- WeatherAPI: `WEATHER_API_KEY`

### Database Options
- **Neon** (recommended): Serverless PostgreSQL
- **Local PostgreSQL**: Traditional PostgreSQL installation
- **Cloud providers**: AWS RDS, Google Cloud SQL, etc.

### Session Storage
Sessions are stored in PostgreSQL by default. For high-traffic deployments, consider Redis.

## Security Features

- Password hashing with scrypt
- Session-based authentication
- CSRF protection
- Role-based access control
- Secure password reset with tokens
- Input validation and sanitization

## Production Deployment

### Environment Variables
Ensure all required environment variables are set:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secure random string for sessions
- `NODE_ENV=production` - Enable production optimizations

### Build Process
```bash
npm run build
```

### Reverse Proxy
Configure nginx or similar for:
- HTTPS termination
- Static file serving
- Load balancing (if needed)

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` format
   - Check database server is running
   - Ensure database exists

2. **Authentication Issues**
   - Clear browser cookies
   - Check `SESSION_SECRET` is set
   - Verify user exists in database

3. **Build Errors**
   - Run `npm install` to ensure dependencies
   - Check Node.js version (18+)
   - Clear `node_modules` and reinstall

### Logs
Application logs are output to console. In production, configure log rotation and monitoring.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check this README and troubleshooting section
2. Review the application logs
3. Check the database connection and schema
4. Use the built-in chat system for user support

---

**Version**: 1.0.0  
**Last Updated**: July 2025