import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { insertUserSchema, insertTransactionSchema, insertSavedPlaceSchema, insertHotelBookingSchema, insertBookedPlanSchema } from "@shared/schema";

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const user = await storage.getUserBySessionToken(token);
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({ username, password: hashedPassword });
      
      // Generate session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      await storage.updateUserSession(user.id, sessionToken, expiryDate);
      
      res.json({ 
        token: sessionToken, 
        user: { 
          id: user.id, 
          username: user.username, 
          language: user.language 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      const updatedUser = await storage.updateUserSession(user.id, sessionToken, expiryDate);
      
      res.json({ 
        token: sessionToken, 
        user: { 
          id: updatedUser!.id, 
          username: updatedUser!.username, 
          language: updatedUser!.language 
        } 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      language: req.user.language
    });
  });

  app.post("/api/auth/logout", authenticateToken, async (req: any, res) => {
    try {
      await storage.clearUserSession(req.user.id);
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/activity", authenticateToken, async (req: any, res) => {
    try {
      await storage.updateUserActivity(req.user.id);
      res.json({ message: "Activity updated" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/auth/language", authenticateToken, async (req: any, res) => {
    try {
      const { language } = req.body;
      const updatedUser = await storage.updateUserLanguage(req.user.id, language);
      res.json({
        id: updatedUser!.id,
        username: updatedUser!.username,
        language: updatedUser!.language
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Transaction routes
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/transactions", authenticateToken, async (req: any, res) => {
    try {
      const transactions = await storage.getTransactionsByUser(req.user.id);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransactionById(id);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/transactions/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const transaction = await storage.updateTransactionStatus(id, status);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Saved Places routes
  app.get("/api/saved-places", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const savedPlaces = await storage.getSavedPlacesByUser(parseInt(userId));
      res.json(savedPlaces);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/saved-places", async (req, res) => {
    try {
      const validatedData = insertSavedPlaceSchema.parse(req.body);
      const savedPlace = await storage.createSavedPlace(validatedData);
      res.json(savedPlace);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/saved-places", async (req, res) => {
    try {
      const { userId, placeId } = req.body;
      if (!userId || !placeId) {
        return res.status(400).json({ error: "userId and placeId are required" });
      }
      await storage.removeSavedPlace(parseInt(userId), placeId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/saved-places/check", async (req, res) => {
    try {
      const { userId, placeId } = req.query;
      if (!userId || !placeId) {
        return res.status(400).json({ error: "userId and placeId are required" });
      }
      const isSaved = await storage.isPlaceSaved(parseInt(userId as string), placeId as string);
      res.json({ isSaved });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Hotel booking routes
  app.post("/api/hotel-bookings", async (req, res) => {
    try {
      const bookingData = {
        ...req.body,
        userId: req.body.userId || 1 // Mock user ID for now
      };
      
      const booking = await storage.createHotelBooking(bookingData);
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/hotel-bookings", async (req, res) => {
    try {
      const userId = req.query.userId || 1; // Mock user ID for now
      const bookings = await storage.getHotelBookingsByUser(parseInt(userId as string));
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/hotel-bookings/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const booking = await storage.updateHotelBookingStatus(parseInt(id), status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Booked Plans routes
  app.post("/api/booked-plans", authenticateToken, async (req: any, res) => {
    try {
      const planData = insertBookedPlanSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const plan = await storage.createBookedPlan(planData);
      res.json(plan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/booked-plans", authenticateToken, async (req: any, res) => {
    try {
      const plans = await storage.getBookedPlansByUser(req.user.id);
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/booked-plans/:id", authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getBookedPlanById(id);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      // Check if the plan belongs to the authenticated user
      if (plan.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(plan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/booked-plans/:id/status", authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      // Check if the plan belongs to the authenticated user
      const existingPlan = await storage.getBookedPlanById(id);
      if (!existingPlan || existingPlan.userId !== req.user.id) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      const plan = await storage.updateBookedPlanStatus(id, status);
      res.json(plan);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
