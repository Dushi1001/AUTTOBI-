import { Request, Response } from "express";
import { db } from "./db";
import { kyc, users, loginHistory, adminLogs, adminLogs as adminLogsSchema } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

// Middleware to check if user is admin
export const isAdmin = async (req: Request, res: Response, next: any) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.session.userId));
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all users with KYC status
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      lastIpAddress: users.lastIpAddress,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt
    }).from(users);
    
    // Get KYC data for each user
    const usersWithKyc = await Promise.all(
      allUsers.map(async (user) => {
        const [kycData] = await db.select()
          .from(kyc)
          .where(eq(kyc.userId, user.id));
          
        const [lastLogin] = await db.select()
          .from(loginHistory)
          .where(eq(loginHistory.userId, user.id))
          .orderBy(desc(loginHistory.loginTime))
          .limit(1);
          
        return {
          ...user,
          kycStatus: kycData?.status || 'not_submitted',
          lastIpAddress: lastLogin?.ipAddress || user.lastIpAddress,
          lastLoginTime: lastLogin?.loginTime || user.lastLogin
        };
      })
    );
    
    res.json(usersWithKyc);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get KYC details for a specific user
export const getUserKyc = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  
  try {
    const [kycData] = await db.select()
      .from(kyc)
      .where(eq(kyc.userId, userId));
      
    if (!kycData) {
      return res.status(404).json({ error: "KYC data not found for this user" });
    }
    
    res.json(kycData);
  } catch (error) {
    console.error("Error fetching KYC data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update KYC status
export const updateKycStatus = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const { status, rejectionReason } = req.body;
  
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  
  if (!['pending', 'verified', 'rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid status. Must be 'pending', 'verified', or 'rejected'" });
  }
  
  if (status === 'rejected' && !rejectionReason) {
    return res.status(400).json({ error: "Rejection reason is required when rejecting KYC" });
  }
  
  try {
    // Get existing KYC data
    const [existingKyc] = await db.select()
      .from(kyc)
      .where(eq(kyc.userId, userId));
      
    if (!existingKyc) {
      return res.status(404).json({ error: "KYC data not found for this user" });
    }
    
    // Update KYC status
    const updateData: any = { 
      status,
      updatedAt: new Date()
    };
    
    if (status === 'verified') {
      updateData.verifiedAt = new Date();
      updateData.rejectionReason = null;
    } else if (status === 'rejected') {
      updateData.verifiedAt = null;
      updateData.rejectionReason = rejectionReason;
    }
    
    const [updatedKyc] = await db
      .update(kyc)
      .set(updateData)
      .where(eq(kyc.userId, userId))
      .returning();
    
    // Log admin action
    await db.insert(adminLogsSchema).values({
      adminId: req.session.userId!,
      action: `kyc_${status}`,
      targetUserId: userId,
      details: {
        previousStatus: existingKyc.status,
        newStatus: status,
        rejectionReason: rejectionReason || null
      },
      ipAddress: req.ip
    });
    
    res.json(updatedKyc);
  } catch (error) {
    console.error("Error updating KYC status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user login history
export const getUserLoginHistory = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  
  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  
  try {
    const history = await db.select()
      .from(loginHistory)
      .where(eq(loginHistory.userId, userId))
      .orderBy(desc(loginHistory.loginTime))
      .limit(50);
      
    res.json(history);
  } catch (error) {
    console.error("Error fetching login history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get admin logs
export const getAdminLogs = async (req: Request, res: Response) => {
  try {
    const logs = await db.select({
      id: adminLogs.id,
      action: adminLogs.action,
      details: adminLogs.details,
      timestamp: adminLogs.timestamp,
      ipAddress: adminLogs.ipAddress,
      adminId: adminLogs.adminId,
      adminUsername: users.username,
      targetUserId: adminLogs.targetUserId
    })
    .from(adminLogs)
    .leftJoin(users, eq(adminLogs.adminId, users.id))
    .orderBy(desc(adminLogs.timestamp))
    .limit(100);
    
    res.json(logs);
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};