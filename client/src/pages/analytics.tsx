import { useState, useEffect } from "react";
import { LocalStorage } from "@/lib/storage";
import { getCurrentNAV } from "@/lib/fund-data";
import type { Fund } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingDown, Scale, BarChart3 } from "lucide-react";

interface AnalyticsProps {
  userId: number;
}

export function Analytics({ userId }: AnalyticsProps) {
  const [funds, setFunds] = useState<Fund[]>([]);

  useEffect(() => {
    setFunds(LocalStorage.getFunds(userId));
  }, [userId]);

  const getFundMetrics = (fund: Fund) => {
    const investment = parseFloat(fund.investment);
    const units = parseFloat(fund.units);
    const currentNAV = getCurrentNAV(fund.fundName);
    const currentValue = units * currentNAV;
    const returnPercent = investment > 0 ? ((currentValue - investment) / investment) * 100 : 0;

    return {
      ...fund,
      investment,
      currentValue,
      returnPercent,
    };
  };

  const getAnalytics = () => {
    if (funds.length === 0) {
      return {
        bestFund: null,
        worstFund: null,
        diversity: 0,
      };
    }

    const fundsWithMetrics = funds.map(getFundMetrics);
    
    const bestFund = fundsWithMetrics.reduce((best, fund) => 
      fund.returnPercent > best.returnPercent ? fund : best
    );

    const worstFund = fundsWithMetrics.reduce((worst, fund) => 
      fund.returnPercent < worst.returnPercent ? fund : worst
    );

    return {
      bestFund,
      worstFund,
      diversity: funds.length,
    };
  };

  const analytics = getAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Analytics</h2>
        <p className="text-gray-600">Detailed insights and performance analysis</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-success flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Best Performing Fund
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.bestFund ? (
              <div className="text-center">
                <div className="mb-2">
                  <p className="font-semibold">{analytics.bestFund.fundName}</p>
                  <p className="text-success text-lg font-bold">
                    +{analytics.bestFund.returnPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Trophy className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-error flex items-center">
              <TrendingDown className="mr-2 h-5 w-5" />
              Worst Performing Fund
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.worstFund ? (
              <div className="text-center">
                <div className="mb-2">
                  <p className="font-semibold">{analytics.worstFund.fundName}</p>
                  <p className="text-error text-lg font-bold">
                    {analytics.worstFund.returnPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <TrendingDown className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-primary flex items-center">
              <Scale className="mr-2 h-5 w-5" />
              Portfolio Diversity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{analytics.diversity}</p>
              <p className="text-sm text-gray-500">funds in portfolio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Performance Comparison */}
      {funds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Fund Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funds.map((fund) => {
                const metrics = getFundMetrics(fund);
                const maxReturn = Math.max(...funds.map(f => getFundMetrics(f).returnPercent));
                const minReturn = Math.min(...funds.map(f => getFundMetrics(f).returnPercent));
                const range = maxReturn - minReturn || 1;
                const normalizedReturn = ((metrics.returnPercent - minReturn) / range) * 100;
                
                return (
                  <div key={fund.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate flex-1 mr-4">
                        {fund.fundName}
                      </span>
                      <span className={`text-sm font-medium ${metrics.returnPercent >= 0 ? 'text-success' : 'text-error'}`}>
                        {metrics.returnPercent >= 0 ? '+' : ''}{metrics.returnPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${metrics.returnPercent >= 0 ? 'bg-success' : 'bg-error'}`}
                        style={{ width: `${Math.abs(normalizedReturn)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {funds.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No Analytics Available</h3>
              <p className="text-gray-400">Add some funds to see detailed analytics and insights</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
