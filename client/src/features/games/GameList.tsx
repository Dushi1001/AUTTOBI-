import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import GameCard from "./GameCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, Gamepad } from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  players: number;
  rating: number;
}

export default function GameList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const { toast } = useToast();

  const { data: games, isLoading, error } = useQuery<Game[]>({
    queryKey: ["/api/games"],
    staleTime: 60000, // 1 minute
  });

  const handlePlayGame = (gameId: string) => {
    toast({
      title: "Game starting",
      description: `Launching game ID: ${gameId}`,
      duration: 3000,
    });
  };

  const filteredGames = games?.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || game.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Games</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-[200px] rounded-lg bg-muted animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] rounded-lg border border-destructive/50 bg-destructive/10 p-6">
        <Gamepad className="h-10 w-10 text-destructive mb-2" />
        <h3 className="text-xl font-semibold text-destructive">Error loading games</h3>
        <p className="text-muted-foreground mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  const categories = games ? [...new Set(games.map(game => game.category))] : [];

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <h2 className="text-2xl font-bold">Games Library</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              className="pl-8 game-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-muted border-violet-700/50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredGames?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] rounded-lg border border-violet-800/40 bg-muted/30 p-6">
          <Gamepad className="h-10 w-10 text-violet-400 mb-2" />
          <h3 className="text-xl font-semibold">No games found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGames?.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.title}
              description={game.description}
              category={game.category}
              players={game.players}
              rating={game.rating}
              onPlay={handlePlayGame}
            />
          ))}
        </div>
      )}
    </div>
  );
}
