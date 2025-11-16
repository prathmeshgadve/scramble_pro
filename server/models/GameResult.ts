import mongoose from "mongoose";

const gameRoundSchema = new mongoose.Schema({
  wordId: { type: mongoose.Schema.Types.ObjectId, ref: "Word", required: true },
  word: { type: String, required: true },
  scrambled: { type: String, required: true },
  userAnswer: { type: String },
  correct: { type: Boolean, required: true },
  timeTaken: { type: Number, required: true },
  usedHint: { type: Boolean, required: true },
  pointsEarned: { type: Number, required: true },
});

const gameResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  score: { type: Number, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  rounds: [gameRoundSchema],
  createdAt: { type: Date, default: Date.now },
});

export const GameResult = mongoose.model("GameResult", gameResultSchema);
