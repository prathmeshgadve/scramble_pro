import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/User";
import { Category } from "./models/Category";
import { Word } from "./models/Word";

const MONGO_URI = process.env.MONGO_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const ADMIN_PASS = process.env.ADMIN_PASS!;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Word.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create admin user
    const adminPasswordHash = await bcrypt.hash(ADMIN_PASS, 10);
    const admin = await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      role: "admin",
    });
    console.log("👤 Admin user created:", admin.email);

    // Create categories
    const categories = await Category.insertMany([
      {
        name: "Animals",
        description: "Words related to animals and wildlife",
      },
      {
        name: "Technology",
        description: "Modern technology and computing terms",
      },
      {
        name: "Nature",
        description: "Natural world and environmental terms",
      },
      {
        name: "Food",
        description: "Food, cooking, and culinary terms",
      },
      {
        name: "Science",
        description: "Scientific concepts and terminology",
      },
    ]);
    console.log("📁 Categories created:", categories.length);

    // Get category IDs
    const animalsCat = categories.find((c) => c.name === "Animals")!._id;
    const techCat = categories.find((c) => c.name === "Technology")!._id;
    const natureCat = categories.find((c) => c.name === "Nature")!._id;
    const foodCat = categories.find((c) => c.name === "Food")!._id;
    const scienceCat = categories.find((c) => c.name === "Science")!._id;

    // Create words
    const words = await Word.insertMany([
      // Animals - Easy
      { text: "cat", meaning: "A small domesticated carnivorous mammal", category: animalsCat, difficulty: "easy" },
      { text: "dog", meaning: "A domesticated carnivorous mammal that typically has a long snout", category: animalsCat, difficulty: "easy" },
      { text: "fish", meaning: "An aquatic animal with gills and fins", category: animalsCat, difficulty: "easy" },
      { text: "bird", meaning: "A warm-blooded egg-laying vertebrate with feathers and wings", category: animalsCat, difficulty: "easy" },
      { text: "lion", meaning: "A large tawny-colored cat that lives in prides", category: animalsCat, difficulty: "easy" },
      
      // Animals - Medium
      { text: "elephant", meaning: "A large mammal with a trunk and ivory tusks", category: animalsCat, difficulty: "medium" },
      { text: "dolphin", meaning: "A small gregarious toothed whale with a beaklike snout", category: animalsCat, difficulty: "medium" },
      { text: "penguin", meaning: "A flightless seabird of the southern hemisphere", category: animalsCat, difficulty: "medium" },
      { text: "giraffe", meaning: "A tall African mammal with a very long neck", category: animalsCat, difficulty: "medium" },
      { text: "kangaroo", meaning: "A large Australian marsupial with powerful hind legs", category: animalsCat, difficulty: "medium" },
      
      // Animals - Hard
      { text: "chameleon", meaning: "A lizard that can change color to match its surroundings", category: animalsCat, difficulty: "hard" },
      { text: "platypus", meaning: "An egg-laying mammal with a duck bill and webbed feet", category: animalsCat, difficulty: "hard" },
      { text: "rhinoceros", meaning: "A large heavily built plant-eating mammal with one or two horns", category: animalsCat, difficulty: "hard" },
      
      // Technology - Easy
      { text: "phone", meaning: "A device used for voice communication", category: techCat, difficulty: "easy" },
      { text: "mouse", meaning: "A small handheld device for controlling a computer cursor", category: techCat, difficulty: "easy" },
      { text: "email", meaning: "Messages distributed by electronic means", category: techCat, difficulty: "easy" },
      { text: "laptop", meaning: "A portable computer suitable for use while traveling", category: techCat, difficulty: "easy" },
      { text: "router", meaning: "A device that forwards data packets between computer networks", category: techCat, difficulty: "easy" },
      
      // Technology - Medium
      { text: "software", meaning: "Programs and operating systems used by a computer", category: techCat, difficulty: "medium" },
      { text: "database", meaning: "An organized collection of structured information or data", category: techCat, difficulty: "medium" },
      { text: "internet", meaning: "The global system of interconnected computer networks", category: techCat, difficulty: "medium" },
      { text: "browser", meaning: "A program used to access and navigate the World Wide Web", category: techCat, difficulty: "medium" },
      { text: "firewall", meaning: "A security system that monitors and controls network traffic", category: techCat, difficulty: "medium" },
      
      // Technology - Hard
      { text: "algorithm", meaning: "A process or set of rules followed in calculations", category: techCat, difficulty: "hard" },
      { text: "encryption", meaning: "The process of converting information into code", category: techCat, difficulty: "hard" },
      { text: "blockchain", meaning: "A decentralized digital ledger of transactions", category: techCat, difficulty: "hard" },
      
      // Nature - Easy
      { text: "tree", meaning: "A woody perennial plant with a single main stem", category: natureCat, difficulty: "easy" },
      { text: "rain", meaning: "Moisture condensed from the atmosphere that falls in drops", category: natureCat, difficulty: "easy" },
      { text: "lake", meaning: "A large body of water surrounded by land", category: natureCat, difficulty: "easy" },
      { text: "cloud", meaning: "A visible mass of condensed water vapor in the atmosphere", category: natureCat, difficulty: "easy" },
      { text: "river", meaning: "A large natural stream of water flowing in a channel", category: natureCat, difficulty: "easy" },
      
      // Nature - Medium
      { text: "mountain", meaning: "A large natural elevation of the earth's surface", category: natureCat, difficulty: "medium" },
      { text: "volcano", meaning: "A rupture in the earth's crust that allows hot lava to escape", category: natureCat, difficulty: "medium" },
      { text: "glacier", meaning: "A slowly moving mass of ice formed by snow accumulation", category: natureCat, difficulty: "medium" },
      { text: "canyon", meaning: "A deep gorge typically with a river flowing through it", category: natureCat, difficulty: "medium" },
      { text: "forest", meaning: "A large area covered with trees and undergrowth", category: natureCat, difficulty: "medium" },
      
      // Nature - Hard
      { text: "ecosystem", meaning: "A biological community of interacting organisms", category: natureCat, difficulty: "hard" },
      { text: "photosynthesis", meaning: "The process plants use to convert light into energy", category: natureCat, difficulty: "hard" },
      
      // Food - Easy
      { text: "bread", meaning: "Food made of flour, water, and yeast mixed and baked", category: foodCat, difficulty: "easy" },
      { text: "pizza", meaning: "A dish of Italian origin with various toppings on a flat round base", category: foodCat, difficulty: "easy" },
      { text: "apple", meaning: "A round fruit with red or green skin and crisp flesh", category: foodCat, difficulty: "easy" },
      { text: "cheese", meaning: "A food made from pressed milk curds", category: foodCat, difficulty: "easy" },
      { text: "pasta", meaning: "Italian food made from flour, eggs, and water", category: foodCat, difficulty: "easy" },
      
      // Food - Medium
      { text: "spaghetti", meaning: "Long thin cylindrical pasta strands", category: foodCat, difficulty: "medium" },
      { text: "chocolate", meaning: "A sweet food made from roasted cacao seeds", category: foodCat, difficulty: "medium" },
      { text: "sandwich", meaning: "Food consisting of two pieces of bread with a filling", category: foodCat, difficulty: "medium" },
      { text: "vegetable", meaning: "A plant or part of a plant used as food", category: foodCat, difficulty: "medium" },
      { text: "ingredient", meaning: "Any of the foods or substances combined to make a dish", category: foodCat, difficulty: "medium" },
      
      // Food - Hard
      { text: "cappuccino", meaning: "Espresso coffee mixed with steamed milk", category: foodCat, difficulty: "hard" },
      { text: "quesadilla", meaning: "A Mexican dish with cheese between tortillas", category: foodCat, difficulty: "hard" },
      
      // Science - Easy
      { text: "atom", meaning: "The basic unit of a chemical element", category: scienceCat, difficulty: "easy" },
      { text: "energy", meaning: "The capacity to do work or produce heat", category: scienceCat, difficulty: "easy" },
      { text: "planet", meaning: "A celestial body orbiting a star", category: scienceCat, difficulty: "easy" },
      { text: "oxygen", meaning: "A colorless gas essential for life", category: scienceCat, difficulty: "easy" },
      { text: "gravity", meaning: "The force that attracts objects toward the center of the earth", category: scienceCat, difficulty: "easy" },
      
      // Science - Medium
      { text: "molecule", meaning: "A group of atoms bonded together", category: scienceCat, difficulty: "medium" },
      { text: "electron", meaning: "A subatomic particle with a negative electric charge", category: scienceCat, difficulty: "medium" },
      { text: "velocity", meaning: "The speed of something in a given direction", category: scienceCat, difficulty: "medium" },
      { text: "bacteria", meaning: "Single-celled microorganisms", category: scienceCat, difficulty: "medium" },
      { text: "particle", meaning: "A minute portion of matter", category: scienceCat, difficulty: "medium" },
      
      // Science - Hard
      { text: "chromosome", meaning: "A threadlike structure carrying genetic information", category: scienceCat, difficulty: "hard" },
      { text: "thermodynamics", meaning: "The branch of physics dealing with heat and temperature", category: scienceCat, difficulty: "hard" },
      { text: "metabolism", meaning: "Chemical processes occurring within a living organism", category: scienceCat, difficulty: "hard" },
    ]);

    console.log("📝 Words created:", words.length);
    console.log("\n✨ Seed data created successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Admin: ${ADMIN_EMAIL}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Words: ${words.length}`);
    console.log("\n🎮 Ready to play!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();
