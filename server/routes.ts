import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { insertUserSchema, insertTransactionSchema, insertSavedPlaceSchema, insertHotelBookingSchema, insertBookedPlanSchema, insertGuideBookingSchema, insertGuideMessageSchema, insertGuideNotificationSchema } from "@shared/schema";
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

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
  // Helper function to generate session token
  const generateSessionToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
  };

  // Admin authentication middleware
  const adminAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.sendStatus(401);
    }

    try {
      const user = await storage.getUserBySessionToken(token);
      if (!user || user.role !== 'admin') {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    } catch (error) {
      return res.sendStatus(403);
    }
  };

  // New unified authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { name, email, password, role = "user" } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create username from email
      const username = email.split('@')[0];
      
      // Create user
      const user = await storage.createUser({ 
        username,
        email, 
        password: hashedPassword,
        name,
        role,
        isRegistrationComplete: role === "user" // Users complete registration immediately, guides need more steps
      });
      
      // Generate session token
      const sessionToken = generateSessionToken();
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      await storage.updateUserSession(user.id, sessionToken, expiryDate);
      
      res.json({ 
        token: sessionToken, 
        user: { 
          id: user.id, 
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          isRegistrationComplete: user.isRegistrationComplete,
          language: user.language 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password, role } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check role mismatch
      if (user.role !== role) {
        return res.status(401).json({ 
          error: `This account is registered as a ${user.role === "guide" ? "Local Guide" : "User"}. Please switch the toggle.` 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate session token
      const sessionToken = generateSessionToken();
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      await storage.updateUserSession(user.id, sessionToken, expiryDate);
      
      res.json({ 
        token: sessionToken, 
        user: { 
          id: user.id, 
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          isRegistrationComplete: user.isRegistrationComplete,
          language: user.language 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    res.json(req.user);
  });

  app.post("/api/auth/logout", authenticateToken, async (req: any, res) => {
    try {
      await storage.clearUserSession(req.user.id);
      res.json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Guide profile completion route
  app.post("/api/auth/complete-guide-profile", authenticateToken, async (req: any, res) => {
    try {
      const guideData = req.body;
      
      // Ensure the user is a guide
      if (req.user.role !== "guide") {
        return res.status(403).json({ error: "Only guides can complete guide profiles" });
      }

      const updatedUser = await storage.updateUserGuideProfile(req.user.id, {
        ...guideData,
        profileCompleted: true,
        isRegistrationComplete: true
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          isRegistrationComplete: updatedUser.isRegistrationComplete,
          profileCompleted: updatedUser.profileCompleted,
          language: updatedUser.language,
          // Include guide-specific fields
          bio: updatedUser.bio,
          phone: updatedUser.phone,
          experience: updatedUser.experience,
          certification: updatedUser.certification,
          hourlyRate: updatedUser.hourlyRate,
          serviceAreas: updatedUser.serviceAreas,
          languages: updatedUser.languages,
          tourInterests: updatedUser.tourInterests,
          profileImageUrl: updatedUser.profileImageUrl,
          rating: updatedUser.rating,
          totalReviews: updatedUser.totalReviews,
          totalEarnings: updatedUser.totalEarnings,
          completedTours: updatedUser.completedTours
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Original authentication routes (legacy support)
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

  // Admin Dashboard API Routes
  app.get("/api/admin/stats", adminAuth, async (req, res) => {
    try {
      const userStats = await storage.getUserStats();
      const bookingStats = await storage.getBookingStats();
      const revenueStats = await storage.getRevenueStats();

      res.json({
        userStats,
        bookingStats,
        revenueStats
      });
    } catch (error: any) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch admin stats" });
    }
  });

  app.get("/api/admin/users", adminAuth, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/bookings", adminAuth, async (req, res) => {
    try {
      const hotelBookings = await storage.getAllHotelBookings();
      const bookedPlans = await storage.getAllBookedPlans();
      
      // Combine both types of bookings
      const allBookings = [
        ...hotelBookings.map(booking => ({ ...booking, type: 'hotel' })),
        ...bookedPlans.map(plan => ({ ...plan, type: 'plan' }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.json(hotelBookings); // For now, just return hotel bookings as they have more complete structure
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/admin/feedback", adminAuth, async (req, res) => {
    try {
      const feedback = await storage.getAllAdminFeedback();
      res.json(feedback);
    } catch (error: any) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.put("/api/admin/feedback/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      
      const updatedFeedback = await storage.updateAdminFeedbackStatus(
        parseInt(id), 
        status, 
        adminNotes
      );

      if (!updatedFeedback) {
        return res.status(404).json({ error: "Feedback not found" });
      }

      res.json(updatedFeedback);
    } catch (error: any) {
      console.error("Error updating feedback:", error);
      res.status(500).json({ error: "Failed to update feedback" });
    }
  });

  app.get("/api/admin/ai-usage", adminAuth, async (req, res) => {
    try {
      const aiUsage = await storage.getAdminAiUsage();
      res.json(aiUsage);
    } catch (error: any) {
      console.error("Error fetching AI usage:", error);
      res.status(500).json({ error: "Failed to fetch AI usage" });
    }
  });

  app.get("/api/admin/tour-requests", adminAuth, async (req, res) => {
    try {
      const tourRequests = await storage.getTourRequestsForAdmin();
      res.json(tourRequests);
    } catch (error: any) {
      console.error("Error fetching tour requests:", error);
      res.status(500).json({ error: "Failed to fetch tour requests" });
    }
  });

  app.post("/api/admin/feedback", authenticateToken, async (req, res) => {
    try {
      const { rating, category, feedbackText, tripId, guideId } = req.body;
      const userId = req.user.id;
      const userType = req.user.role;

      const feedback = await storage.createAdminFeedback({
        userId,
        userType,
        rating,
        category,
        feedbackText,
        tripId,
        guideId
      });

      res.json(feedback);
    } catch (error: any) {
      console.error("Error creating feedback:", error);
      res.status(500).json({ error: "Failed to create feedback" });
    }
  });

  app.post("/api/admin/ai-usage", authenticateToken, async (req, res) => {
    try {
      const { serviceType, requestType, tokensUsed, responseTime, success, errorMessage, requestData, responseData } = req.body;
      const userId = req.user.id;

      const usage = await storage.createAdminAiUsage({
        userId,
        serviceType,
        requestType,
        tokensUsed,
        responseTime,
        success,
        errorMessage,
        requestData,
        responseData
      });

      res.json(usage);
    } catch (error: any) {
      console.error("Error recording AI usage:", error);
      res.status(500).json({ error: "Failed to record AI usage" });
    }
  });

  // Guide booking routes
  app.get("/api/guides/available", authenticateToken, async (req, res) => {
    try {
      const guides = await storage.getAvailableGuides();
      res.json(guides);
    } catch (error) {
      console.error("Error fetching available guides:", error);
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });

  app.post("/api/guide-bookings", authenticateToken, async (req, res) => {
    try {
      const result = insertGuideBookingSchema.safeParse({
        ...req.body,
        userId: req.user.id
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const booking = await storage.createGuideBooking(result.data);
      
      // Create notification for the guide
      await storage.createGuideNotification({
        userId: result.data.guideId,
        type: 'booking_request',
        title: 'New Booking Request',
        message: `New booking request for ${result.data.destination}`,
        relatedId: booking.id
      });

      res.json(booking);
    } catch (error) {
      console.error("Error creating guide booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.get("/api/guide-bookings/user", authenticateToken, async (req, res) => {
    try {
      const bookings = await storage.getGuideBookingsByUser(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/guide-bookings/guide", authenticateToken, async (req, res) => {
    try {
      const bookings = await storage.getGuideBookingsByGuide(req.user.id);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching guide bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.patch("/api/guide-bookings/:id", authenticateToken, async (req, res) => {
    try {
      const booking = await storage.updateGuideBookingStatus(parseInt(req.params.id), req.body.status);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.get("/api/guide-bookings/:id", authenticateToken, async (req, res) => {
    try {
      const booking = await storage.getGuideBookingById(parseInt(req.params.id));
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.get("/api/guide-bookings/:id/messages", authenticateToken, async (req, res) => {
    try {
      const messages = await storage.getMessagesByBooking(parseInt(req.params.id));
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/guide-bookings/:id/messages", authenticateToken, async (req, res) => {
    try {
      const result = insertGuideMessageSchema.safeParse({
        ...req.body,
        bookingId: parseInt(req.params.id),
        senderId: req.user.id,
        senderType: req.user.role || 'user'
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const message = await storage.createGuideMessage(result.data);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'join_booking') {
          // Associate this connection with a booking
          (ws as any).bookingId = message.bookingId;
          (ws as any).userId = message.userId;
        } else if (message.type === 'new_message') {
          // Broadcast to all clients in this booking room
          wss.clients.forEach((client: WebSocket) => {
            if (client !== ws && 
                client.readyState === WebSocket.OPEN && 
                (client as any).bookingId === message.bookingId) {
              client.send(JSON.stringify(message));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
