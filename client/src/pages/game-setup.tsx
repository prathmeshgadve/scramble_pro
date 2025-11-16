import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import type { Category } from "@shared/schema";
import { Play, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function GameSetup() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  
  const user = auth.getUser();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleStartGame = () => {
    if (!selectedCategory) return;
    setLocation(`/game/play?category=${selectedCategory}&difficulty=${selectedDifficulty}`);
  };

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link href="/game">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hub
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-display text-4xl">Start New Game</CardTitle>
            <CardDescription className="text-base">
              Choose your category and difficulty to begin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {categories && categories.length > 0 && selectedCategory && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {categories.find(c => c._id === selectedCategory)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={selectedDifficulty === "easy" ? "default" : "outline"}
                    onClick={() => setSelectedDifficulty("easy")}
                    className="h-auto py-4 flex flex-col gap-1"
                    data-testid="button-difficulty-easy"
                  >
                    <span className="font-semibold">Easy</span>
                    <span className="text-xs opacity-75">10 pts base</span>
                  </Button>
                  <Button
                    variant={selectedDifficulty === "medium" ? "default" : "outline"}
                    onClick={() => setSelectedDifficulty("medium")}
                    className="h-auto py-4 flex flex-col gap-1"
                    data-testid="button-difficulty-medium"
                  >
                    <span className="font-semibold">Medium</span>
                    <span className="text-xs opacity-75">20 pts base</span>
                  </Button>
                  <Button
                    variant={selectedDifficulty === "hard" ? "default" : "outline"}
                    onClick={() => setSelectedDifficulty("hard")}
                    className="h-auto py-4 flex flex-col gap-1"
                    data-testid="button-difficulty-hard"
                  >
                    <span className="font-semibold">Hard</span>
                    <span className="text-xs opacity-75">30 pts base</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-sm">Game Rules:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>10 rounds with scrambled words to solve</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>30 seconds per round</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Faster answers earn bonus points</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Hints available (costs 5 points)</span>
                </li>
              </ul>
            </div>

            <Button 
              className="w-full h-12 text-lg font-semibold" 
              onClick={handleStartGame}
              disabled={!selectedCategory || isLoading}
              data-testid="button-start-game"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
