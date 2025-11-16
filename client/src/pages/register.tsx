import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema, type InsertUser, type AuthResponse } from "@shared/schema";
import { auth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Lock, User } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await apiRequest<AuthResponse>("POST", "/api/auth/register", data);
      return response;
    },
    onSuccess: (data) => {
      auth.setToken(data.token);
      auth.setUser(data.user);
      toast({
        title: "Account created!",
        description: "Welcome to Scrambled Word. Let's start playing!",
      });
      setLocation("/game");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Unable to create account",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="font-display text-3xl">Create Account</CardTitle>
          <CardDescription>Join the word challenge today</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          {...field} 
                          placeholder="Your name"
                          className="pl-10"
                          data-testid="input-name"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          {...field} 
                          type="email" 
                          placeholder="you@example.com"
                          className="pl-10"
                          data-testid="input-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="••••••••"
                          className="pl-10"
                          data-testid="input-password"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={registerMutation.isPending}
                data-testid="button-submit"
              >
                {registerMutation.isPending ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login">
              <Button variant="link" className="p-0 h-auto font-semibold" data-testid="link-login">
                Sign in
              </Button>
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back-home">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
