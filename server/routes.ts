import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertSavedPlaceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const transactions = await storage.getTransactionsByUser(parseInt(userId));
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

  const httpServer = createServer(app);

  return httpServer;
}
