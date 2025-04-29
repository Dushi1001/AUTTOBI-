import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";
import { ArrowRight, Gamepad2, Trophy, TrendingUp, Shield } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-20 px-4 md:py-32 game-gradient-bg">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="game-gradient-text">Next-Gen Gaming</span> Platform
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Play, compete, and earn rewards in your favorite games with blockchain integration
            and advanced analytics to track your performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="game-button" asChild>
              <Link href={user ? "/dashboard" : "/signup"}>
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="game-button-outline" asChild>
              <Link href="/games">
                Explore Games
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="game-gradient-text">Key Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-violet-800/40 hover:border-violet-600/70 transition-all">
              <div className="h-14 w-14 rounded-full bg-violet-600/20 flex items-center justify-center mb-4">
                <Gamepad2 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Competitive Gaming</h3>
              <p className="text-muted-foreground">
                Join tournaments, compete with friends, and climb the leaderboards
                with skill-based matchmaking.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-violet-800/40 hover:border-violet-600/70 transition-all">
              <div className="h-14 w-14 rounded-full bg-violet-600/20 flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground">
                Track your gaming progress with detailed performance metrics
                and data visualization tools.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background border border-violet-800/40 hover:border-violet-600/70 transition-all">
              <div className="h-14 w-14 rounded-full bg-violet-600/20 flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Blockchain Integration</h3>
              <p className="text-muted-foreground">
                Secure ownership of in-game assets and rewards with blockchain
                technology and cryptocurrency payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to <span className="game-gradient-text">Level Up</span> Your Gaming?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of gamers already using our platform to enhance their gaming experience.
          </p>
          <Button size="lg" className="game-button" asChild>
            <Link href={user ? "/dashboard" : "/signup"}>
              {user ? "Go to Dashboard" : "Sign Up Now"}
              <Trophy className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-violet-800/40">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Gamepad2 className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold">GamingApp</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 GamingApp. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
