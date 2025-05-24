import { users, funds, transactions, type User, type Fund, type Transaction, type InsertUser, type InsertFund, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Fund operations
  getUserFunds(userId: number): Promise<Fund[]>;
  createFund(fund: InsertFund): Promise<Fund>;
  updateFund(id: number, updates: Partial<Fund>): Promise<Fund | undefined>;
  deleteFund(id: number): Promise<boolean>;

  // Transaction operations
  getUserTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private funds: Map<number, Fund>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentFundId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.funds = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentFundId = 1;
    this.currentTransactionId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Fund operations
  async getUserFunds(userId: number): Promise<Fund[]> {
    return Array.from(this.funds.values()).filter(fund => fund.userId === userId);
  }

  async createFund(insertFund: InsertFund): Promise<Fund> {
    const id = this.currentFundId++;
    const fund: Fund = { 
      ...insertFund, 
      id,
      createdAt: new Date()
    };
    this.funds.set(id, fund);
    return fund;
  }

  async updateFund(id: number, updates: Partial<Fund>): Promise<Fund | undefined> {
    const fund = this.funds.get(id);
    if (fund) {
      const updatedFund = { ...fund, ...updates };
      this.funds.set(id, updatedFund);
      return updatedFund;
    }
    return undefined;
  }

  async deleteFund(id: number): Promise<boolean> {
    return this.funds.delete(id);
  }

  // Transaction operations
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(transaction => transaction.userId === userId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
