import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatarUrl: { type: String },
  bestScore: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);
