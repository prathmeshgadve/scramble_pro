import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./models/User";
import { Category } from "./models/Category";
import { Word } from "./models/Word";
import { GameSession } from "./models/GameSession";
import { GameResult } from "./models/GameResult";
import { authenticateToken, requireAdmin, type AuthRequest } from "./middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function scrambleWord(word: string): string {
  const chars = word.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const scrambled = chars.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== AUTH ROUTES ====================
  
  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        passwordHash,
        role: "user",
      });

      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          bestScore: user.bestScore,
          gamesPlayed: user.gamesPlayed,
        },
      });
    } catch (error: any) {
      console.error("Register error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id.toString(), role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          bestScore: user.bestScore,
          gamesPlayed: user.gamesPlayed,
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bestScore: user.bestScore,
        gamesPlayed: user.gamesPlayed,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== CATEGORY ROUTES ====================
  
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await Category.find().sort({ name: 1 });
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== GAME ROUTES ====================
  
  // Start game - create session
  app.get("/api/games/start", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { category, difficulty } = req.query;

      if (!category || !difficulty) {
        return res.status(400).json({ error: "Category and difficulty required" });
      }

      const words = await Word.find({
        category,
        difficulty,
      }).limit(10);

      if (words.length < 10) {
        return res.status(400).json({ error: "Not enough words in this category/difficulty" });
      }

      const rounds = words.map((word) => ({
        wordId: word._id,
        word: word.text,
        scrambled: scrambleWord(word.text),
        meaning: word.meaning,
      }));

      const session = await GameSession.create({
        userId: req.userId,
        category,
        difficulty,
        rounds,
      });

      res.json(session);
    } catch (error: any) {
      console.error("Start game error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Finish game - save results
  app.post("/api/games/finish", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { gameId, rounds, score } = req.body;

      const session = await GameSession.findById(gameId);
      if (!session) {
        return res.status(404).json({ error: "Game session not found" });
      }

      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const category = await Category.findById(session.category);
      const categoryName = category?.name || "Unknown";

      const gameResult = await GameResult.create({
        userId: req.userId,
        userName: user.name,
        score,
        category: categoryName,
        difficulty: session.difficulty,
        rounds,
      });

      if (score > user.bestScore) {
        user.bestScore = score;
      }
      user.gamesPlayed += 1;
      await user.save();

      await GameSession.findByIdAndDelete(gameId);

      res.json(gameResult);
    } catch (error: any) {
      console.error("Finish game error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get recent games for current user
  app.get("/api/games/recent", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const games = await GameResult.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .limit(5);
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get game history for current user
  app.get("/api/games/history", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const games = await GameResult.find({ userId: req.userId })
        .sort({ createdAt: -1 });
      res.json(games);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== LEADERBOARD ROUTES ====================
  
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const results = await GameResult.find()
        .sort({ score: -1 })
        .limit(limit);

      const leaderboard = results.map((result) => ({
        _id: result._id,
        userId: result.userId,
        userName: result.userName,
        userAvatar: undefined,
        score: result.score,
        category: result.category,
        difficulty: result.difficulty,
        createdAt: result.createdAt,
      }));

      res.json(leaderboard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== ADMIN ROUTES ====================
  
  // Get all words
  app.get("/api/admin/words", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const words = await Word.find().sort({ text: 1 });
      res.json(words);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add word
  app.post("/api/admin/words", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { text, meaning, category, difficulty } = req.body;
      const word = await Word.create({ text, meaning, category, difficulty });
      res.json(word);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete word
  app.delete("/api/admin/words/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      await Word.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add category
  app.post("/api/admin/categories", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { name, description } = req.body;
      const category = await Category.create({ name, description });
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete category
  app.delete("/api/admin/categories/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete leaderboard entry
  app.delete("/api/admin/leaderboard/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      await GameResult.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all users
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
