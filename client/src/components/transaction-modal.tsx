import { useState, useEffect } from "react";
import { LocalStorage } from "@/lib/storage";
import { getCurrentNAV } from "@/lib/fund-data";
import type { Fund } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onTransactionAdded: () => void;
}

export function TransactionModal({ isOpen, onClose, userId, onTransactionAdded }: TransactionModalProps) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [formData, setFormData] = useState({
    fundId: '',
    type: '',
    amount: '',
    nav: '',
    date: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFunds(LocalStorage.getFunds(userId));
    }
  }, [isOpen, userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFundSelect = (fundId: string) => {
    const fund = funds.find(f => f.id.toString() === fundId);
    if (fund) {
      setFormData(prev => ({
        ...prev,
        fundId,
        nav: getCurrentNAV(fund.fundName).toString()
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const fund = funds.find(f => f.id.toString() === formData.fundId);
    if (!fund) return;

    const amount = parseFloat(formData.amount);
    const nav = parseFloat(formData.nav);
    const units = amount / nav;

    try {
      // Add transaction
      LocalStorage.addTransaction(userId, {
        fundId: parseInt(formData.fundId),
        fundName: fund.fundName,
        type: formData.type,
        amount: formData.amount,
        nav: formData.nav,
        units: units.toString(),
        date: formData.date,
      });

      // Update fund units and investment
      const currentUnits = parseFloat(fund.units);
      const currentInvestment = parseFloat(fund.investment);

      let newUnits = currentUnits;
      let newInvestment = currentInvestment;

      if (formData.type === 'purchase' || formData.type === 'sip') {
        newUnits += units;
        newInvestment += amount;
      } else if (formData.type === 'redemption') {
        newUnits = Math.max(0, currentUnits - units);
        newInvestment = Math.max(0, currentInvestment - amount);
      }

      LocalStorage.updateFund(userId, fund.id, {
        units: newUnits.toString(),
        investment: newInvestment.toString(),
      });

      toast({ title: "Success", description: "Transaction added successfully!" });
      onTransactionAdded();
      onClose();
      setFormData({
        fundId: '',
        type: '',
        amount: '',
        nav: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      toast({ 
        variant: "destructive",
        title: "Error", 
        description: "Failed to add transaction. Please try again." 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fundId">Fund</Label>
            <Select value={formData.fundId} onValueChange={handleFundSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a fund" />
              </SelectTrigger>
              <SelectContent>
                {funds.map(fund => (
                  <SelectItem key={fund.id} value={fund.id.toString()}>
                    {fund.fundName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="type">Transaction Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="redemption">Redemption</SelectItem>
                <SelectItem value="sip">SIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="nav">NAV (₹)</Label>
              <Input
                id="nav"
                name="nav"
                type="number"
                step="0.01"
                value={formData.nav}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="date">Transaction Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-primary hover:bg-blue-700">
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
