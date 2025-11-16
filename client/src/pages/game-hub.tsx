import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { Play, Trophy, User, LogOut } from "lucide-react";
import type { GameResult } from "@shared/schema";
import { formatDate } from "@/lib/utils";

export default function GameHub() {
  const [, setLocation] = useLocation();
  const user = auth.getUser();

  const { data: recentGames } = useQuery<GameResult[]>({
    queryKey: ["/api/games/recent"],
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleLogout = () => {
    auth.logout();
    setLocation("/");
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold" data-testid="text-app-title">Scrambled Word</h1>
          <div className="flex items-center gap-4">
            <Link href="/leaderboard">
              <Button variant="ghost" data-testid="button-leaderboard">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" data-testid="button-profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center space-y-4 pb-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="font-display text-xl" data-testid="text-user-name">{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Best Score</span>
                  <span className="text-2xl font-bold font-display" data-testid="text-best-score">
                    {user.bestScore}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Games Played</span>
                  <span className="text-2xl font-bold font-display" data-testid="text-games-played">
                    {user.gamesPlayed}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Link href="/game/setup">
              <Button className="w-full h-14 text-lg font-semibold" data-testid="button-new-game">
                <Play className="w-5 h-5 mr-2" />
                Start New Game
              </Button>
            </Link>
          </div>

          {/* Recent Games */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Recent Games</CardTitle>
                <CardDescription>Your game history</CardDescription>
              </CardHeader>
              <CardContent>
                {!recentGames || recentGames.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-6">No games played yet</p>
                    <Link href="/game/setup">
                      <Button data-testid="button-start-first-game">
                        Play Your First Game
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentGames.map((game, index) => (
                      <div
                        key={game._id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover-elevate"
                        data-testid={`game-result-${index}`}
                      >
                        <div className="flex-1">
                          <div className="font-semibold">{game.category}</div>
                          <div className="text-sm text-muted-foreground">
                            {game.difficulty} • {formatDate(game.createdAt)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold font-display">{game.score}</div>
                          <div className="text-sm text-muted-foreground">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
