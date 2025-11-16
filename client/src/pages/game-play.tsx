import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/auth";
import { calculatePoints } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { GameSession, GameRound, FinishGameRequest } from "@shared/schema";
import { Lightbulb, Trophy, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_TIME = 30;

export default function GamePlay() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty") as "easy" | "medium" | "hard";

  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);

  const user = auth.getUser();

  const { data: gameSession, isLoading } = useQuery<GameSession>({
    queryKey: ["/api/games/start", category, difficulty],
    enabled: !!category && !!difficulty,
  });

  const finishGameMutation = useMutation({
    mutationFn: async (data: FinishGameRequest) => {
      return await apiRequest("POST", "/api/games/finish", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/game/results?score=" + totalScore);
    },
  });

  useEffect(() => {
    if (!user || !category || !difficulty) {
      setLocation("/game/setup");
    }
  }, [user, category, difficulty, setLocation]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeout();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentRound]);

  const handleTimeout = useCallback(() => {
    if (!gameSession || isAnswering) return;
    
    setIsAnswering(true);
    const currentWord = gameSession.rounds[currentRound];
    
    const round: GameRound = {
      wordId: currentWord.wordId,
      word: currentWord.word,
      scrambled: currentWord.scrambled,
      userAnswer: userAnswer,
      correct: false,
      timeTaken: MAX_TIME,
      usedHint,
      pointsEarned: 0,
    };

    setRounds([...rounds, round]);
    
    toast({
      title: "Time's up!",
      description: `The word was: ${currentWord.word}`,
      variant: "destructive",
    });

    setTimeout(() => {
      if (currentRound < 9) {
        nextRound();
      } else {
        endGame([...rounds, round]);
      }
    }, 2000);
  }, [gameSession, currentRound, userAnswer, usedHint, rounds, isAnswering]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameSession || !userAnswer.trim() || isAnswering) return;

    setIsAnswering(true);
    const currentWord = gameSession.rounds[currentRound];
    const correct = userAnswer.toLowerCase().trim() === currentWord.word.toLowerCase();
    const timeTaken = MAX_TIME - timeLeft;
    const points = correct ? calculatePoints(difficulty, timeLeft, usedHint, MAX_TIME) : 0;

    const round: GameRound = {
      wordId: currentWord.wordId,
      word: currentWord.word,
      scrambled: currentWord.scrambled,
      userAnswer: userAnswer.trim(),
      correct,
      timeTaken,
      usedHint,
      pointsEarned: points,
    };

    setRounds([...rounds, round]);
    setTotalScore(totalScore + points);

    if (correct) {
      toast({
        title: "Correct!",
        description: `+${points} points`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The word was: ${currentWord.word}`,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      if (currentRound < 9) {
        nextRound();
      } else {
        endGame([...rounds, round]);
      }
    }, 2000);
  };

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
    setTimeLeft(MAX_TIME);
    setUserAnswer("");
    setShowHint(false);
    setUsedHint(false);
    setIsAnswering(false);
  };

  const endGame = (finalRounds: GameRound[]) => {
    if (!gameSession) return;

    const finalScore = finalRounds.reduce((sum, r) => sum + r.pointsEarned, 0);
    
    finishGameMutation.mutate({
      gameId: gameSession._id,
      rounds: finalRounds,
      score: finalScore,
    });
  };

  const handleShowHint = () => {
    setShowHint(true);
    if (!usedHint) {
      setUsedHint(true);
    }
  };

  if (!user || !category || !difficulty) return null;
  if (isLoading || !gameSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading game...</p>
        </div>
      </div>
    );
  }

  const currentWord = gameSession.rounds[currentRound];
  const progress = ((currentRound + 1) / 10) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Score Bar */}
      <div className="sticky top-0 bg-card border-b z-50">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-muted-foreground">Round</div>
              <div className="font-display text-lg font-bold" data-testid="text-current-round">
                {currentRound + 1} / 10
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Score</div>
              <div className="font-display text-lg font-bold" data-testid="text-total-score">
                {totalScore}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Time</div>
            <div 
              className={`font-display text-lg font-bold ${timeLeft <= 5 ? "text-destructive animate-pulse" : ""}`}
              data-testid="text-time-left"
            >
              {timeLeft}s
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Game Area */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Round Indicator */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i < currentRound
                    ? "bg-primary text-primary-foreground"
                    : i === currentRound
                    ? "bg-primary/20 border-2 border-primary text-primary animate-pulse"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`round-indicator-${i}`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Scrambled Word */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRound}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h2 className="text-sm font-medium text-muted-foreground mb-4">
                Unscramble this word:
              </h2>
              <div className="flex justify-center gap-3 flex-wrap mb-8">
                {currentWord.scrambled.split("").map((letter, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-card border-2 border-primary/20 rounded-xl flex items-center justify-center shadow-lg"
                    data-testid={`letter-tile-${i}`}
                  >
                    <span className="font-display text-4xl md:text-5xl font-semibold tracking-wider">
                      {letter.toUpperCase()}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Answer Input */}
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="text-center text-2xl h-14 font-display"
                  autoFocus
                  disabled={isAnswering}
                  data-testid="input-answer"
                />
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-12 text-lg"
                  disabled={!userAnswer.trim() || isAnswering}
                  data-testid="button-submit-answer"
                >
                  Submit Answer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              {/* Hint Section */}
              <div className="mt-8">
                {!showHint ? (
                  <Button
                    variant="outline"
                    onClick={handleShowHint}
                    disabled={isAnswering}
                    data-testid="button-show-hint"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Show Hint (-5 points)
                  </Button>
                ) : (
                  <Card className="p-6 bg-muted/50 max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">Hint:</p>
                        <p className="italic text-muted-foreground" data-testid="text-hint">
                          {currentWord.meaning}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
