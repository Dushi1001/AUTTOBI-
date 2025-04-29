import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GamingStats } from "@/components/charts/gaming-stats";
import Sidebar from "@/components/layout/SidebarComponent";

export default function Analytics() {
  useEffect(() => {
    document.title = "Analytics | Gaming App";
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display text-white">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your gaming performance</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Play Time</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124 hrs</div>
              <div className="text-xs text-green-500 mt-1">+15% from last month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Win Rate</CardTitle>
              <CardDescription>Average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">62%</div>
              <div className="text-xs text-green-500 mt-1">+5% improvement</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">K/D Ratio</CardTitle>
              <CardDescription>Average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.8</div>
              <div className="text-xs text-green-500 mt-1">+0.3 improvement</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Achievements</CardTitle>
              <CardDescription>Total unlocked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48/72</div>
              <div className="text-xs text-green-500 mt-1">3 new this week</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance">
          <TabsList className="mb-6">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="spending">Spending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Your gaming performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <GamingStats />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Games</CardTitle>
                  <CardDescription>By playtime this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Cyberpunk Arena</div>
                          <div className="text-xs text-muted-foreground">Action RPG</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">42h</div>
                        <div className="text-xs text-muted-foreground">+8h this week</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Stellar Command</div>
                          <div className="text-xs text-muted-foreground">Strategy</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">35h</div>
                        <div className="text-xs text-muted-foreground">+5h this week</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Racing Evolution</div>
                          <div className="text-xs text-muted-foreground">Racing</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">22h</div>
                        <div className="text-xs text-muted-foreground">+3h this week</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Game Stats</CardTitle>
                  <CardDescription>Performance by game</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>Cyberpunk Arena</div>
                      <div className="text-right">
                        <span className="text-green-500 font-medium">Win: 68%</span>
                        <span className="mx-2 text-muted-foreground">|</span>
                        <span className="font-medium">K/D: 2.1</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>Stellar Command</div>
                      <div className="text-right">
                        <span className="text-green-500 font-medium">Win: 72%</span>
                        <span className="mx-2 text-muted-foreground">|</span>
                        <span className="font-medium">Score: 8.4/10</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>Racing Evolution</div>
                      <div className="text-right">
                        <span className="text-green-500 font-medium">Win: 45%</span>
                        <span className="mx-2 text-muted-foreground">|</span>
                        <span className="font-medium">Best Lap: 1:24.5</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>Galaxy Conquest</div>
                      <div className="text-right">
                        <span className="text-green-500 font-medium">Win: 60%</span>
                        <span className="mx-2 text-muted-foreground">|</span>
                        <span className="font-medium">Score: 7.8/10</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements Progress</CardTitle>
                <CardDescription>Unlock status and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recently Unlocked</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-muted/30 rounded-lg p-4 flex space-x-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">First Blood</div>
                          <div className="text-xs text-muted-foreground">First victory in Cyberpunk Arena</div>
                          <div className="text-xs text-primary mt-1">+100 XP</div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-4 flex space-x-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Fleet Admiral</div>
                          <div className="text-xs text-muted-foreground">Win 10 matches in Stellar Command</div>
                          <div className="text-xs text-primary mt-1">+250 XP</div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-4 flex space-x-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Speed Demon</div>
                          <div className="text-xs text-muted-foreground">Complete a lap under 1:30 in Racing Evolution</div>
                          <div className="text-xs text-primary mt-1">+150 XP</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Achievement Progress</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Gladiator</div>
                          <div className="text-xs text-muted-foreground">75% Complete</div>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">Win 100 matches in any game (75/100)</div>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Collector</div>
                          <div className="text-xs text-muted-foreground">40% Complete</div>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">Collect 50 unique items (20/50)</div>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Marathon Runner</div>
                          <div className="text-xs text-muted-foreground">62% Complete</div>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '62%' }}></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">Play for 500 hours total (310/500)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="spending">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Spending Analysis</CardTitle>
                  <CardDescription>Your gaming expenses over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <GamingStats isSpending={true} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Spending By Category</CardTitle>
                  <CardDescription>This year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>Game Purchases</div>
                      <div className="font-medium">$245.99</div>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>In-Game Items</div>
                      <div className="font-medium">$120.50</div>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '32%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>Subscriptions</div>
                      <div className="font-medium">$89.94</div>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '24%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>DLC / Expansions</div>
                      <div className="font-medium">$34.99</div>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '9%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Cyberpunk Arena - Season Pass</div>
                          <div className="text-xs text-muted-foreground">May 15, 2023</div>
                        </div>
                      </div>
                      <div className="font-medium">$29.99</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Racing Evolution - Car Pack</div>
                          <div className="text-xs text-muted-foreground">May 10, 2023</div>
                        </div>
                      </div>
                      <div className="font-medium">$14.99</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Galaxy Conquest</div>
                          <div className="text-xs text-muted-foreground">May 3, 2023</div>
                        </div>
                      </div>
                      <div className="font-medium">$24.99</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">Game Subscription</div>
                          <div className="text-xs text-muted-foreground">May 1, 2023</div>
                        </div>
                      </div>
                      <div className="font-medium">$9.99</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
