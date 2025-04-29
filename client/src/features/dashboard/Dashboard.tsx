import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardMetrics from "./DashboardMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Gamepad2, Trophy, Coins, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardData {
  totalGames: number;
  activeGames: number;
  totalEarnings: number;
  recentWins: number;
  portfolioValue: number;
  portfolioChange: number;
  recentActivity: Array<{
    id: string;
    type: string;
    game: string;
    amount: number;
    date: string;
  }>;
  stats: {
    dates: string[];
    earnings: number[];
    gamePlays: number[];
  };
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
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
        <h3 className="text-lg font-medium text-destructive">Failed to load dashboard data</h3>
        <p className="text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="game-stats-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Games</CardTitle>
            <Gamepad2 className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalGames}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.activeGames} active now
            </p>
          </CardContent>
        </Card>
        
        <Card className="game-stats-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Wins</CardTitle>
            <Trophy className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentWins}</div>
            <p className="text-xs text-muted-foreground mt-1">
              This week
            </p>
          </CardContent>
        </Card>
        
        <Card className="game-stats-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <Coins className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>
        
        <Card className="game-stats-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.portfolioValue)}</div>
            <p className={`text-xs mt-1 ${data.portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.portfolioChange >= 0 ? '+' : ''}{data.portfolioChange.toFixed(2)}% this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50 border border-violet-800/30">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card className="border border-violet-800/40">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Your gaming stats and earnings over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <DashboardMetrics data={data.stats} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card className="border border-violet-800/40">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest gaming transactions and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-violet-800/20">
                    <div className="flex flex-col">
                      <span className="font-medium">{activity.game}</span>
                      <span className="text-sm text-muted-foreground">{activity.type}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`font-medium ${activity.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {activity.amount >= 0 ? '+' : ''}{formatCurrency(activity.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</span>
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
