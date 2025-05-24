import { useState, useEffect } from "react";
import { LocalStorage } from "@/lib/storage";
import type { Transaction } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransactionModal } from "@/components/transaction-modal";
import { Plus, ArrowUpDown } from "lucide-react";

interface TransactionsProps {
  userId: number;
}

export function Transactions({ userId }: TransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  const loadTransactions = () => {
    const allTransactions = LocalStorage.getTransactions(userId);
    // Sort by date descending
    const sortedTransactions = allTransactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(sortedTransactions);
  };

  const formatCurrency = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'redemption':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'sip':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-gray-600">Track all your investment transactions</p>
        </div>
        <Button onClick={() => setShowAddTransaction(true)} className="bg-primary hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Card>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <ArrowUpDown className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No transactions recorded yet</h3>
              <p className="text-gray-400 mb-4">Start by adding your first transaction</p>
              <Button onClick={() => setShowAddTransaction(true)} className="bg-primary hover:bg-blue-700">
                Add Transaction
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Fund</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>NAV</TableHead>
                  <TableHead>Units</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-gray-50">
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.fundName}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(transaction.type)}>
                        {transaction.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell>₹{parseFloat(transaction.nav).toFixed(2)}</TableCell>
                    <TableCell>{parseFloat(transaction.units).toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        userId={userId}
        onTransactionAdded={loadTransactions}
      />
    </div>
  );
}
