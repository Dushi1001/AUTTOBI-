import { pgTable, text, serial, integer, boolean, timestamp, numeric, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  displayName: text("display_name"),
  role: text("role").default("user").notNull(), // 'user', 'admin'
  lastIpAddress: text("last_ip_address"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Game schema
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  category: text("category").notNull(),
  releaseDate: timestamp("release_date").notNull(),
  rating: numeric("rating"),
  publisher: text("publisher").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User-Game relationship (for owned games)
export const userGames = pgTable("user_games", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gameId: integer("game_id").notNull().references(() => games.id),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  playTime: integer("play_time").default(0),
  isFavorite: boolean("is_favorite").default(false),
});

// KYC schema
export const kyc = pgTable("kyc", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // 'pending', 'verified', 'rejected'
  fullName: text("full_name"),
  dateOfBirth: timestamp("date_of_birth"),
  documentType: text("document_type"), // 'passport', 'driver_license', 'id_card'
  documentNumber: text("document_number"),
  documentImageUrl: text("document_image_url"),
  selfieImageUrl: text("selfie_image_url"),
  rejectionReason: text("rejection_reason"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User Login History for IP tracking
export const loginHistory = pgTable("login_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent"),
  loginTime: timestamp("login_time").defaultNow().notNull(),
  success: boolean("success").notNull(),
  location: json("location"), // Store geolocation data
});

// Wallet schema
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  address: text("address").notNull(),
  balance: numeric("balance").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => wallets.id),
  hash: text("hash").notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: numeric("amount").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  type: text("type").notNull(), // 'in' or 'out'
  status: text("status").notNull(), // 'pending', 'confirmed', or 'failed'
  metadata: json("metadata"),
});

// Admin Action Logs
export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull().references(() => users.id),
  action: text("action").notNull(), // 'kyc_approve', 'kyc_reject', 'user_ban', etc.
  targetUserId: integer("target_user_id").references(() => users.id),
  details: json("details"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  role: true,
  lastIpAddress: true,
});

export const insertGameSchema = createInsertSchema(games);

export const insertUserGameSchema = createInsertSchema(userGames);

export const insertKycSchema = createInsertSchema(kyc).pick({
  userId: true,
  status: true,
  fullName: true,
  dateOfBirth: true,
  documentType: true,
  documentNumber: true,
  documentImageUrl: true,
  selfieImageUrl: true,
});

export const insertLoginHistorySchema = createInsertSchema(loginHistory).pick({
  userId: true,
  ipAddress: true,
  userAgent: true,
  success: true,
  location: true,
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
  address: true,
  balance: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  walletId: true,
  hash: true,
  fromAddress: true,
  toAddress: true,
  amount: true,
  type: true,
  status: true,
  metadata: true,
});

export const insertAdminLogSchema = createInsertSchema(adminLogs).pick({
  adminId: true,
  action: true,
  targetUserId: true,
  details: true,
  ipAddress: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertUserGame = z.infer<typeof insertUserGameSchema>;
export type UserGame = typeof userGames.$inferSelect;

export type InsertKyc = z.infer<typeof insertKycSchema>;
export type Kyc = typeof kyc.$inferSelect;

export type InsertLoginHistory = z.infer<typeof insertLoginHistorySchema>;
export type LoginHistory = typeof loginHistory.$inferSelect;

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;
export type AdminLog = typeof adminLogs.$inferSelect;
