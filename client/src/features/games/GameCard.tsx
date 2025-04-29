import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Star, Users, Zap } from "lucide-react";

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  players: number;
  rating: number;
  onPlay: (id: string) => void;
}

export default function GameCard({ id, title, description, category, players, rating, onPlay }: GameCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card 
      className={`game-card game-card-hover ${isHovering ? 'border-violet-600' : 'border-violet-800/40'}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <Badge variant="secondary" className="bg-violet-700/30 text-violet-300">
            {category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-violet-400" />
            <span>{players} players</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onPlay(id)} 
          className="w-full game-button gap-2"
        >
          <Gamepad2 className="h-4 w-4" />
          <span>Play Now</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
