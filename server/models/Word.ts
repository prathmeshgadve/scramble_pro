import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
  text: { type: String, required: true },
  meaning: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Word = mongoose.model("Word", wordSchema);
