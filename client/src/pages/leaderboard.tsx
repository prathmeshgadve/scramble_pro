import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { LeaderboardEntry } from "@shared/schema";
import { Trophy, Medal, ArrowLeft } from "lucide-react";

export default function Leaderboard() {
  const user = auth.getUser();

  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href={user ? "/game" : "/"}>
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center space-y-2 pb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-display text-4xl">Global Leaderboard</CardTitle>
            <p className="text-muted-foreground">Top players from around the world</p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : !leaderboard || leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No scores yet. Be the first!</p>
                {user && (
                  <Link href="/game/setup">
                    <Button data-testid="button-start-game">Start Playing</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentUser = user?._id === entry.userId;
                  const initials = entry.userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div
                      key={entry._id}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        isCurrentUser
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted/30 hover-elevate"
                      }`}
                      data-testid={`leaderboard-entry-${index}`}
                    >
                      {/* Rank */}
                      <div className="w-12 text-center flex-shrink-0">
                        {getRankBadge(rank) || (
                          <span className="font-display text-lg font-bold text-muted-foreground">
                            #{rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <Avatar className="flex-shrink-0">
                        <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate flex items-center gap-2">
                          {entry.userName}
                          {isCurrentUser && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.category} • {entry.difficulty} • {formatDate(entry.createdAt)}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right flex-shrink-0">
                        <div className="font-display text-2xl font-bold">{entry.score}</div>
                        <div className="text-xs text-muted-foreground">points</div>
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
  );
}
