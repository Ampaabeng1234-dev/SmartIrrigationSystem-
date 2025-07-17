import { 
  users, 
  passwordResetTokens,
  crops, 
  irrigationZones, 
  sensorReadings, 
  weatherData, 
  irrigationSchedule,
  chatMessages,
  type User, 
  type InsertUser,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type Crop,
  type InsertCrop,
  type IrrigationZone,
  type InsertIrrigationZone,
  type SensorReading,
  type InsertSensorReading,
  type WeatherData,
  type InsertWeatherData,
  type IrrigationSchedule,
  type InsertIrrigationSchedule,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lt } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  updatePassword(id: number, password: string): Promise<User | undefined>;
  
  // Password Reset Tokens
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  invalidatePasswordResetToken(id: number): Promise<boolean>;
  
  // Crops
  getAllCrops(): Promise<Crop[]>;
  getCrop(id: number): Promise<Crop | undefined>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  updateCrop(id: number, updates: Partial<InsertCrop>): Promise<Crop | undefined>;
  deleteCrop(id: number): Promise<boolean>;
  
  // Irrigation Zones
  getAllZones(): Promise<IrrigationZone[]>;
  getZone(id: number): Promise<IrrigationZone | undefined>;
  createZone(zone: InsertIrrigationZone): Promise<IrrigationZone>;
  updateZone(id: number, updates: Partial<InsertIrrigationZone>): Promise<IrrigationZone | undefined>;
  deleteZone(id: number): Promise<boolean>;
  
  // Sensor Readings
  getSensorReadings(zoneId?: number, limit?: number): Promise<SensorReading[]>;
  createSensorReading(reading: InsertSensorReading): Promise<SensorReading>;
  getLatestSensorReading(zoneId: number): Promise<SensorReading | undefined>;
  
  // Weather Data
  getWeatherData(limit?: number): Promise<WeatherData[]>;
  createWeatherData(weather: InsertWeatherData): Promise<WeatherData>;
  getLatestWeatherData(): Promise<WeatherData | undefined>;
  
  // Irrigation Schedule
  getIrrigationSchedule(zoneId?: number): Promise<IrrigationSchedule[]>;
  createIrrigationSchedule(schedule: InsertIrrigationSchedule): Promise<IrrigationSchedule>;
  updateIrrigationSchedule(id: number, updates: Partial<InsertIrrigationSchedule>): Promise<IrrigationSchedule | undefined>;
  
  // Chat Messages
  getChatMessages(userId?: number): Promise<(ChatMessage & { username: string })[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getAllChatConversations(): Promise<{ userId: number; username: string; lastMessage: string; lastMessageTime: string; unreadCount: number }[]>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async updatePassword(id: number, password: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Password Reset Tokens
  async createPasswordResetToken(insertToken: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db
      .insert(passwordResetTokens)
      .values(insertToken)
      .returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    return resetToken || undefined;
  }

  async invalidatePasswordResetToken(id: number): Promise<boolean> {
    const result = await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Crops
  async getAllCrops(): Promise<Crop[]> {
    return await db.select().from(crops).orderBy(desc(crops.createdAt));
  }

  async getCrop(id: number): Promise<Crop | undefined> {
    const [crop] = await db.select().from(crops).where(eq(crops.id, id));
    return crop || undefined;
  }

  async createCrop(crop: InsertCrop): Promise<Crop> {
    const [newCrop] = await db
      .insert(crops)
      .values(crop)
      .returning();
    return newCrop;
  }

  async updateCrop(id: number, updates: Partial<InsertCrop>): Promise<Crop | undefined> {
    const [crop] = await db
      .update(crops)
      .set(updates)
      .where(eq(crops.id, id))
      .returning();
    return crop || undefined;
  }

  async deleteCrop(id: number): Promise<boolean> {
    const result = await db.delete(crops).where(eq(crops.id, id));
    return result.rowCount > 0;
  }

  // Irrigation Zones
  async getAllZones(): Promise<IrrigationZone[]> {
    return await db.select().from(irrigationZones).orderBy(desc(irrigationZones.createdAt));
  }

  async getZone(id: number): Promise<IrrigationZone | undefined> {
    const [zone] = await db.select().from(irrigationZones).where(eq(irrigationZones.id, id));
    return zone || undefined;
  }

  async createZone(zone: InsertIrrigationZone): Promise<IrrigationZone> {
    const [newZone] = await db
      .insert(irrigationZones)
      .values(zone)
      .returning();
    return newZone;
  }

  async updateZone(id: number, updates: Partial<InsertIrrigationZone>): Promise<IrrigationZone | undefined> {
    const [zone] = await db
      .update(irrigationZones)
      .set(updates)
      .where(eq(irrigationZones.id, id))
      .returning();
    return zone || undefined;
  }

  async deleteZone(id: number): Promise<boolean> {
    const result = await db.delete(irrigationZones).where(eq(irrigationZones.id, id));
    return result.rowCount > 0;
  }

  // Sensor Readings
  async getSensorReadings(zoneId?: number, limit = 100): Promise<SensorReading[]> {
    let query = db.select().from(sensorReadings);
    
    if (zoneId) {
      query = query.where(eq(sensorReadings.zoneId, zoneId));
    }
    
    return await query.orderBy(desc(sensorReadings.timestamp)).limit(limit);
  }

  async createSensorReading(reading: InsertSensorReading): Promise<SensorReading> {
    const [newReading] = await db
      .insert(sensorReadings)
      .values(reading)
      .returning();
    return newReading;
  }

  async getLatestSensorReading(zoneId: number): Promise<SensorReading | undefined> {
    const [reading] = await db
      .select()
      .from(sensorReadings)
      .where(eq(sensorReadings.zoneId, zoneId))
      .orderBy(desc(sensorReadings.timestamp))
      .limit(1);
    return reading || undefined;
  }

  // Weather Data
  async getWeatherData(limit = 100): Promise<WeatherData[]> {
    return await db
      .select()
      .from(weatherData)
      .orderBy(desc(weatherData.timestamp))
      .limit(limit);
  }

  async createWeatherData(weather: InsertWeatherData): Promise<WeatherData> {
    const [newWeather] = await db
      .insert(weatherData)
      .values(weather)
      .returning();
    return newWeather;
  }

  async getLatestWeatherData(): Promise<WeatherData | undefined> {
    const [weather] = await db
      .select()
      .from(weatherData)
      .orderBy(desc(weatherData.timestamp))
      .limit(1);
    return weather || undefined;
  }

  // Irrigation Schedule
  async getIrrigationSchedule(zoneId?: number): Promise<IrrigationSchedule[]> {
    let query = db.select().from(irrigationSchedule);
    
    if (zoneId) {
      query = query.where(eq(irrigationSchedule.zoneId, zoneId));
    }
    
    return await query.orderBy(desc(irrigationSchedule.scheduledTime));
  }

  async createIrrigationSchedule(schedule: InsertIrrigationSchedule): Promise<IrrigationSchedule> {
    const [newSchedule] = await db
      .insert(irrigationSchedule)
      .values(schedule)
      .returning();
    return newSchedule;
  }

  async updateIrrigationSchedule(id: number, updates: Partial<InsertIrrigationSchedule>): Promise<IrrigationSchedule | undefined> {
    const [schedule] = await db
      .update(irrigationSchedule)
      .set(updates)
      .where(eq(irrigationSchedule.id, id))
      .returning();
    return schedule || undefined;
  }

  // Chat Messages
  async getChatMessages(userId?: number): Promise<(ChatMessage & { username: string })[]> {
    let query = db
      .select({
        id: chatMessages.id,
        userId: chatMessages.userId,
        message: chatMessages.message,
        isFromAdmin: chatMessages.isFromAdmin,
        createdAt: chatMessages.createdAt,
        username: users.username,
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.userId, users.id));

    if (userId) {
      query = query.where(eq(chatMessages.userId, userId));
    }

    return await query.orderBy(chatMessages.createdAt);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getAllChatConversations(): Promise<{ userId: number; username: string; lastMessage: string; lastMessageTime: string; unreadCount: number }[]> {
    // Get the latest message for each user
    const conversations = await db
      .select({
        userId: chatMessages.userId,
        username: users.username,
        lastMessage: chatMessages.message,
        lastMessageTime: chatMessages.createdAt,
        isFromAdmin: chatMessages.isFromAdmin,
      })
      .from(chatMessages)
      .innerJoin(users, eq(chatMessages.userId, users.id))
      .orderBy(desc(chatMessages.createdAt));

    // Group by user and get the latest message
    const groupedConversations = new Map();
    for (const conv of conversations) {
      if (!groupedConversations.has(conv.userId)) {
        groupedConversations.set(conv.userId, {
          userId: conv.userId,
          username: conv.username,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime?.toISOString() || new Date().toISOString(),
          unreadCount: 0,
        });
      }
    }

    // Count unread messages (messages from users, not from admin)
    for (const conv of conversations) {
      if (!conv.isFromAdmin) {
        const existingConv = groupedConversations.get(conv.userId);
        if (existingConv) {
          existingConv.unreadCount++;
        }
      }
    }

    return Array.from(groupedConversations.values());
  }
}

export const storage = new DatabaseStorage();
