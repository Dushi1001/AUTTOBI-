import { users, kyc, loginHistory, type User, type InsertUser, type Kyc, type InsertKyc, type LoginHistory, type InsertLoginHistory } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getKycByUserId(userId: number): Promise<Kyc | undefined>;
  createOrUpdateKyc(kyc: InsertKyc): Promise<Kyc>;
  logUserLogin(loginData: InsertLoginHistory): Promise<LoginHistory>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return user;
  }

  async getKycByUserId(userId: number): Promise<Kyc | undefined> {
    const [kycData] = await db.select().from(kyc).where(eq(kyc.userId, userId));
    return kycData || undefined;
  }

  async createOrUpdateKyc(kycData: InsertKyc): Promise<Kyc> {
    // Check if KYC record exists for user
    const existingKyc = await this.getKycByUserId(kycData.userId);
    
    if (existingKyc) {
      // Update existing KYC
      const [updatedKyc] = await db
        .update(kyc)
        .set({ ...kycData, updatedAt: new Date() })
        .where(eq(kyc.userId, kycData.userId))
        .returning();
      return updatedKyc;
    } else {
      // Create new KYC record
      const [newKyc] = await db
        .insert(kyc)
        .values({
          ...kycData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return newKyc;
    }
  }

  async logUserLogin(loginData: InsertLoginHistory): Promise<LoginHistory> {
    // Log login attempt
    const [logEntry] = await db
      .insert(loginHistory)
      .values(loginData)
      .returning();
    
    // Update user's last login and IP if successful login
    if (loginData.success) {
      await db
        .update(users)
        .set({ 
          lastLogin: new Date(),
          lastIpAddress: loginData.ipAddress,
          updatedAt: new Date()
        })
        .where(eq(users.id, loginData.userId));
    }
    
    return logEntry;
  }
}

export const storage = new DatabaseStorage();
