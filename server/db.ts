import mongoose from "mongoose";

export async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;
  
  console.log("🔍 Environment check:");
  console.log("   MONGO_URI exists:", !!MONGO_URI);
  console.log("   MONGO_URI starts with:", MONGO_URI?.substring(0, 15) + "...");
  
  if (!MONGO_URI || MONGO_URI.trim() === "") {
    console.error("❌ MONGO_URI environment variable is not set");
    console.error("Please set MONGO_URI in your Replit Secrets");
    throw new Error("MONGO_URI environment variable is required");
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected successfully to:", MONGO_URI.split('@')[1]?.split('/')[0] || 'database');
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.error("   Connection string starts with:", MONGO_URI?.substring(0, 20));
    throw error;
  }
}

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});
