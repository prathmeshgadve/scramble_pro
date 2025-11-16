import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDate } from "@/lib/utils";
import type { Category, Word, LeaderboardEntry, User, InsertCategory, InsertWord } from "@shared/schema";
import { insertCategorySchema, insertWordSchema } from "@shared/schema";
import { Plus, Trash2, Edit, LogOut, BookOpen, List, Trophy, Users as UsersIcon } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("words");
  const user = auth.getUser();

  if (!user || user.role !== "admin") {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = () => {
    auth.logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold" data-testid="text-admin-title">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <Button variant="ghost" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
            <TabsTrigger value="words" data-testid="tab-words">
              <BookOpen className="w-4 h-4 mr-2" />
              Words
            </TabsTrigger>
            <TabsTrigger value="categories" data-testid="tab-categories">
              <List className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="leaderboard" data-testid="tab-leaderboard">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              <UsersIcon className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="words">
            <WordsTab />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function WordsTab() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const { data: words, isLoading } = useQuery<Word[]>({
    queryKey: ["/api/admin/words"],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<InsertWord>({
    resolver: zodResolver(insertWordSchema),
    defaultValues: {
      text: "",
      meaning: "",
      category: "",
      difficulty: "medium",
    },
  });

  const addWordMutation = useMutation({
    mutationFn: async (data: InsertWord) => {
      return await apiRequest("POST", "/api/admin/words", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/words"] });
      toast({ title: "Word added successfully" });
      setIsAddOpen(false);
      form.reset();
    },
  });

  const deleteWordMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/words/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/words"] });
      toast({ title: "Word deleted successfully" });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="font-display text-2xl">Manage Words</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-word">
              <Plus className="w-4 h-4 mr-2" />
              Add Word
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Word</DialogTitle>
              <DialogDescription>Add a new word to the game database</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => addWordMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Word</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter word" data-testid="input-word-text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meaning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meaning</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter meaning" data-testid="input-word-meaning" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-word-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-word-difficulty">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={addWordMutation.isPending} data-testid="button-submit-word">
                    {addWordMutation.isPending ? "Adding..." : "Add Word"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : !words || words.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No words yet</p>
        ) : (
          <div className="space-y-2">
            {words.map((word, index) => (
              <div key={word._id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg" data-testid={`word-item-${index}`}>
                <div className="flex-1">
                  <div className="font-semibold">{word.text}</div>
                  <div className="text-sm text-muted-foreground">{word.meaning}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {categories?.find(c => c._id === word.category)?.name} • {word.difficulty}
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteWordMutation.mutate(word._id)}
                  data-testid={`button-delete-word-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CategoriesTab() {
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<InsertCategory>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      return await apiRequest("POST", "/api/admin/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category added successfully" });
      setIsAddOpen(false);
      form.reset();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/categories/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category deleted successfully" });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="font-display text-2xl">Manage Categories</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-category">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new word category</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => addCategoryMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Category name" data-testid="input-category-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Category description" data-testid="input-category-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={addCategoryMutation.isPending} data-testid="button-submit-category">
                    {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : !categories || categories.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No categories yet</p>
        ) : (
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={category._id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg" data-testid={`category-item-${index}`}>
                <div className="flex-1">
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-sm text-muted-foreground">{category.description}</div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteCategoryMutation.mutate(category._id)}
                  data-testid={`button-delete-category-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LeaderboardTab() {
  const { toast } = useToast();

  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/leaderboard/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      toast({ title: "Entry removed successfully" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">Manage Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : !leaderboard || leaderboard.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No entries yet</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div key={entry._id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg" data-testid={`leaderboard-entry-${index}`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 text-center font-bold text-muted-foreground">#{index + 1}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{entry.userName}</div>
                    <div className="text-sm text-muted-foreground">
                      {entry.category} • {entry.difficulty} • {formatDate(entry.createdAt)}
                    </div>
                  </div>
                  <div className="font-display text-xl font-bold">{entry.score}</div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteEntryMutation.mutate(entry._id)}
                  data-testid={`button-delete-entry-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UsersTab() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">Manage Users</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : !users || users.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No users yet</p>
        ) : (
          <div className="space-y-2">
            {users.map((user, index) => (
              <div key={user._id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg" data-testid={`user-item-${index}`}>
                <div className="flex-1">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {user.role} • Best: {user.bestScore} • Games: {user.gamesPlayed}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
