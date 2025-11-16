import { z } from "zod";

// User Schema
export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  role: z.enum(["user", "admin"]).default("user"),
  avatarUrl: z.string().optional(),
  bestScore: z.number().default(0),
  gamesPlayed: z.number().default(0),
  createdAt: z.date(),
});

export const insertUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

// Category Schema
export const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
});

export const insertCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
});

export type Category = z.infer<typeof categorySchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Word Schema
export const wordSchema = z.object({
  _id: z.string(),
  text: z.string(),
  meaning: z.string(),
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  createdAt: z.date(),
});

export const insertWordSchema = z.object({
  text: z.string().min(1, "Word is required"),
  meaning: z.string().min(1, "Meaning is required"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export type Word = z.infer<typeof wordSchema>;
export type InsertWord = z.infer<typeof insertWordSchema>;

// Game Round Schema
export const gameRoundSchema = z.object({
  wordId: z.string(),
  word: z.string(),
  scrambled: z.string(),
  userAnswer: z.string().optional(),
  correct: z.boolean(),
  timeTaken: z.number(),
  usedHint: z.boolean(),
  pointsEarned: z.number(),
});

export type GameRound = z.infer<typeof gameRoundSchema>;

// Game Result Schema
export const gameResultSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  userName: z.string(),
  score: z.number(),
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  rounds: z.array(gameRoundSchema),
  createdAt: z.date(),
});

export const startGameSchema = z.object({
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

export const finishGameSchema = z.object({
  gameId: z.string(),
  rounds: z.array(gameRoundSchema),
  score: z.number(),
});

export type GameResult = z.infer<typeof gameResultSchema>;
export type StartGameRequest = z.infer<typeof startGameSchema>;
export type FinishGameRequest = z.infer<typeof finishGameSchema>;

// Game Session (for active games)
export const gameSessionSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  category: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  rounds: z.array(z.object({
    wordId: z.string(),
    word: z.string(),
    scrambled: z.string(),
    meaning: z.string(),
  })),
  createdAt: z.date(),
});

export type GameSession = z.infer<typeof gameSessionSchema>;

// Leaderboard Entry
export const leaderboardEntrySchema = z.object({
  _id: z.string(),
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  score: z.number(),
  category: z.string(),
  difficulty: z.string(),
  createdAt: z.date(),
});

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

// Auth Response
export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(["user", "admin"]),
    avatarUrl: z.string().optional(),
    bestScore: z.number(),
    gamesPlayed: z.number(),
  }),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
