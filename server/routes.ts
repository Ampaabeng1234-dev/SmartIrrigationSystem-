import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { 
  insertCropSchema, 
  insertIrrigationZoneSchema, 
  insertSensorReadingSchema,
  insertWeatherDataSchema,
  insertIrrigationScheduleSchema,
  insertChatMessageSchema
} from "@shared/schema";
import { z } from "zod";
import { weatherService } from "./services/weather";
import { sensorDataService } from "./services/sensorData";

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Middleware to check if user is admin
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const zones = await storage.getAllZones();
      const activeZones = zones.filter(zone => zone.isActive);
      
      // Get average moisture from recent readings
      const readings = await storage.getSensorReadings(undefined, 10);
      const avgMoisture = readings.length > 0 
        ? readings.reduce((sum, reading) => sum + reading.moistureLevel, 0) / readings.length
        : 0;

      const stats = {
        avgMoisture: Math.round(avgMoisture),
        activeZones: activeZones.length,
        totalZones: zones.length,
        waterUsage: 1247, // This could be calculated from irrigation logs
        systemStatus: "online",
        sensorsOnline: zones.length,
        lastSync: new Date().toISOString()
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Crops API
  app.get("/api/crops", requireAuth, async (req, res) => {
    try {
      const crops = await storage.getAllCrops();
      res.json(crops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crops" });
    }
  });

  app.post("/api/crops", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCropSchema.parse(req.body);
      const crop = await storage.createCrop(validatedData);
      res.status(201).json(crop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid crop data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create crop" });
      }
    }
  });

  app.put("/api/crops/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCropSchema.partial().parse(req.body);
      const crop = await storage.updateCrop(id, validatedData);
      
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      
      res.json(crop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid crop data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update crop" });
      }
    }
  });

  app.delete("/api/crops/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCrop(id);
      
      if (!success) {
        return res.status(404).json({ message: "Crop not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete crop" });
    }
  });

  // Irrigation Zones API
  app.get("/api/zones", requireAuth, async (req, res) => {
    try {
      const zones = await storage.getAllZones();
      
      // Get latest sensor readings for each zone
      const zonesWithData = await Promise.all(
        zones.map(async (zone) => {
          const latestReading = await storage.getLatestSensorReading(zone.id);
          const crop = zone.cropId ? await storage.getCrop(zone.cropId) : null;
          
          return {
            ...zone,
            moistureLevel: latestReading?.moistureLevel || 0,
            temperature: latestReading?.temperature || 0,
            humidity: latestReading?.humidity || 0,
            crop: crop
          };
        })
      );
      
      res.json(zonesWithData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch zones" });
    }
  });

  app.post("/api/zones", requireAuth, async (req, res) => {
    try {
      const validatedData = insertIrrigationZoneSchema.parse(req.body);
      const zone = await storage.createZone(validatedData);
      res.status(201).json(zone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid zone data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create zone" });
      }
    }
  });

  app.put("/api/zones/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertIrrigationZoneSchema.partial().parse(req.body);
      
      // Update last watered time if activating irrigation
      if (validatedData.isActive === true) {
        validatedData.lastWatered = new Date();
      }
      
      const zone = await storage.updateZone(id, validatedData);
      
      if (!zone) {
        return res.status(404).json({ message: "Zone not found" });
      }
      
      res.json(zone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid zone data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update zone" });
      }
    }
  });

  app.delete("/api/zones/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteZone(id);
      
      if (!success) {
        return res.status(404).json({ message: "Zone not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete zone" });
    }
  });

  // Sensor Readings API
  app.get("/api/sensor-readings", requireAuth, async (req, res) => {
    try {
      const zoneId = req.query.zoneId ? parseInt(req.query.zoneId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      
      const readings = await storage.getSensorReadings(zoneId, limit);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sensor readings" });
    }
  });

  app.post("/api/sensor-readings", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSensorReadingSchema.parse(req.body);
      const reading = await storage.createSensorReading(validatedData);
      res.status(201).json(reading);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid sensor reading data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create sensor reading" });
      }
    }
  });

  // Weather API
  app.get("/api/weather", requireAuth, async (req, res) => {
    try {
      const weatherData = await weatherService.getCurrentWeather();
      res.json(weatherData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  app.get("/api/weather/forecast", requireAuth, async (req, res) => {
    try {
      const forecast = await weatherService.getForecast();
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather forecast" });
    }
  });

  // User Management (Admin only)
  app.get("/api/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const { scrypt, randomBytes } = await import("crypto");
      const { promisify } = await import("util");
      const scryptAsync = promisify(scrypt);
      
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(password, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;

      // Create user
      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: role || "user"
      });

      // Remove password from response
      const { password: _, ...safeUser } = newUser;
      res.status(201).json(safeUser);
    } catch (error: any) {
      console.error("Error creating user:", error);
      
      // Handle specific database constraint errors
      if (error.code === '23505') {
        if (error.constraint === 'users_username_unique') {
          return res.status(400).json({ message: "Username already exists" });
        }
        if (error.constraint === 'users_email_unique') {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
      
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Password Reset Routes
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return res.json({ message: "If this email is registered, you will receive reset instructions" });
      }

      // Generate secure token
      const { randomBytes } = await import("crypto");
      const token = randomBytes(32).toString("hex");
      
      // Token expires in 1 hour
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      // Save token to database
      await storage.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt
      });

      // In a real app, you would send an email here
      // For now, we'll just return the token for testing
      console.log(`Password reset token for ${email}: ${token}`);
      
      res.json({ 
        message: "If this email is registered, you will receive reset instructions",
        // Remove this in production - only for testing
        resetToken: token 
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      // Find valid token
      const resetToken = await storage.getPasswordResetToken(token);
      if (!resetToken || resetToken.used || new Date() > resetToken.expiresAt) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const { scrypt, randomBytes } = await import("crypto");
      const { promisify } = await import("util");
      const scryptAsync = promisify(scrypt);
      
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(newPassword, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;

      // Update password
      await storage.updatePassword(resetToken.userId, hashedPassword);
      
      // Invalidate token
      await storage.invalidatePasswordResetToken(resetToken.id);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  app.patch("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      if (userId === req.user?.id) {
        return res.status(400).json({ message: "Cannot modify your own role" });
      }

      const updatedUser = await storage.updateUserRole(userId, role);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password: _, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  app.put("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { password, ...updates } = req.body;
      
      const user = await storage.updateUser(id, updates);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteUser(id);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // System Control API
  app.post("/api/system/emergency-stop", requireAuth, async (req, res) => {
    try {
      const zones = await storage.getAllZones();
      await Promise.all(
        zones.map(zone => storage.updateZone(zone.id, { isActive: false }))
      );
      res.json({ message: "Emergency stop activated - all zones stopped" });
    } catch (error) {
      res.status(500).json({ message: "Failed to execute emergency stop" });
    }
  });

  // Database Backup API (Admin only)
  app.post("/api/system/backup", requireAdmin, async (req, res) => {
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const backupFile = `backup_${timestamp}.sql`;
      
      await execAsync(`pg_dump $DATABASE_URL > ${backupFile}`);
      
      res.json({ 
        message: "Database backup created successfully",
        filename: backupFile,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Backup error:", error);
      res.status(500).json({ message: "Failed to create database backup" });
    }
  });

  app.get("/api/system/backups", requireAdmin, async (req, res) => {
    try {
      const { readdir, stat } = await import('fs/promises');
      const { join } = await import('path');
      
      try {
        const files = await readdir('./backups');
        const backupFiles = files.filter(file => file.endsWith('.sql') || file.endsWith('.dump'));
        
        const backups = await Promise.all(
          backupFiles.map(async (file) => {
            const filePath = join('./backups', file);
            const stats = await stat(filePath);
            return {
              filename: file,
              size: stats.size,
              created: stats.mtime,
              type: file.includes('full') ? 'full' : 
                    file.includes('schema') ? 'schema' : 
                    file.includes('data') ? 'data' : 
                    file.includes('compressed') ? 'compressed' : 'manual'
            };
          })
        );
        
        res.json(backups.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()));
      } catch (error) {
        // If backups directory doesn't exist, return empty array
        res.json([]);
      }
    } catch (error) {
      console.error("Error listing backups:", error);
      res.status(500).json({ message: "Failed to list backups" });
    }
  });

  // Chat API
  app.get("/api/chat/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : req.user!.id;
      
      // Non-admin users can only see their own messages
      if (req.user!.role !== "admin" && userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/messages", requireAuth, async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      // Determine the target user and admin status
      let targetUserId: number;
      let isFromAdmin = false;
      
      if (req.user!.role === "admin" && userId) {
        // Admin sending message to specific user
        targetUserId = userId;
        isFromAdmin = true;
      } else {
        // Regular user sending message
        targetUserId = req.user!.id;
        isFromAdmin = false;
      }
      
      const validatedData = insertChatMessageSchema.parse({
        userId: targetUserId,
        message,
        isFromAdmin
      });
      
      const newMessage = await storage.createChatMessage(validatedData);
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid message data", errors: error.errors });
      } else {
        console.error("Error creating chat message:", error);
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  // Admin Chat Management
  app.get("/api/chat/conversations", requireAdmin, async (req, res) => {
    try {
      const conversations = await storage.getAllChatConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Notifications API
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const notifications = [];
      
      // Get recent sensor readings for moisture alerts
      const sensorReadings = await storage.getSensorReadings(undefined, 10);
      const zones = await storage.getAllZones();
      
      // Check for low moisture alerts
      const lowMoistureReadings = sensorReadings.filter(reading => reading.moistureLevel < 20);
      lowMoistureReadings.forEach(reading => {
        const zone = zones.find(z => z.id === reading.zoneId);
        notifications.push({
          id: `moisture-${reading.id}`,
          type: "warning",
          title: "Low Soil Moisture",
          message: `${zone?.name || 'Zone'} moisture level is ${reading.moistureLevel}%. Irrigation recommended.`,
          timestamp: reading.timestamp,
          isRead: false,
          category: "irrigation"
        });
      });

      // Check for high temperature alerts
      const highTempReadings = sensorReadings.filter(reading => reading.temperature && reading.temperature > 35);
      highTempReadings.forEach(reading => {
        const zone = zones.find(z => z.id === reading.zoneId);
        notifications.push({
          id: `temp-${reading.id}`,
          type: "alert",
          title: "High Temperature Alert",
          message: `${zone?.name || 'Zone'} temperature is ${reading.temperature}°C. Monitor crops closely.`,
          timestamp: reading.timestamp,
          isRead: false,
          category: "irrigation"
        });
      });

      // Weather-based notifications
      const weather = await weatherService.getCurrentWeather();
      if (weather && weather.precipitation > 80) {
        notifications.push({
          id: "weather-rain",
          type: "info",
          title: "Heavy Rain Expected",
          message: "High precipitation forecast. Consider adjusting irrigation schedules.",
          timestamp: new Date(),
          isRead: false,
          category: "weather"
        });
      }

      // Admin-specific notifications
      if (req.user!.role === "admin") {
        // Check for unread chat messages
        const conversations = await storage.getAllChatConversations();
        const unreadChats = conversations.filter(conv => conv.unreadCount > 0);
        
        if (unreadChats.length > 0) {
          notifications.push({
            id: "chat-unread",
            type: "info",
            title: "New Support Messages",
            message: `${unreadChats.length} conversation(s) have unread messages.`,
            timestamp: new Date(),
            isRead: false,
            category: "chat"
          });
        }

        // System status notifications
        const allUsers = await storage.getAllUsers();
        const recentUsers = allUsers.filter(user => 
          user.createdAt && new Date(user.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );
        
        if (recentUsers.length > 0) {
          notifications.push({
            id: "new-users",
            type: "info",
            title: "New User Registrations",
            message: `${recentUsers.length} new user(s) registered in the last 24 hours.`,
            timestamp: new Date(),
            isRead: false,
            category: "user"
          });
        }
      }

      // Sort by timestamp (newest first)
      notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      res.json(notifications.slice(0, 20)); // Limit to 20 most recent
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Initialize sensor data simulation
  sensorDataService.startSimulation();

  const httpServer = createServer(app);
  return httpServer;
}
