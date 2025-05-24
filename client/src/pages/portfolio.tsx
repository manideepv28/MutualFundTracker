import { useState, useEffect } from "react";
import { LocalStorage } from "@/lib/storage";
import { getCurrentNAV } from "@/lib/fund-data";
import type { Fund } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddFundModal } from "@/components/add-fund-modal";
import { Briefcase, Plus, TrendingUp, TrendingDown } from "lucide-react";

interface PortfolioProps {
  userId: number;
}

export function Portfolio({ userId }: PortfolioProps) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [showAddFund, setShowAddFund] = useState(false);

  useEffect(() => {
    loadFunds();
  }, [userId]);

  const loadFunds = () => {
    setFunds(LocalStorage.getFunds(userId));
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getFundMetrics = (fund: Fund) => {
    const investment = parseFloat(fund.investment);
    const units = parseFloat(fund.units);
    const purchaseNAV = parseFloat(fund.purchaseNAV);
    const currentNAV = getCurrentNAV(fund.fundName);
    const currentValue = units * currentNAV;
    const gains = currentValue - investment;
    const returnPercent = investment > 0 ? ((gains / investment) * 100) : 0;

    return {
      investment,
      currentValue,
      gains,
      returnPercent,
      currentNAV,
      purchaseNAV,
      units,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Portfolio</h2>
          <p className="text-gray-600">Manage your mutual fund holdings</p>
        </div>
        <Button onClick={() => setShowAddFund(true)} className="bg-primary hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Fund
        </Button>
      </div>

      {funds.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No Funds in Portfolio</h3>
          <p className="text-gray-400 mb-6">Start building your portfolio by adding mutual funds</p>
          <Button onClick={() => setShowAddFund(true)} className="bg-primary hover:bg-blue-700">
            Add Your First Fund
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funds.map((fund) => {
            const metrics = getFundMetrics(fund);
            return (
              <Card key={fund.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{fund.fundName}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Added {new Date(fund.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`flex items-center ${metrics.returnPercent >= 0 ? 'text-success' : 'text-error'}`}>
                      {metrics.returnPercent >= 0 ? (
                        <TrendingUp className="mr-1 h-4 w-4" />
                      ) : (
                        <TrendingDown className="mr-1 h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">
                        {metrics.returnPercent >= 0 ? '+' : ''}{metrics.returnPercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Units:</span>
                    <span className="text-sm font-medium">{metrics.units.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Investment:</span>
                    <span className="text-sm font-medium">{formatCurrency(metrics.investment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Value:</span>
                    <span className="text-sm font-medium">{formatCurrency(metrics.currentValue)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">Gains/Loss:</span>
                    <span className={`text-sm font-medium ${metrics.gains >= 0 ? 'text-success' : 'text-error'}`}>
                      {metrics.gains >= 0 ? '+' : ''}{formatCurrency(Math.abs(metrics.gains))}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Purchase NAV: ₹{metrics.purchaseNAV.toFixed(2)}</span>
                      <span>Current NAV: ₹{metrics.currentNAV.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddFundModal
        isOpen={showAddFund}
        onClose={() => setShowAddFund(false)}
        userId={userId}
        onFundAdded={loadFunds}
      />
    </div>
  );
}
