import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PortfolioChart from "./PortfolioChart";
import { Loader2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { formatCurrency, formatAddress } from "@/lib/utils";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  address?: string;
}

interface PortfolioData {
  totalValue: number;
  totalChange24h: number;
  assets: Asset[];
  history: {
    labels: string[];
    data: number[];
  };
}

export default function Portfolio() {
  const [timeframe, setTimeframe] = useState("7d");
  
  const { data, isLoading, error, refetch, isRefetching } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio", timeframe],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center bg-destructive/10 rounded-lg border border-destructive/30">
        <h3 className="text-lg font-medium text-destructive">Failed to load portfolio data</h3>
        <p className="text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gaming Portfolio</h1>
          <p className="text-muted-foreground">Manage your in-game assets and tokens</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          className="game-button-outline"
          disabled={isRefetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="game-stats-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(data.totalValue)}</div>
            <div className="flex items-center mt-1">
              {data.totalChange24h >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1 text-red-400" />
              )}
              <span 
                className={data.totalChange24h >= 0 ? 'text-green-400' : 'text-red-400'}
              >
                {data.totalChange24h >= 0 ? '+' : ''}{data.totalChange24h.toFixed(2)}% (24h)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="game-stats-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 px-2 text-xs ${timeframe === '7d' ? 'bg-violet-500/20 text-violet-300' : ''}`}
                  onClick={() => setTimeframe('7d')}
                >
                  7D
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 px-2 text-xs ${timeframe === '30d' ? 'bg-violet-500/20 text-violet-300' : ''}`}
                  onClick={() => setTimeframe('30d')}
                >
                  30D
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 px-2 text-xs ${timeframe === 'all' ? 'bg-violet-500/20 text-violet-300' : ''}`}
                  onClick={() => setTimeframe('all')}
                >
                  ALL
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-1">
            <div className="h-[80px]">
              <PortfolioChart labels={data.history.labels} data={data.history.data} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="bg-muted/50 border border-violet-800/30">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assets" className="space-y-4">
          <Card className="border border-violet-800/40">
            <CardHeader>
              <CardTitle>Gaming Assets</CardTitle>
              <CardDescription>
                Your in-game items and collectibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.assets
                  .filter(asset => !asset.address)
                  .map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between py-3 border-b border-violet-800/20">
                    <div className="flex flex-col">
                      <span className="font-medium">{asset.name}</span>
                      <span className="text-sm text-muted-foreground">{asset.symbol}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-col items-end mr-4">
                        <span className="font-medium">{asset.balance.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground">{formatCurrency(asset.price)}</span>
                      </div>
                      <div className="flex flex-col items-end min-w-[100px]">
                        <span className="font-medium">{formatCurrency(asset.value)}</span>
                        <span className={`text-xs ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tokens" className="space-y-4">
          <Card className="border border-violet-800/40">
            <CardHeader>
              <CardTitle>Blockchain Tokens</CardTitle>
              <CardDescription>
                Your blockchain tokens and cryptocurrencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.assets
                  .filter(asset => asset.address)
                  .map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between py-3 border-b border-violet-800/20">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">{asset.name}</span>
                        <span className="text-xs text-muted-foreground">{formatAddress(asset.address || '')}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{asset.symbol}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-col items-end mr-4">
                        <span className="font-medium">{asset.balance.toFixed(6)}</span>
                        <span className="text-xs text-muted-foreground">{formatCurrency(asset.price)}</span>
                      </div>
                      <div className="flex flex-col items-end min-w-[100px]">
                        <span className="font-medium">{formatCurrency(asset.value)}</span>
                        <span className={`text-xs ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
