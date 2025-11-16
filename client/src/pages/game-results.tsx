import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Play, BarChart } from "lucide-react";
import { motion } from "framer-motion";

export default function GameResults() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search));
  const score = parseInt(searchParams.get("score") || "0");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-6 pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
          >
            <Trophy className="w-12 h-12 text-primary" />
          </motion.div>
          
          <div>
            <CardTitle className="font-display text-4xl mb-2">Game Complete!</CardTitle>
            <p className="text-muted-foreground">Great job completing all 10 rounds</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-primary/5 rounded-2xl p-8 border border-primary/20"
          >
            <div className="text-sm font-medium text-muted-foreground mb-2">Final Score</div>
            <div className="font-display text-6xl font-bold text-primary" data-testid="text-final-score">
              {score}
            </div>
            <div className="text-sm text-muted-foreground mt-2">points</div>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Link href="/game/setup">
            <Button className="w-full h-12 text-lg" data-testid="button-play-again">
              <Play className="w-5 h-5 mr-2" />
              Play Again
            </Button>
          </Link>
          
          <Link href="/leaderboard">
            <Button variant="outline" className="w-full h-12 text-lg" data-testid="button-view-leaderboard">
              <BarChart className="w-5 h-5 mr-2" />
              View Leaderboard
            </Button>
          </Link>

          <Link href="/game">
            <Button variant="ghost" className="w-full" data-testid="button-back-hub">
              Back to Hub
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
