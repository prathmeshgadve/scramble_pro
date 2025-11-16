import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { GameResult } from "@shared/schema";
import { ArrowLeft, Trophy, Target, Calendar } from "lucide-react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const user = auth.getUser();

  const { data: gameHistory, isLoading } = useQuery<GameResult[]>({
    queryKey: ["/api/games/history"],
    enabled: !!user,
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avgScore =
    gameHistory && gameHistory.length > 0
      ? Math.round(gameHistory.reduce((sum, g) => sum + g.score, 0) / gameHistory.length)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href="/game">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center space-y-4">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarFallback className="text-2xl font-semibold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="font-display text-xl" data-testid="text-user-name">
                    {user.name}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Best Score</span>
                  </div>
                  <span className="font-display text-xl font-bold" data-testid="text-best-score">
                    {user.bestScore}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Avg Score</span>
                  </div>
                  <span className="font-display text-xl font-bold" data-testid="text-avg-score">
                    {avgScore}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Games Played</span>
                  </div>
                  <span className="font-display text-xl font-bold" data-testid="text-games-played">
                    {user.gamesPlayed}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Game History</CardTitle>
                <CardDescription>Your complete gaming journey</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : !gameHistory || gameHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-6">No games played yet</p>
                    <Link href="/game/setup">
                      <Button data-testid="button-start-game">Play Your First Game</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {gameHistory.map((game, index) => {
                      const correctRounds = game.rounds.filter((r) => r.correct).length;
                      const accuracy = Math.round((correctRounds / game.rounds.length) * 100);

                      return (
                        <div
                          key={game._id}
                          className="p-4 bg-muted/30 rounded-lg hover-elevate"
                          data-testid={`game-history-${index}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-semibold">{game.category}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(game.createdAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-display text-2xl font-bold">{game.score}</div>
                              <div className="text-xs text-muted-foreground">points</div>
                            </div>
                          </div>
                          <div className="flex gap-6 text-sm">
                            <div>
                              <span className="text-muted-foreground">Difficulty: </span>
                              <span className="font-medium capitalize">{game.difficulty}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Correct: </span>
                              <span className="font-medium">
                                {correctRounds}/{game.rounds.length}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Accuracy: </span>
                              <span className="font-medium">{accuracy}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
