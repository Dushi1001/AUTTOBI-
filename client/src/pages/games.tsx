import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/store/store";
import { GameList } from "@/components/gaming/game-list";
import Sidebar from "@/components/layout/SidebarComponent";
import { GameType } from "@/types";

export default function Games() {
  const allGames = useSelector((state: RootState) => state.games.allGames);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState<GameType[]>(allGames);
  const [currentCategory, setCurrentCategory] = useState("all");
  
  useEffect(() => {
    document.title = "Games | Gaming App";
  }, []);
  
  useEffect(() => {
    let result = allGames;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(game => 
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (currentCategory !== 'all') {
      result = result.filter(game => game.category === currentCategory);
    }
    
    setFilteredGames(result);
  }, [searchTerm, currentCategory, allGames]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-display text-white">Game Library</h1>
          <p className="text-muted-foreground mt-1">Browse and play your favorite games</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter
          </Button>
          <Button>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Game
          </Button>
        </div>

        <Tabs value={currentCategory} onValueChange={setCurrentCategory}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="action">Action</TabsTrigger>
            <TabsTrigger value="rpg">RPG</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Games</CardTitle>
                <CardDescription>
                  {filteredGames.length} games available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameList games={filteredGames} />
                {filteredGames.length === 0 && (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No games found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="action">
            <Card>
              <CardHeader>
                <CardTitle>Action Games</CardTitle>
                <CardDescription>
                  {filteredGames.length} games available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameList games={filteredGames} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rpg">
            <Card>
              <CardHeader>
                <CardTitle>RPG Games</CardTitle>
                <CardDescription>
                  {filteredGames.length} games available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameList games={filteredGames} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="strategy">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Games</CardTitle>
                <CardDescription>
                  {filteredGames.length} games available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameList games={filteredGames} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="simulation">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Games</CardTitle>
                <CardDescription>
                  {filteredGames.length} games available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GameList games={filteredGames} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
