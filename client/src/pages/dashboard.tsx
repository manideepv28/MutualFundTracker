import { useState, useEffect } from "react";
import { LocalStorage } from "@/lib/storage";
import { getCurrentNAV } from "@/lib/fund-data";
import type { Fund } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddFundModal } from "@/components/add-fund-modal";
import { DollarSign, TrendingUp, TrendingDown, Plus, IndianRupee, LineChart, Percent } from "lucide-react";

interface DashboardProps {
  userId: number;
}

export function Dashboard({ userId }: DashboardProps) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [showAddFund, setShowAddFund] = useState(false);

  useEffect(() => {
    loadFunds();
  }, [userId]);

  const loadFunds = () => {
    setFunds(LocalStorage.getFunds(userId));
  };

  const calculatePortfolioMetrics = () => {
    if (funds.length === 0) {
      return {
        totalInvestment: 0,
        currentValue: 0,
        totalGains: 0,
        returnPercentage: 0,
      };
    }

    let totalInvestment = 0;
    let currentValue = 0;

    funds.forEach(fund => {
      const investment = parseFloat(fund.investment);
      const units = parseFloat(fund.units);
      const currentNAV = getCurrentNAV(fund.fundName);
      const fundCurrentValue = units * currentNAV;
      
      totalInvestment += investment;
      currentValue += fundCurrentValue;
    });

    const totalGains = currentValue - totalInvestment;
    const returnPercentage = totalInvestment > 0 ? ((totalGains / totalInvestment) * 100) : 0;

    return {
      totalInvestment,
      currentValue,
      totalGains,
      returnPercentage,
    };
  };

  const metrics = calculatePortfolioMetrics();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
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
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h2>
          <p className="text-gray-600">Overview of your mutual fund investments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalInvestment)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <IndianRupee className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Current Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.currentValue)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <LineChart className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Gains</p>
                <p className={`text-2xl font-bold ${metrics.totalGains >= 0 ? 'text-success' : 'text-error'}`}>
                  {metrics.totalGains >= 0 ? '+' : ''}{formatCurrency(Math.abs(metrics.totalGains))}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                {metrics.totalGains >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-warning" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-error" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Return %</p>
                <p className={`text-2xl font-bold ${metrics.returnPercentage >= 0 ? 'text-success' : 'text-error'}`}>
                  {metrics.returnPercentage >= 0 ? '+' : ''}{metrics.returnPercentage.toFixed(2)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Percent className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Performance Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Fund Performance</CardTitle>
            <Button onClick={() => setShowAddFund(true)} className="bg-primary hover:bg-blue-700">
              <Plus className="mr-1 h-4 w-4" />
              Add Fund
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {funds.length === 0 ? (
            <div className="text-center py-8">
              <LineChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">No funds added yet</h3>
              <p className="text-gray-400 mb-4">Start by adding your first mutual fund</p>
              <Button onClick={() => setShowAddFund(true)} className="bg-primary hover:bg-blue-700">
                Add Your First Fund
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund Name</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Gains/Loss</TableHead>
                  <TableHead>Return %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funds.map((fund) => {
                  const fundMetrics = getFundMetrics(fund);
                  return (
                    <TableRow key={fund.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{fund.fundName}</div>
                          <div className="text-sm text-gray-500">
                            Added {new Date(fund.purchaseDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{parseFloat(fund.units).toFixed(3)}</TableCell>
                      <TableCell>{formatCurrency(fundMetrics.investment)}</TableCell>
                      <TableCell>{formatCurrency(fundMetrics.currentValue)}</TableCell>
                      <TableCell className={fundMetrics.gains >= 0 ? 'text-success' : 'text-error'}>
                        {fundMetrics.gains >= 0 ? '+' : ''}{formatCurrency(Math.abs(fundMetrics.gains))}
                      </TableCell>
                      <TableCell className={fundMetrics.returnPercent >= 0 ? 'text-success' : 'text-error'}>
                        {fundMetrics.returnPercent >= 0 ? '+' : ''}{fundMetrics.returnPercent.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddFundModal
        isOpen={showAddFund}
        onClose={() => setShowAddFund(false)}
        userId={userId}
        onFundAdded={loadFunds}
      />
    </div>
  );
}
