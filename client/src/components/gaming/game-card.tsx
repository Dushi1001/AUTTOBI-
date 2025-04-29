import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameType } from "@/types";

interface GameCardProps {
  game: GameType;
  onClick?: (gameId: string) => void;
}

export function GameCard({ game, onClick }: GameCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(game.id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'action':
        return 'bg-red-500/20 text-red-500';
      case 'rpg':
        return 'bg-blue-500/20 text-blue-500';
      case 'strategy':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'simulation':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/50">
      <div className="relative aspect-video bg-muted/20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-accent/10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <Badge className={`absolute top-2 right-2 ${getCategoryColor(game.category)}`}>
          {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold truncate">{game.title}</h3>
            <div className="flex items-center text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs ml-1">{game.rating}/5</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2">{game.description}</p>
          
          <div className="flex justify-between items-center text-sm">
            <div className="text-muted-foreground">
              Released: {new Date(game.releaseDate).toLocaleDateString()}
            </div>
            <div className="font-medium">
              {game.price > 0 ? `$${game.price.toFixed(2)}` : 'Free'}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleClick} className="w-full">
          {game.owned ? 'Play Now' : 'Purchase'}
        </Button>
      </CardFooter>
    </Card>
  );
}
