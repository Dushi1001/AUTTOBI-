import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

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

export async function registerRoutes(app: Express): Promise<Server> {
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
      
      // Create user
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword,
      });
      
      res.status(201).json({
        id: user.id,
        username: user.username,
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
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      
      res.json({
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Games API
  app.get("/api/games", (_req, res) => {
    try {
      // In a real app, this would fetch from a database
      res.json([
        {
          id: "1",
          title: "Cyberpunk Arena",
          description: "A futuristic battle arena game with advanced cybernetic augmentations.",
          price: 59.99,
          category: "action",
          releaseDate: "2023-03-15T00:00:00Z",
          rating: 4.5,
          publisher: "Future Games",
        },
        {
          id: "2",
          title: "Stellar Command",
          description: "Command a fleet of starships and conquer the galaxy.",
          price: 49.99,
          category: "strategy",
          releaseDate: "2023-04-22T00:00:00Z",
          rating: 4.7,
          publisher: "Galaxy Studios",
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
        title: id === "1" ? "Cyberpunk Arena" : "Stellar Command",
        description: "Game description here",
        price: 59.99,
        category: "action",
        releaseDate: "2023-03-15T00:00:00Z",
        rating: 4.5,
        publisher: "Game Studio",
      };
      
      res.json(game);
    } catch (error) {
      console.error(`Error fetching game ${req.params.id}:`, error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Wallet API
  app.post("/api/wallet/transaction", (req, res) => {
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

  app.get("/api/wallet/transactions", (_req, res) => {
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
