import { GameCard } from "@/components/gaming/game-card";
import { GameType } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface GameListProps {
  games: GameType[];
}

export function GameList({ games }: GameListProps) {
  const { toast } = useToast();

  const handleGameClick = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    
    if (game) {
      if (game.owned) {
        toast({
          title: `Launching ${game.title}`,
          description: "Game is starting...",
        });
      } else {
        toast({
          title: `Purchase ${game.title}`,
          description: `Game costs $${game.price.toFixed(2)}`,
        });
      }
    }
  };

  if (games.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="h-20 w-20 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mt-4">No games found</h3>
        <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onClick={handleGameClick} />
      ))}
    </div>
  );
}
