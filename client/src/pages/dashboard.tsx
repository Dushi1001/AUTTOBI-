import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { GamingStats } from "@/components/charts/gaming-stats";
import Sidebar from "@/components/layout/SidebarComponent";
import { GameList } from "@/components/gaming/game-list";
import { WalletConnect } from "@/components/blockchain/wallet-connect";
import { formatCurrency } from "@/lib/utils";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiBinance, SiDogecoin, SiLitecoin } from "react-icons/si";

export default function Dashboard() {
  const { toast } = useToast();
  const username = useSelector((state: RootState) => state.user.username);
  const balance = useSelector((state: RootState) => state.wallet.balance);
  const games = useSelector((state: RootState) => state.games.recentGames);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    document.title = "Dashboard | AUTTOBI Wallet";
  }, []);

  const handleBuildClick = () => {
    toast({
      title: "Build Started",
      description: "Your project build has started. This may take a few minutes.",
    });
    
    // Simulate build process
    setTimeout(() => {
      toast({
        title: "Build Complete",
        description: "Your project was built successfully!",
      });
    }, 3000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold font-display text-white">Welcome to AUTTOBI, {username || 'User'}</h1>
              <p className="text-muted-foreground mt-1">Your crypto wallet with gaming features</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={handleBuildClick} className="bg-primary hover:bg-primary/90 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Build Project
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Wallet Balance</CardTitle>
                  <CardDescription>Your current assets</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <FaBitcoin className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              <div className="text-xs text-green-500 mt-1">+2.5% from last week</div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/wallet">View Details</a>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Ethereum</CardTitle>
                  <CardDescription>ETH Holdings</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FaEthereum className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.45 ETH</div>
              <div className="text-xs text-green-500 mt-1">+5.7% (24h)</div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/wallet">View Portfolio</a>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">AUTTOBI Points</CardTitle>
                  <CardDescription>Gaming rewards</CardDescription>
                </div>
                <div className="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <SiDogecoin className="h-6 w-6 text-violet-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,250</div>
              <div className="text-xs text-green-500 mt-1">+8 points today</div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/analytics">View Analytics</a>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="games">Recent Games</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Wallet Activity</CardTitle>
                  <CardDescription>Your AUTTOBI stats over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <GamingStats />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Games</CardTitle>
                  <CardDescription>Your recently played games</CardDescription>
                </CardHeader>
                <CardContent>
                  <GameList games={games.slice(0, 4)} />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/games">View All Games</a>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Configuration Issues</CardTitle>
                  <CardDescription>Issues that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-destructive/10 border-l-4 border-destructive rounded-md">
                      <h4 className="font-medium text-destructive">Build Directory Mismatch</h4>
                      <p className="text-sm mt-1">Netlify is configured to use 'dist' but React Scripts uses 'build'</p>
                    </div>
                    
                    <div className="p-3 bg-warning/10 border-l-4 border-warning rounded-md">
                      <h4 className="font-medium text-warning">Jest Configuration Syntax Error</h4>
                      <p className="text-sm mt-1">Missing module.exports in jest.config.js</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" size="sm" className="w-full">
                    Fix Issues
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="wallet">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Connection</CardTitle>
                <CardDescription>Connect your blockchain wallet</CardDescription>
              </CardHeader>
              <CardContent>
                <WalletConnect />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="games">
            <Card>
              <CardHeader>
                <CardTitle>Your Games</CardTitle>
                <CardDescription>Recent gaming activity</CardDescription>
              </CardHeader>
              <CardContent>
                <GameList games={games} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
