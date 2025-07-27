# Smart Irrigation Management System

## Overview

This is a modern full-stack smart irrigation management system built with React, Node.js/Express, and PostgreSQL. The application provides comprehensive monitoring and control of irrigation systems with real-time sensor data, weather integration, and automated scheduling capabilities. It features role-based access control, responsive design, and real-time data visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Styling**: CSS variables for theming with dark/light mode support
- **Charts**: Chart.js for data visualization
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful API with role-based access control

### Database Design
- **Database**: SQLite with Drizzle ORM (in-memory for development)
- **Connection**: Better-sqlite3 driver for high performance
- **Schema Management**: Direct table creation with SQL for rapid development
- **Type Safety**: Full TypeScript integration with schema validation

## Key Components

### Authentication System
- Session-based authentication using Passport.js
- Password hashing with Node.js crypto (scrypt)
- Role-based access control (admin/user roles)
- Protected routes with authentication middleware
- Session persistence across browser restarts
- Forgot password functionality with secure token-based reset
- Password reset tokens with 1-hour expiration

### Data Models
- **Users**: Username, email, password, role, timestamps
- **Password Reset Tokens**: Secure tokens for password reset with expiration
- **Profile Management**: Comprehensive user profile system with secure editing capabilities
- **Crops**: Name, water requirements, optimal moisture levels, growth stages
- **Irrigation Zones**: Field areas linked to crops with active status tracking
- **Sensor Readings**: Real-time moisture, temperature, humidity data
- **Weather Data**: Current conditions and forecasts
- **Irrigation Schedules**: Automated watering schedules
- **Chat Messages**: User support communication system

### Real-time Features
- Automatic sensor data simulation (30-second intervals)
- Weather data updates (10-minute intervals)  
- Live dashboard with real-time statistics
- WebSocket-ready architecture for future enhancements

### UI Components
- Dashboard with key metrics and alerts
- Interactive moisture level charts
- Weather forecast integration
- Irrigation zone management with manual controls
- User management (admin only)
- Analytics and reporting pages
- Profile management with dual-tab interface (Edit Profile & Change Password)
- Mobile-responsive design with sheet navigation

## Data Flow

1. **Sensor Data Collection**: Simulated sensor readings are generated and stored every 30 seconds
2. **Weather Integration**: External weather API data is fetched and cached every 10 minutes
3. **Real-time Updates**: Frontend queries refresh automatically using React Query
4. **User Actions**: Manual irrigation controls trigger immediate API calls and UI updates
5. **Authentication Flow**: Login creates server session, frontend maintains auth state via React Query

## External Dependencies

### Core Dependencies
- **better-sqlite3**: SQLite database driver for Node.js
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **passport**: Authentication middleware
- **express-session**: Session management with in-memory store
- **chart.js**: Data visualization

### UI Libraries
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight routing

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety
- **drizzle-kit**: Database migration tool

## Deployment Strategy

### Development
- Vite development server for frontend hot reloading
- Express server with TypeScript compilation via tsx
- Environment variables for database connection
- Automatic database migrations via Drizzle

### Production Build
- Vite builds static frontend assets to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Single deployment artifact with both frontend and backend
- Environment-based configuration

### Environment Variables Required
- `SESSION_SECRET`: Session encryption key (automatically handled in development)
- `OPENWEATHER_API_KEY` or `WEATHER_API_KEY`: Weather service API key (optional)
- `DATABASE_URL`: SQLite database file path (uses in-memory by default)

### Hosting Considerations
- Requires Node.js runtime environment
- SQLite database (in-memory for development, file-based for production)
- Static file serving capability
- Session storage in memory
- WebSocket support for future real-time features