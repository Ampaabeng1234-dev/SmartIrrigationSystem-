import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from "@shared/schema";

// Use in-memory database for development
const sqlite = new Database(':memory:');

// Initialize database and create tables
export async function initializeDatabase() {
  try {
    // Create all tables
    console.log("Creating database tables...");
    
    // Create users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create password reset tokens table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create crops table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS crops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        water_requirement TEXT NOT NULL,
        optimal_moisture INTEGER NOT NULL,
        growth_stage TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create irrigation zones table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS irrigation_zones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        field TEXT NOT NULL,
        crop_id INTEGER,
        is_active BOOLEAN DEFAULT 0,
        last_watered DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (crop_id) REFERENCES crops(id)
      )
    `);

    // Create sensor readings table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sensor_readings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id INTEGER,
        moisture_level REAL NOT NULL,
        temperature REAL,
        humidity REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (zone_id) REFERENCES irrigation_zones(id)
      )
    `);

    // Create weather data table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS weather_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temperature REAL NOT NULL,
        humidity REAL NOT NULL,
        description TEXT NOT NULL,
        wind_speed REAL,
        precipitation REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create irrigation schedule table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS irrigation_schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id INTEGER,
        scheduled_time DATETIME NOT NULL,
        duration INTEGER NOT NULL,
        is_completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (zone_id) REFERENCES irrigation_zones(id)
      )
    `);

    // Create chat messages table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        is_from_admin BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create sessions table for session storage
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id VARCHAR(128) UNIQUE NOT NULL,
        expires INTEGER UNSIGNED NOT NULL,
        data TEXT,
        PRIMARY KEY (session_id)
      )
    `);

    console.log("Database tables created successfully");
    
    // Initialize admin user if none exists
    const existingAdmin = sqlite.prepare("SELECT * FROM users WHERE role = 'admin'").get();
    if (!existingAdmin) {
      // Create admin user Samuel with the correct password
      const { scrypt, randomBytes } = await import("crypto");
      const { promisify } = await import("util");
      const scryptAsync = promisify(scrypt);
      
      const password = "Alpha@22";
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(password, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;
      
      sqlite.prepare(`
        INSERT INTO users (username, email, password, role, created_at)
        VALUES (?, ?, ?, 'admin', CURRENT_TIMESTAMP)
      `).run("Samuel", "projechosting425@gmail.com", hashedPassword);
      
      console.log("Admin user 'Samuel' created successfully");
    }
    
    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

export const db = drizzle(sqlite, { schema });