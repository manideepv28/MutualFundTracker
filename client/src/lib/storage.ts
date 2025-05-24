import type { Fund, Transaction, InsertFund, InsertTransaction } from "@shared/schema";

export class LocalStorage {
  private static getFundsKey(userId: number): string {
    return `mutualTracker_funds_${userId}`;
  }

  private static getTransactionsKey(userId: number): string {
    return `mutualTracker_transactions_${userId}`;
  }

  // Fund operations
  static getFunds(userId: number): Fund[] {
    const saved = localStorage.getItem(this.getFundsKey(userId));
    return saved ? JSON.parse(saved) : [];
  }

  static saveFunds(userId: number, funds: Fund[]): void {
    localStorage.setItem(this.getFundsKey(userId), JSON.stringify(funds));
  }

  static addFund(userId: number, fundData: Omit<InsertFund, 'userId'>): Fund {
    const funds = this.getFunds(userId);
    const newFund: Fund = {
      id: Date.now(),
      userId,
      ...fundData,
      createdAt: new Date(),
    };
    
    funds.push(newFund);
    this.saveFunds(userId, funds);
    return newFund;
  }

  static updateFund(userId: number, fundId: number, updates: Partial<Fund>): void {
    const funds = this.getFunds(userId);
    const index = funds.findIndex(f => f.id === fundId);
    if (index !== -1) {
      funds[index] = { ...funds[index], ...updates };
      this.saveFunds(userId, funds);
    }
  }

  static deleteFund(userId: number, fundId: number): void {
    const funds = this.getFunds(userId).filter(f => f.id !== fundId);
    this.saveFunds(userId, funds);
  }

  // Transaction operations
  static getTransactions(userId: number): Transaction[] {
    const saved = localStorage.getItem(this.getTransactionsKey(userId));
    return saved ? JSON.parse(saved) : [];
  }

  static saveTransactions(userId: number, transactions: Transaction[]): void {
    localStorage.setItem(this.getTransactionsKey(userId), JSON.stringify(transactions));
  }

  static addTransaction(userId: number, transactionData: Omit<InsertTransaction, 'userId'>): Transaction {
    const transactions = this.getTransactions(userId);
    const newTransaction: Transaction = {
      id: Date.now(),
      userId,
      ...transactionData,
      createdAt: new Date(),
    };
    
    transactions.push(newTransaction);
    this.saveTransactions(userId, transactions);
    return newTransaction;
  }
}
