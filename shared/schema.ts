import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),  
  token: text("token").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  used: integer("used", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const crops = sqliteTable("crops", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  waterRequirement: text("water_requirement").notNull(),
  optimalMoisture: integer("optimal_moisture").notNull(),
  growthStage: text("growth_stage").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const irrigationZones = sqliteTable("irrigation_zones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  field: text("field").notNull(),
  cropId: integer("crop_id").references(() => crops.id),
  isActive: integer("is_active", { mode: "boolean" }).default(false),
  lastWatered: text("last_watered"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sensorReadings = sqliteTable("sensor_readings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  zoneId: integer("zone_id").references(() => irrigationZones.id),
  moistureLevel: real("moisture_level").notNull(),
  temperature: real("temperature"),
  humidity: real("humidity"),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

export const weatherData = sqliteTable("weather_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  temperature: real("temperature").notNull(),
  humidity: real("humidity").notNull(),
  description: text("description").notNull(),
  windSpeed: real("wind_speed"),
  precipitation: real("precipitation"),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

export const irrigationSchedule = sqliteTable("irrigation_schedule", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  zoneId: integer("zone_id").references(() => irrigationZones.id),
  scheduledTime: text("scheduled_time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isFromAdmin: integer("is_from_admin", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sensorReadings: many(sensorReadings),
  chatMessages: many(chatMessages),
  passwordResetTokens: many(passwordResetTokens),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

export const cropsRelations = relations(crops, ({ many }) => ({
  zones: many(irrigationZones),
}));

export const irrigationZonesRelations = relations(irrigationZones, ({ one, many }) => ({
  crop: one(crops, {
    fields: [irrigationZones.cropId],
    references: [crops.id],
  }),
  sensorReadings: many(sensorReadings),
  schedules: many(irrigationSchedule),
}));

export const sensorReadingsRelations = relations(sensorReadings, ({ one }) => ({
  zone: one(irrigationZones, {
    fields: [sensorReadings.zoneId],
    references: [irrigationZones.id],
  }),
}));

export const irrigationScheduleRelations = relations(irrigationSchedule, ({ one }) => ({
  zone: one(irrigationZones, {
    fields: [irrigationSchedule.zoneId],
    references: [irrigationZones.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).pick({
  userId: true,
  token: true,
  expiresAt: true,
});

export const insertCropSchema = createInsertSchema(crops).pick({
  name: true,
  waterRequirement: true,
  optimalMoisture: true,
  growthStage: true,
});

export const insertIrrigationZoneSchema = createInsertSchema(irrigationZones).pick({
  name: true,
  field: true,
  cropId: true,
  isActive: true,
});

export const insertSensorReadingSchema = createInsertSchema(sensorReadings).pick({
  zoneId: true,
  moistureLevel: true,
  temperature: true,
  humidity: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).pick({
  temperature: true,
  humidity: true,
  description: true,
  windSpeed: true,
  precipitation: true,
});

export const insertIrrigationScheduleSchema = createInsertSchema(irrigationSchedule).pick({
  zoneId: true,
  scheduledTime: true,
  duration: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  message: true,
  isFromAdmin: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type Crop = typeof crops.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;
export type IrrigationZone = typeof irrigationZones.$inferSelect;
export type InsertIrrigationZone = z.infer<typeof insertIrrigationZoneSchema>;
export type SensorReading = typeof sensorReadings.$inferSelect;
export type InsertSensorReading = z.infer<typeof insertSensorReadingSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type IrrigationSchedule = typeof irrigationSchedule.$inferSelect;
export type InsertIrrigationSchedule = z.infer<typeof insertIrrigationScheduleSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
