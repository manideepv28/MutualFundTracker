import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertFundSchema, insertTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, email: user.email, fullName: user.fullName } });
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ user: { id: user.id, email: user.email, fullName: user.fullName } });
    } catch (error) {
      res.status(400).json({ error: "Login failed" });
    }
  });

  // Fund routes
  app.get("/api/funds/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const funds = await storage.getUserFunds(userId);
      res.json(funds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch funds" });
    }
  });

  app.post("/api/funds", async (req, res) => {
    try {
      const fundData = insertFundSchema.parse(req.body);
      const fund = await storage.createFund(fundData);
      res.json(fund);
    } catch (error) {
      res.status(400).json({ error: "Invalid fund data" });
    }
  });

  app.put("/api/funds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const fund = await storage.updateFund(id, updates);
      
      if (!fund) {
        return res.status(404).json({ error: "Fund not found" });
      }
      
      res.json(fund);
    } catch (error) {
      res.status(400).json({ error: "Failed to update fund" });
    }
  });

  app.delete("/api/funds/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFund(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Fund not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete fund" });
    }
  });

  // Transaction routes
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
