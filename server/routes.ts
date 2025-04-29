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

  // Crypto Market API
  app.get("/api/market", authMiddleware, (_req, res) => {
    try {
      // In a real app, this would fetch from a cryptocurrency API
      res.json([
        {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 62415.78,
          market_cap: 1223567890123,
          market_cap_rank: 1,
          price_change_percentage_24h: 2.35,
          circulating_supply: 19568431,
          image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
        },
        {
          id: "ethereum",
          symbol: "ETH",
          name: "Ethereum",
          current_price: 3050.42,
          market_cap: 367890123456,
          market_cap_rank: 2,
          price_change_percentage_24h: 1.87,
          circulating_supply: 120250891,
          image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
        },
        {
          id: "binancecoin",
          symbol: "BNB",
          name: "BNB",
          current_price: 605.32,
          market_cap: 93245678901,
          market_cap_rank: 3,
          price_change_percentage_24h: 0.95,
          circulating_supply: 153856150,
          image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png"
        }
      ]);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/market/:id", authMiddleware, (req, res) => {
    try {
      const { id } = req.params;
      // Mock implementation - in real app would fetch from cryptocurrency API
      let coin;
      
      if (id === "bitcoin") {
        coin = {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          current_price: 62415.78,
          market_cap: 1223567890123,
          market_cap_rank: 1,
          price_change_percentage_24h: 2.35,
          circulating_supply: 19568431,
          image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          description: "Bitcoin is the first decentralized cryptocurrency, based on blockchain technology.",
          links: {
            homepage: ["https://bitcoin.org/"],
            blockchain_site: ["https://blockchair.com/bitcoin/", "https://btc.com/", "https://btc.tokenview.io/"]
          },
          market_data: {
            ath: 69045,
            ath_date: "2021-11-10T14:24:11.849Z",
            atl: 67.81,
            atl_date: "2013-07-06T00:00:00.000Z"
          }
        };
      } else if (id === "ethereum") {
        coin = {
          id: "ethereum",
          symbol: "ETH",
          name: "Ethereum",
          current_price: 3050.42,
          market_cap: 367890123456,
          market_cap_rank: 2,
          price_change_percentage_24h: 1.87,
          circulating_supply: 120250891,
          image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
          description: "Ethereum is a decentralized, open-source blockchain with smart contract functionality.",
          links: {
            homepage: ["https://ethereum.org/"],
            blockchain_site: ["https://etherscan.io/", "https://ethplorer.io/", "https://blockchair.com/ethereum"]
          },
          market_data: {
            ath: 4878.26,
            ath_date: "2021-11-10T14:24:19.604Z",
            atl: 0.432979,
            atl_date: "2015-10-20T00:00:00.000Z"
          }
        };
      } else {
        coin = {
          id: "binancecoin",
          symbol: "BNB",
          name: "BNB",
          current_price: 605.32,
          market_cap: 93245678901,
          market_cap_rank: 3,
          price_change_percentage_24h: 0.95,
          circulating_supply: 153856150,
          image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
          description: "Binance Coin (BNB) is a cryptocurrency used to pay fees on the Binance exchange.",
          links: {
            homepage: ["https://www.binance.com/"],
            blockchain_site: ["https://bscscan.com/", "https://explorer.binance.org/", "https://etherscan.io/token/0xB8c77482e45F1F44dE1745F52C74426C631bDD52"]
          },
          market_data: {
            ath: 690.93,
            ath_date: "2021-05-10T07:30:56.008Z",
            atl: 0.0398177,
            atl_date: "2017-10-19T00:00:00.000Z"
          }
        };
      }
      
      res.json(coin);
    } catch (error) {
      console.error(`Error fetching market data for ${req.params.id}:`, error);
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

  // Support & FAQ API
  app.get("/api/faq", (_req, res) => {
    try {
      // In a real app, this would fetch from a database
      res.json([
        {
          id: 1,
          category: "account",
          question: "How do I verify my account?",
          answer: "To verify your account, go to your profile settings and navigate to the KYC verification section. Upload the required documents (government-issued ID, proof of address, and a selfie). Our team will review your submission within 1-2 business days."
        },
        {
          id: 2,
          category: "account",
          question: "What is KYC verification and why is it required?",
          answer: "KYC (Know Your Customer) verification is a standard process in the financial industry to verify the identity of users. It helps prevent fraud, money laundering, and ensures compliance with regulations. We require KYC verification to protect our platform and users."
        },
        {
          id: 3,
          category: "wallet",
          question: "How do I deposit cryptocurrency to my wallet?",
          answer: "To deposit cryptocurrency, go to your wallet page and click 'Deposit'. Select the cryptocurrency you wish to deposit and use the provided wallet address or QR code to send funds from your external wallet."
        },
        {
          id: 4,
          category: "wallet",
          question: "What are the withdrawal fees?",
          answer: "Withdrawal fees vary by cryptocurrency and network conditions. When making a withdrawal, the current fee will be displayed before you confirm the transaction. We aim to keep fees as low as possible while ensuring timely processing."
        },
        {
          id: 5,
          category: "security",
          question: "How can I enable two-factor authentication (2FA)?",
          answer: "To enable 2FA, go to your security settings, select 'Two-Factor Authentication', and follow the prompts to set up with an authenticator app like Google Authenticator or Authy. This adds an extra layer of security to your account."
        },
        {
          id: 6,
          category: "security",
          question: "What should I do if I suspect unauthorized access to my account?",
          answer: "If you suspect unauthorized access, immediately change your password, enable 2FA if not already active, and contact our support team. We recommend reviewing your recent activity and ensuring your email account is also secure."
        },
        {
          id: 7,
          category: "trading",
          question: "What trading pairs are available on the platform?",
          answer: "We offer a wide range of trading pairs including BTC/USD, ETH/USD, BNB/USD, and many other major cryptocurrencies paired with USD, EUR, and BTC. Visit our market page to see all available trading pairs."
        },
        {
          id: 8,
          category: "support",
          question: "How can I contact customer support?",
          answer: "You can contact our customer support team through the help center on our platform, by email at support@auttobi.com, or through the live chat feature available during business hours. We aim to respond to all inquiries within 24 hours."
        }
      ]);
    } catch (error) {
      console.error("Error fetching FAQ:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/support/categories", (_req, res) => {
    try {
      res.json([
        {
          id: "account",
          name: "Account Issues",
          description: "Questions about account setup, verification, and management"
        },
        {
          id: "wallet",
          name: "Wallet & Transactions",
          description: "Help with deposits, withdrawals, and transaction issues"
        },
        {
          id: "security",
          name: "Security",
          description: "Account security, 2FA, and protecting your assets"
        },
        {
          id: "trading",
          name: "Trading",
          description: "Questions about trading features and functionality"
        },
        {
          id: "technical",
          name: "Technical Issues",
          description: "Help with platform technical problems"
        }
      ]);
    } catch (error) {
      console.error("Error fetching support categories:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Contact Support API endpoint
  app.post("/api/support/contact", authMiddleware, (req, res) => {
    try {
      const { subject, category, message } = req.body;
      
      if (!subject || !category || !message) {
        return res.status(400).json({ message: "Subject, category, and message are required" });
      }
      
      // In a real app, this would save to a database and possibly send an email
      const supportTicket = {
        id: `TICKET-${Date.now()}`,
        userId: req.session.userId,
        subject,
        category,
        message,
        status: "open",
        createdAt: new Date().toISOString()
      };
      
      res.status(201).json({
        id: supportTicket.id,
        status: supportTicket.status,
        message: "Your support ticket has been submitted successfully"
      });
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
