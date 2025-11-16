import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  rounds: [{
    wordId: { type: mongoose.Schema.Types.ObjectId, ref: "Word", required: true },
    word: { type: String, required: true },
    scrambled: { type: String, required: true },
    meaning: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
});

export const GameSession = mongoose.model("GameSession", gameSessionSchema);
