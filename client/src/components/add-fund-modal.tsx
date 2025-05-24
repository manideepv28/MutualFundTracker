import { useState } from "react";
import { LocalStorage } from "@/lib/storage";
import { FUND_OPTIONS, getCurrentNAV } from "@/lib/fund-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AddFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  onFundAdded: () => void;
}

export function AddFundModal({ isOpen, onClose, userId, onFundAdded }: AddFundModalProps) {
  const [formData, setFormData] = useState({
    fundName: '',
    units: '',
    purchaseNAV: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFundSelect = (fundName: string) => {
    setFormData(prev => ({
      ...prev,
      fundName,
      purchaseNAV: getCurrentNAV(fundName).toString()
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const units = parseFloat(formData.units);
    const purchaseNAV = parseFloat(formData.purchaseNAV);
    const investment = units * purchaseNAV;

    try {
      LocalStorage.addFund(userId, {
        fundName: formData.fundName,
        units: formData.units,
        purchaseNAV: formData.purchaseNAV,
        purchaseDate: formData.purchaseDate,
        investment: investment.toString(),
      });

      toast({ title: "Success", description: "Fund added successfully!" });
      onFundAdded();
      onClose();
      setFormData({
        fundName: '',
        units: '',
        purchaseNAV: '',
        purchaseDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      toast({ 
        variant: "destructive",
        title: "Error", 
        description: "Failed to add fund. Please try again." 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Mutual Fund</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fundName">Fund Name</Label>
            <Select value={formData.fundName} onValueChange={handleFundSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a fund" />
              </SelectTrigger>
              <SelectContent>
                {FUND_OPTIONS.map(fund => (
                  <SelectItem key={fund} value={fund}>
                    {fund}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="units">Units</Label>
              <Input
                id="units"
                name="units"
                type="number"
                step="0.001"
                value={formData.units}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="purchaseNAV">Purchase NAV (₹)</Label>
              <Input
                id="purchaseNAV"
                name="purchaseNAV"
                type="number"
                step="0.01"
                value={formData.purchaseNAV}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-primary hover:bg-blue-700">
            Add Fund
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
