import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Trophy, Lightbulb, Timer, Users, Shield } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_image_with_letter_tiles_07783113.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${heroImage})`,
          }}
        />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="font-display text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight" data-testid="text-hero-title">
            Scrambled Word
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-medium" data-testid="text-hero-tagline">
            Unscramble. Compete. Conquer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 h-12 min-w-[200px]" data-testid="button-play-now">
                Play Now
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 h-12 min-w-[200px] bg-background/10 backdrop-blur-md border-white/20 text-white hover:bg-background/20" 
                data-testid="button-view-leaderboard"
              >
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16" data-testid="text-features-heading">
            Why Play Scrambled Word?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover-elevate" data-testid="card-feature-rounds">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-display text-2xl">10 Rounds of Fun</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Challenge yourself with 10 exciting rounds of word scrambling. Each round brings a new word to unscramble with a ticking timer.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover-elevate" data-testid="card-feature-hints">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-display text-2xl">Smart Hints</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Stuck on a word? Use our hint system to reveal the word's meaning and get back on track to victory.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover-elevate" data-testid="card-feature-leaderboard">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-display text-2xl">Global Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Compete with players worldwide. Save your scores and climb the leaderboard to become the ultimate word master.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-center mb-16" data-testid="text-howto-heading">
            How to Play
          </h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start" data-testid="step-1">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display text-xl font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Choose Your Challenge</h3>
                <p className="text-muted-foreground">
                  Select a category and difficulty level to start your game. Each difficulty offers different point rewards.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start" data-testid="step-2">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display text-xl font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Unscramble the Word</h3>
                <p className="text-muted-foreground">
                  Look at the scrambled letters and type the correct word before the timer runs out. Speed matters for bonus points!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start" data-testid="step-3">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display text-xl font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Use Hints Wisely</h3>
                <p className="text-muted-foreground">
                  Need help? Click the hint button to see the word's meaning, but remember it costs you points.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start" data-testid="step-4">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-display text-xl font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Compete & Win</h3>
                <p className="text-muted-foreground">
                  Complete all 10 rounds, save your score to the leaderboard, and see how you rank against other players!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" data-testid="text-cta-heading">
            Ready to Test Your Skills?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of players challenging their vocabulary and speed. Create your account and start playing today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 h-12 min-w-[200px]" data-testid="button-get-started">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 h-12 min-w-[200px]" data-testid="button-login">
                I Have an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Scrambled Word. All rights reserved.
          </p>
          <Link href="/admin/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" data-testid="link-admin">
              Admin Login
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
