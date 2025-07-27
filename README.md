# Smart Irrigation Management System

A comprehensive full-stack web application for monitoring and controlling smart irrigation systems with real-time sensor data, weather integration, and automated scheduling capabilities.

## Features

- **Real-time Dashboard**: Monitor soil moisture, temperature, and humidity
- **Weather Integration**: Current conditions and 5-day forecasts
- **Irrigation Control**: Manual and automated watering schedules
- **User Management**: Role-based access control (Admin/User)
- **Chat Support**: Built-in communication system
- **Analytics**: Data visualization and reporting
- **Arduino Integration**: Connect real sensor hardware
- **Mobile Responsive**: Works on all devices

## Technology Stack

- **Frontend**: React 18 with TypeScript, Vite, Tailwind CSS + shadcn/ui
- **Backend**: Node.js with Express.js, TypeScript, Passport.js authentication
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query
- **Charts**: Chart.js for data visualization

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Visual Studio Code (recommended)

### Installation

```bash
# Clone or extract project
cd smart-irrigation-system

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Visual Studio Code Setup

For the best development experience with VS Code:

1. Open the project: `code .`
2. Install recommended extensions when prompted
3. Use `F5` to start debugging or `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Development Server"

See `VSCODE_SETUP.md` for detailed VS Code configuration guide.

## Default Accounts

**Admin Account:**
- Username: `Samuel`
- Password: `Alpha@22`

**Test User:**
- Username: `Ashie`
- Password: `test123`

## Arduino Integration

The system can receive real sensor data from Arduino boards via WiFi. See `ARDUINO_INTEGRATION.md` for complete setup instructions including:

- ESP32/ESP8266 code examples
- Sensor calibration guides
- Multiple connection methods (HTTP, Serial, MQTT)
- Hardware setup diagrams

### Quick Arduino Test

```bash
# Test the sensor endpoint
curl -X POST http://localhost:5000/api/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"zoneId":1,"moistureLevel":45,"temperature":22.5,"humidity":60}'
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm start              # Start production server
npm run db:push        # Push schema changes to database
npm run db:studio      # Open database GUI
```

## Environment Variables

Required variables for `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/irrigation_db
SESSION_SECRET=your-super-secure-random-string

# Optional
OPENWEATHER_API_KEY=your-weather-api-key
ENABLE_REAL_SENSORS=false
ARDUINO_API_KEY=your-arduino-api-key
```

## Project Structure

```
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared types
├── ARDUINO_INTEGRATION.md  # Arduino setup guide
└── package.json
```

## Support

Use the built-in chat system for user support or check the application logs for troubleshooting.