import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { insertUserSchema, insertKycSchema } from "@shared/schema";
import { z } from "zod";
import { isAdmin, getAllUsers, getUserKyc, updateKycStatus, getUserLoginHistory, getAdminLogs } from "./admin";

declare module "express-session" {
  interface SessionData {
    userId: number;
    isAdmin: boolean;
  }
}

// Game API endpoints
const gameSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  price: z.number().nonnegative(),
  category: z.string(),
  releaseDate: z.string().datetime(),
  rating: z.number().min(0).max(5),
  publisher: z.string(),
});

const walletTransactionSchema = z.object({
  fromAddress: z.string(),
  toAddress: z.string(),
  amount: z.number().positive(),
  transactionHash: z.string().optional(),
});

const kycSubmissionSchema = insertKycSchema.extend({
  userId: z.number(),
  fullName: z.string().min(2),
  dateOfBirth: z.string().datetime(),
  documentType: z.enum(["passport", "driver_license", "id_card"]),
  documentNumber: z.string().min(4),
  documentImageUrl: z.string().url().optional(),
  selfieImageUrl: z.string().url().optional(),
});

const kycStatusUpdateSchema = z.object({
  status: z.enum(["pending", "verified", "rejected"]),
  rejectionReason: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to protect routes
  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // API routes
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);
      
      // Create user with IP address for tracking
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword,
        email: validatedData.email || null,
        displayName: validatedData.displayName || null,
        role: "user",
        lastIpAddress: req.ip,
      });
      
      // Create session
      req.session.userId = user.id;
      req.session.isAdmin = false;
      
      // Log login
      await storage.logUserLogin({
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || "",
        success: true,
        location: null, // In a real app, this would be determined by geolocation API
      });
      
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        // Log failed login attempt
        if (username) {
          const existing = await storage.getUserByUsername(username);
          if (existing) {
            await storage.logUserLogin({
              userId: existing.id,
              ipAddress: req.ip,
              userAgent: req.headers["user-agent"] || "",
              success: false,
              location: null,
            });
          }
        }
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Log failed login attempt
        await storage.logUserLogin({
          userId: user.id,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"] || "",
          success: false,
          location: null,
        });
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Create session
      req.session.userId = user.id;
      req.session.isAdmin = user.role === "admin";
      
      // Log successful login
      await storage.logUserLogin({
        userId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || "",
        success: true,
        location: null, // In a real app, this would be determined by geolocation API
      });
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // KYC submission endpoint
  app.post("/api/kyc/submit", authMiddleware, async (req, res) => {
    try {
      const kycData = kycSubmissionSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      
      const result = await storage.createOrUpdateKyc(kycData);
      
      res.status(201).json({
        id: result.id,
        status: result.status,
        message: "KYC submission successful and pending review",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid KYC data", errors: error.errors });
      }
      console.error("Error submitting KYC:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/kyc/status", authMiddleware, async (req, res) => {
    try {
      const kyc = await storage.getKycByUserId(req.session.userId);
      
      if (!kyc) {
        return res.json({ status: "not_submitted" });
      }
      
      res.json({
        status: kyc.status,
        submittedAt: kyc.createdAt,
        verifiedAt: kyc.verifiedAt,
        rejectionReason: kyc.rejectionReason,
      });
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", authMiddleware, isAdmin, getAllUsers);
  app.get("/api/admin/users/:userId/kyc", authMiddleware, isAdmin, getUserKyc);
  app.put("/api/admin/users/:userId/kyc", authMiddleware, isAdmin, updateKycStatus);
  app.get("/api/admin/users/:userId/login-history", authMiddleware, isAdmin, getUserLoginHistory);
  app.get("/api/admin/logs", authMiddleware, isAdmin, getAdminLogs);

  // Games API
  app.get("/api/games", (_req, res) => {
    try {
      // In a real app, this would fetch from a database
      res.json([
        {
          id: "1",
          title: "Bitcoin Trading Bot",
          description: "Automated trading bot for Bitcoin and other cryptocurrencies",
          price: 0.01,
          category: "tools",
          releaseDate: "2023-03-15T00:00:00Z",
          rating: 4.5,
          publisher: "AUTTOBI",
        },
        {
          id: "2",
          title: "Ethereum Portfolio Manager",
          description: "Manage and track your Ethereum-based assets",
          price: 0.005,
          category: "finance",
          releaseDate: "2023-04-22T00:00:00Z",
          rating: 4.7,
          publisher: "AUTTOBI",
        }
      ]);
    } catch (error) {
      console.error("Error fetching games:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/games/:id", (req, res) => {
    try {
      const { id } = req.params;
      // Mock implementation
      const game = {
        id,
        title: id === "1" ? "Bitcoin Trading Bot" : "Ethereum Portfolio Manager",
        description: id === "1" 
          ? "Automated trading bot for Bitcoin and other cryptocurrencies" 
          : "Manage and track your Ethereum-based assets",
        price: id === "1" ? 0.01 : 0.005,
        category: id === "1" ? "tools" : "finance",
        releaseDate: "2023-03-15T00:00:00Z",
        rating: 4.5,
        publisher: "AUTTOBI",
      };
      
      res.json(game);
    } catch (error) {
      console.error(`Error fetching game ${req.params.id}:`, error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Wallet API
  app.post("/api/wallet/transaction", authMiddleware, (req, res) => {
    try {
      const transaction = walletTransactionSchema.parse(req.body);
      
      // In a real app, this would process a blockchain transaction
      res.status(201).json({
        ...transaction,
        transactionHash: transaction.transactionHash || `0x${Math.random().toString(16).substr(2, 40)}`,
        timestamp: new Date().toISOString(),
        status: "confirmed",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      console.error("Error processing transaction:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/wallet/transactions", authMiddleware, (_req, res) => {
    try {
      // In a real app, this would fetch from a database
      res.json([
        {
          fromAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
          toAddress: "0x1234567890123456789012345678901234567890",
          amount: 0.5,
          transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          status: "confirmed",
        },
        {
          fromAddress: "0x1234567890123456789012345678901234567890",
          toAddress: "0x9876543210987654321098765432109876543210",
          amount: 0.2,
          transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          status: "confirmed",
        }
      ]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
