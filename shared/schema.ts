import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const funds = pgTable("funds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fundName: text("fund_name").notNull(),
  units: decimal("units", { precision: 10, scale: 3 }).notNull(),
  purchaseNAV: decimal("purchase_nav", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: text("purchase_date").notNull(),
  investment: decimal("investment", { precision: 15, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fundId: integer("fund_id").notNull(),
  fundName: text("fund_name").notNull(),
  type: text("type").notNull(), // 'purchase', 'redemption', 'sip'
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  nav: decimal("nav", { precision: 10, scale: 2 }).notNull(),
  units: decimal("units", { precision: 10, scale: 3 }).notNull(),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  fullName: true,
});

export const insertFundSchema = createInsertSchema(funds).pick({
  userId: true,
  fundName: true,
  units: true,
  purchaseNAV: true,
  purchaseDate: true,
  investment: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  fundId: true,
  fundName: true,
  type: true,
  amount: true,
  nav: true,
  units: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFund = z.infer<typeof insertFundSchema>;
export type Fund = typeof funds.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
