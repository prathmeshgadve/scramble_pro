import 'dotenv/config';
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
      // ==================== 1. ANIMALS (50) ====================

      // Easy (17)
      { text: "dog", meaning: "Man's best friend", category: animalsCat, difficulty: "easy" },
      { text: "cat", meaning: "A feline pet that meows", category: animalsCat, difficulty: "easy" },
      { text: "bird", meaning: "A feathered animal that flies", category: animalsCat, difficulty: "easy" },
      { text: "fish", meaning: "An aquatic animal that swims", category: animalsCat, difficulty: "easy" },
      { text: "cow", meaning: "A farm animal that says 'moo'", category: animalsCat, difficulty: "easy" },
      { text: "pig", meaning: "A farm animal that oinks", category: animalsCat, difficulty: "easy" },
      { text: "duck", meaning: "A bird that quacks", category: animalsCat, difficulty: "easy" },
      { text: "bee", meaning: "An insect that makes honey", category: animalsCat, difficulty: "easy" },
      { text: "ant", meaning: "A tiny insect that lives in colonies", category: animalsCat, difficulty: "easy" },
      { text: "fox", meaning: "A cunning, red-furred mammal", category: animalsCat, difficulty: "easy" },
      { text: "hen", meaning: "A female chicken", category: animalsCat, difficulty: "easy" },
      { text: "bat", meaning: "A flying mammal, active at night", category: animalsCat, difficulty: "easy" },
      { text: "frog", meaning: "An amphibian that hops and ribbits", category: animalsCat, difficulty: "easy" },
      { text: "goat", meaning: "A farm animal with horns", category: animalsCat, difficulty: "easy" },
      { text: "lion", meaning: "The king of the jungle", category: animalsCat, difficulty: "easy" },
      { text: "bear", meaning: "A large mammal, loves honey", category: animalsCat, difficulty: "easy" },
      { text: "wolf", meaning: "A wild canine that howls", category: animalsCat, difficulty: "easy" },

      // Medium (17)
      { text: "tiger", meaning: "A large striped cat", category: animalsCat, difficulty: "medium" },
      { text: "horse", meaning: "An animal you can ride", category: animalsCat, difficulty: "medium" },
      { text: "sheep", meaning: "A farm animal with wool", category: animalsCat, difficulty: "medium" },
      { text: "mouse", meaning: "A small rodent, loves cheese", category: animalsCat, difficulty: "medium" },
      { text: "rabbit", meaning: "A hopping animal with long ears", category: animalsCat, difficulty: "medium" },
      { text: "monkey", meaning: "A primate that loves bananas", category: animalsCat, difficulty: "medium" },
      { text: "snake", meaning: "A reptile with no legs", category: animalsCat, difficulty: "medium" },
      { text: "shark", meaning: "A predator fish in the ocean", category: animalsCat, difficulty: "medium" },
      { text: "whale", meaning: "The largest mammal in the ocean", category: animalsCat, difficulty: "medium" },
      { text: "koala", meaning: "An Australian animal that eats eucalyptus", category: animalsCat, difficulty: "medium" },
      { text: "panda", meaning: "A black and white bear from China", category: animalsCat, difficulty: "medium" },
      { text: "eagle", meaning: "A large bird of prey", category: animalsCat, difficulty: "medium" },
      { text: "deer", meaning: "A forest animal with antlers", category: animalsCat, difficulty: "medium" },
      { text: "zebra", meaning: "A striped animal from Africa", category: animalsCat, difficulty: "medium" },
      { text: "owl", meaning: "A bird that hunts at night", category: animalsCat, difficulty: "medium" },
      { text: "giraffe", meaning: "A tall animal with a long neck", category: animalsCat, difficulty: "medium" },
      { text: "elephant", meaning: "A large animal with a trunk", category: animalsCat, difficulty: "medium" },

      // Hard (16)
      { text: "cheetah", meaning: "The fastest land animal", category: animalsCat, difficulty: "hard" },
      { text: "kangaroo", meaning: "An Australian animal that hops and has a pouch", category: animalsCat, difficulty: "hard" },
      { text: "dolphin", meaning: "A smart, aquatic mammal", category: animalsCat, difficulty: "hard" },
      { text: "penguin", meaning: "A bird that cannot fly but swims", category: animalsCat, difficulty: "hard" },
      { text: "octopus", meaning: "An eight-legged sea creature", category: animalsCat, difficulty: "hard" },
      { text: "lizard", meaning: "A reptile with scales", category: animalsCat, difficulty: "hard" },
      { text: "spider", meaning: "An arachnid with eight legs", category: animalsCat, difficulty: "hard" },
      { text: "turtle", meaning: "A reptile with a hard shell", category: animalsCat, difficulty: "hard" },
      { text: "gorilla", meaning: "A large, powerful ape", category: animalsCat, difficulty: "hard" },
      { text: "rhino", meaning: "A large animal with a horn on its nose", category: animalsCat, difficulty: "hard" },
      { text: "hippo", meaning: "A large African animal that loves water", category: animalsCat, difficulty: "hard" },
      { text: "jaguar", meaning: "A big cat found in the Americas", category: animalsCat, difficulty: "hard" },
      { text: "leopard", meaning: "A spotted big cat", category: animalsCat, difficulty: "hard" },
      { text: "hyena", meaning: "A laughing scavenger animal", category: animalsCat, difficulty: "hard" },
      { text: "platypus", meaning: "An egg-laying mammal with a duck bill", category: animalsCat, difficulty: "hard" },
      { text: "chameleon", meaning: "A lizard that changes color", category: animalsCat, difficulty: "hard" },

      // ==================== 2. TECHNOLOGY (50) ====================

      // Easy (17)
      { text: "app", meaning: "A program on your phone", category: techCat, difficulty: "easy" },
      { text: "code", meaning: "Instructions for a computer", category: techCat, difficulty: "easy" },
      { text: "web", meaning: "The 'W W W' in a URL", category: techCat, difficulty: "easy" },
      { text: "wifi", meaning: "Wireless internet connection", category: techCat, difficulty: "easy" },
      { text: "site", meaning: "A location on the internet", category: techCat, difficulty: "easy" },
      { text: "data", meaning: "Information stored by a computer", category: techCat, difficulty: "easy" },
      { text: "icon", meaning: "A small picture you click on", category: techCat, difficulty: "easy" },
      { text: "user", meaning: "A person using a computer", category: techCat, difficulty: "easy" },
      { text: "link", meaning: "A clickable connection to another page", category: techCat, difficulty: "easy" },
      { text: "file", meaning: "A document stored on a computer", category: techCat, difficulty: "easy" },
      { text: "boot", meaning: "To start up a computer", category: techCat, difficulty: "easy" },
      { text: "chat", meaning: "To talk online", category: techCat, difficulty: "easy" },
      { text: "game", meaning: "An interactive digital entertainment", category: techCat, difficulty: "easy" },
      { text: "key", meaning: "A button on a keyboard", category: techCat, difficulty: "easy" },
      { text: "cloud", meaning: "Online storage", category: techCat, difficulty: "easy" },
      { text: "email", meaning: "Digital mail", category: techCat, difficulty: "easy" },
      { text: "phone", meaning: "A mobile communication device", category: techCat, difficulty: "easy" },

      // Medium (17)
      { text: "mouse", meaning: "A device to move the cursor", category: techCat, difficulty: "medium" },
      { text: "server", meaning: "A central computer that serves data", category: techCat, difficulty: "medium" },
      { text: "binary", meaning: "A number system of 0s and 1s", category: techCat, difficulty: "medium" },
      { text: "cookie", meaning: "Data a website stores on your computer", category: techCat, difficulty: "medium" },
      { text: "cache", meaning: "A temporary storage for data", category: techCat, difficulty: "medium" },
      { text: "domain", meaning: "A website's name (e.g., google.com)", category: techCat, difficulty: "medium" },
      { text: "folder", meaning: "A digital container for files", category: techCat, difficulty: "medium" },
      { text: "keyboard", meaning: "A device used for typing", category: techCat, difficulty: "medium" },
      { text: "laptop", meaning: "A portable computer", category: techCat, difficulty: "medium" },
      { text: "memory", meaning: "A computer's short-term data storage (RAM)", category: techCat, difficulty: "medium" },
      { text: "screen", meaning: "The display of a computer or phone", category: techCat, difficulty: "medium" },
      { text: "plugin", meaning: "A small program that adds features", category: techCat, difficulty: "medium" },
      { text: "robot", meaning: "A machine that performs tasks", category: techCat, difficulty: "medium" },
      { text: "search", meaning: "To look for information online", category: techCat, difficulty: "medium" },
      { text: "pixel", meaning: "A single point of light on a screen", category: techCat, difficulty: "medium" },
      { text: "virus", meaning: "Harmful software", category: techCat, difficulty: "medium" },
      { text: "smart", meaning: "A device connected to the internet", category: techCat, difficulty: "medium" },

      // Hard (16)
      { text: "algorithm", meaning: "A set of rules for a computer to follow", category: techCat, difficulty: "hard" },
      { text: "database", meaning: "An organized collection of data", category: techCat, difficulty: "hard" },
      { text: "encryption", meaning: "The process of encoding information", category: techCat, difficulty: "hard" },
      { text: "firewall", meaning: "A security system for a network", category: techCat, difficulty: "hard" },
      { text: "hardware", meaning: "The physical parts of a computer", category: techCat, difficulty: "hard" },
      { text: "software", meaning: "The programs on a computer", category: techCat, difficulty: "hard" },
      { text: "internet", meaning: "A global network of computers", category: techCat, difficulty: "hard" },
      { text: "bandwidth", meaning: "The amount of data that can be transferred", category: techCat, difficulty: "hard" },
      { text: "processor", meaning: "The 'brain' of the computer (CPU)", category: techCat, difficulty: "hard" },
      { text: "router", meaning: "A device that directs internet traffic", category: techCat, difficulty: "hard" },
      { text: "protocol", meaning: "A set of rules for data communication (e.g., HTTP)", category: techCat, difficulty: "hard" },
      { text: "javascript", meaning: "A popular programming language for the web", category: techCat, difficulty: "hard" },
      { text: "python", meaning: "A versatile, high-level programming language", category: techCat, difficulty: "hard" },
      { text: "authentication", meaning: "The process of verifying who a user is", category: techCat, difficulty: "hard" },
      { text: "blockchain", meaning: "A decentralized, distributed ledger system", category: techCat, difficulty: "hard" },
      { text: "cryptocurrency", meaning: "A digital currency, like Bitcoin", category: techCat, difficulty: "hard" },

      // ==================== 3. NATURE (50) ====================

      // Easy (17)
      { text: "sun", meaning: "The star at the center of our solar system", category: natureCat, difficulty: "easy" },
      { text: "moon", meaning: "The natural satellite of the Earth", category: natureCat, difficulty: "easy" },
      { text: "star", meaning: "A bright point of light in the night sky", category: natureCat, difficulty: "easy" },
      { text: "sky", meaning: "The atmosphere above the Earth", category: natureCat, difficulty: "easy" },
      { text: "tree", meaning: "A tall plant with a trunk and branches", category: natureCat, difficulty: "easy" },
      { text: "flower", meaning: "The reproductive part of a plant", category: natureCat, difficulty: "easy" },
      { text: "rain", meaning: "Water falling from the clouds", category: natureCat, difficulty: "easy" },
      { text: "snow", meaning: "Frozen water crystals that fall from the sky", category: natureCat, difficulty: "easy" },
      { text: "wind", meaning: "Moving air", category: natureCat, difficulty: "easy" },
      { text: "river", meaning: "A large natural stream of water", category: natureCat, difficulty: "easy" },
      { text: "lake", meaning: "A large body of water surrounded by land", category: natureCat, difficulty: "easy" },
      { text: "hill", meaning: "A small mountain", category: natureCat, difficulty: "easy" },
      { text: "leaf", meaning: "Part of a plant, usually green", category: natureCat, difficulty: "easy" },
      { text: "rock", meaning: "A hard, solid mineral material", category: natureCat, difficulty: "easy" },
      { text: "sand", meaning: "Tiny grains of rock, found on beaches", category: natureCat, difficulty: "easy" },
      { text: "sea", meaning: "A large body of salt water", category: natureCat, difficulty: "easy" },
      { text: "ice", meaning: "Frozen water", category: natureCat, difficulty: "easy" },

      // Medium (17)
      { text: "ocean", meaning: "A very large sea", category: natureCat, difficulty: "medium" },
      { text: "forest", meaning: "A large area covered with trees", category: natureCat, difficulty: "medium" },
      { text: "jungle", meaning: "A dense, tropical forest", category: natureCat, difficulty: "medium" },
      { text: "desert", meaning: "A dry, sandy region", category: natureCat, difficulty: "medium" },
      { text: "mountain", meaning: "A very high hill", category: natureCat, difficulty: "medium" },
      { text: "volcano", meaning: "A mountain that can erupt with lava", category: natureCat, difficulty: "medium" },
      { text: "island", meaning: "A piece of land surrounded by water", category: natureCat, difficulty: "medium" },
      { text: "beach", meaning: "A sandy or pebbly shore", category: natureCat, difficulty: "medium" },
      { text: "cave", meaning: "A large underground chamber", category: natureCat, difficulty: "medium" },
      { text: "cloud", meaning: "A visible mass of water droplets in the sky", category: natureCat, difficulty: "medium" },
      { text: "valley", meaning: "A low area of land between hills or mountains", category: natureCat, difficulty: "medium" },
      { text: "storm", meaning: "A period of bad weather with strong winds and rain", category: natureCat, difficulty: "medium" },
      { text: "plant", meaning: "A living organism that grows in the earth", category: natureCat, difficulty: "medium" },
      { text: "root", meaning: "The part of a plant that grows underground", category: natureCat, difficulty: "medium" },
      { text: "grass", meaning: "A common plant with green blades", category: natureCat, difficulty: "medium" },
      { text: "planet", meaning: "A large celestial body orbiting a star", category: natureCat, difficulty: "medium" },
      { text: "comet", meaning: "A celestial body with a tail of gas and dust", category: natureCat, difficulty: "medium" },

      // Hard (16)
      { text: "earthquake", meaning: "A sudden shaking of the ground", category: natureCat, difficulty: "hard" },
      { text: "hurricane", meaning: "A severe tropical storm with strong winds", category: natureCat, difficulty: "hard" },
      { text: "tornado", meaning: "A destructive, rotating column of air", category: natureCat, difficulty: "hard" },
      { text: "tsunami", meaning: "A giant wave caused by an earthquake", category: natureCat, difficulty: "hard" },
      { text: "glacier", meaning: "A large, slow-moving river of ice", category: natureCat, difficulty: "hard" },
      { text: "canyon", meaning: "A deep gorge, often with a river", category: natureCat, difficulty: "hard" },
      { text: "waterfall", meaning: "A cascade of water falling from a height", category: natureCat, difficulty: "hard" },
      { text: "atmosphere", meaning: "The gases surrounding the Earth", category: natureCat, difficulty: "hard" },
      { text: "ecosystem", meaning: "A community of living organisms", category: natureCat, difficulty: "hard" },
      { text: "environment", meaning: "The natural world or surroundings", category: natureCat, difficulty: "hard" },
      { text: "horizon", meaning: "The line where the sky and Earth appear to meet", category: natureCat, difficulty: "hard" },
      { text: "lightning", meaning: "An electrical discharge in the sky", category: natureCat, difficulty: "hard" },
      { text: "nebula", meaning: "A cloud of gas and dust in space", category: natureCat, difficulty: "hard" },
      { text: "galaxy", meaning: "A system of millions or billions of stars", category: natureCat, difficulty: "hard" },
      { text: "aurora", meaning: "Natural light display in the sky (e.g., Northern Lights)", category: natureCat, difficulty: "hard" },
      { text: "monsoon", meaning: "A seasonal prevailing wind in South and Southeast Asia", category: natureCat, difficulty: "hard" },

      // ==================== 4. FOOD (50) ====================

      // Easy (17)
      { text: "apple", meaning: "A round fruit, often red or green", category: foodCat, difficulty: "easy" },
      { text: "bread", meaning: "A baked food made from flour and water", category: foodCat, difficulty: "easy" },
      { text: "cheese", meaning: "A food made from pressed milk curds", category: foodCat, difficulty: "easy" },
      { text: "milk", meaning: "A white liquid produced by mammals", category: foodCat, difficulty: "easy" },
      { text: "egg", meaning: "An oval-shaped food from a bird, usually a chicken", category: foodCat, difficulty: "easy" },
      { text: "cake", meaning: "A sweet baked good", category: foodCat, difficulty: "easy" },
      { text: "rice", meaning: "A grain used as a staple food", category: foodCat, difficulty: "easy" },
      { text: "soup", meaning: "A liquid dish, typically savory", category: foodCat, difficulty: "easy" },
      { text: "fish", meaning: "An animal that swims, cooked as food", category: foodCat, difficulty: "easy" },
      { text: "meat", meaning: "Animal flesh eaten as food", category: foodCat, difficulty: "easy" },
      { text: "salt", meaning: "A white mineral used to flavor food", category: foodCat, difficulty: "easy" },
      { text: "sugar", meaning: "A sweet crystalline substance", category: foodCat, difficulty: "easy" },
      { text: "tea", meaning: "A hot drink made from steeped leaves", category: foodCat, difficulty: "easy" },
      { text: "juice", meaning: "The liquid from fruit or vegetables", category: foodCat, difficulty: "easy" },
      { text: "grape", meaning: "A small, round fruit, often green or purple", category: foodCat, difficulty: "easy" },
      { text: "pear", meaning: "A fruit with a sweet, soft flesh", category: foodCat, difficulty: "easy" },
      { text: "bean", meaning: "A seed, or the pod, of a plant used as a vegetable", category: foodCat, difficulty: "easy" },

      // Medium (17)
      { text: "banana", meaning: "A long, curved yellow fruit", category: foodCat, difficulty: "medium" },
      { text: "orange", meaning: "A round, citrus fruit", category: foodCat, difficulty: "medium" },
      { text: "potato", meaning: "A starchy root vegetable", category: foodCat, difficulty: "medium" },
      { text: "tomato", meaning: "A red fruit, often used as a vegetable", category: foodCat, difficulty: "medium" },
      { text: "onion", meaning: "A vegetable with strong-smelling layers", category: foodCat, difficulty: "medium" },
      { text: "garlic", meaning: "A plant bulb with a strong, pungent flavor", category: foodCat, difficulty: "medium" },
      { text: "carrot", meaning: "An orange root vegetable", category: foodCat, difficulty: "medium" },
      { text: "lettuce", meaning: "A leafy green vegetable used in salads", category: foodCat, difficulty: "medium" },
      { text: "chicken", meaning: "A type of poultry", category: foodCat, difficulty: "medium" },
      { text: "beef", meaning: "Meat from a cow", category: foodCat, difficulty: "medium" },
      { text: "pork", meaning: "Meat from a pig", category: foodCat, difficulty: "medium" },
      { text: "pasta", meaning: "An Italian dish made from dough", category: foodCat, difficulty: "medium" },
      { text: "pizza", meaning: "A baked dish with toppings on a round crust", category: foodCat, difficulty: "medium" },
      { text: "burger", meaning: "A ground meat patty, often in a bun", category: foodCat, difficulty: "medium" },
      { text: "coffee", meaning: "A hot drink made from roasted beans", category: foodCat, difficulty: "medium" },
      { text: "butter", meaning: "A yellow fat made from cream", category: foodCat, difficulty: "medium" },
      { text: "cookie", meaning: "A small, sweet baked good", category: foodCat, difficulty: "medium" },

      // Hard (16)
      { text: "chocolate", meaning: "A sweet food made from cacao beans", category: foodCat, difficulty: "hard" },
      { text: "strawberry", meaning: "A sweet, red fruit with seeds on the outside", category: foodCat, difficulty: "hard" },
      { text: "pineapple", meaning: "A tropical fruit with a tough, spiky skin", category: foodCat, difficulty: "hard" },
      { text: "watermelon", meaning: "A large, green fruit with red, juicy flesh", category: foodCat, difficulty: "hard" },
      { text: "cucumber", meaning: "A green vegetable, long and cylindrical", category: foodCat, difficulty: "hard" },
      { text: "broccoli", meaning: "A green vegetable with a flowering head", category: foodCat, difficulty: "hard" },
      { text: "spinach", meaning: "A leafy green vegetable", category: foodCat, difficulty: "hard" },
      { text: "mushroom", meaning: "A type of fungus, used in cooking", category: foodCat, difficulty: "hard" },
      { text: "avocado", meaning: "A fruit with green skin and a large pit", category: foodCat, difficulty: "hard" },
      { text: "spaghetti", meaning: "A type of long, thin pasta", category: foodCat, difficulty: "hard" },
      { text: "lasagna", meaning: "An Italian dish with layers of pasta, cheese, and sauce", category: foodCat, difficulty: "hard" },
      { text: "sandwich", meaning: "Food with fillings between two slices of bread", category: foodCat, difficulty: "hard" },
      { text: "croissant", meaning: "A flaky, crescent-shaped pastry", category: foodCat, difficulty: "hard" },
      { text: "sushi", meaning: "A Japanese dish of rice, fish, and seaweed", category: foodCat, difficulty: "hard" },
      { text: "paella", meaning: "A Spanish rice dish with saffron and seafood", category: foodCat, difficulty: "hard" },
      { text: "bouillabaisse", meaning: "A traditional French fish stew", category: foodCat, difficulty: "hard" },

      // ==================== 5. SCIENCE (50) ====================

      // Easy (17)
      { text: "atom", meaning: "The smallest unit of matter", category: scienceCat, difficulty: "easy" },
      { text: "gas", meaning: "A state of matter, like air", category: scienceCat, difficulty: "easy" },
      { text: "ice", meaning: "The solid state of water", category: scienceCat, difficulty: "easy" },
      { text: "lab", meaning: "A place for scientific experiments", category: scienceCat, difficulty: "easy" },
      { text: "mass", meaning: "The amount of matter in an object", category: scienceCat, difficulty: "easy" },
      { text: "sun", meaning: "The star our planet orbits", category: scienceCat, difficulty: "easy" },
      { text: "moon", meaning: "Earth's natural satellite", category: scienceCat, difficulty: "easy" },
      { text: "star", meaning: "A bright celestial body", category: scienceCat, difficulty: "easy" },
      { text: "heat", meaning: "A form of energy", category: scienceCat, difficulty: "easy" },
      { text: "light", meaning: "What allows us to see", category: scienceCat, difficulty: "easy" },
      { text: "water", meaning: "H2O", category: scienceCat, difficulty: "easy" },
      { text: "acid", meaning: "A substance with a pH less than 7", category: scienceCat, difficulty: "easy" },
      { text: "base", meaning: "A substance with a pH greater than 7", category: scienceCat, difficulty: "easy" },
      { text: "DNA", meaning: "The molecule that carries genetic information", category: scienceCat, difficulty: "easy" },
      { text: "cell", meaning: "The basic unit of life", category: scienceCat, difficulty: "easy" },
      { text: "gene", meaning: "A unit of heredity", category: scienceCat, difficulty: "easy" },
      { text: "lava", meaning: "Molten rock from a volcano", category: scienceCat, difficulty: "easy" },

      // Medium (17)
      { text: "energy", meaning: "The power to do work", category: scienceCat, difficulty: "medium" },
      { text: "force", meaning: "A push or a pull", category: scienceCat, difficulty: "medium" },
      { text: "gravity", meaning: "The force that pulls objects down", category: scienceCat, difficulty: "medium" },
      { text: "magnet", meaning: "An object that produces a magnetic field", category: scienceCat, difficulty: "medium" },
      { text: "planet", meaning: "A celestial body orbiting a star (e.g., Earth)", category: scienceCat, difficulty: "medium" },
      { text: "space", meaning: "The boundless, three-dimensional extent", category: scienceCat, difficulty: "medium" },
      { text: "sound", meaning: "Vibrations that travel through the air", category: scienceCat, difficulty: "medium" },
      { text: "liquid", meaning: "A state of matter, like water", category: scienceCat, difficulty: "medium" },
      { text: "solid", meaning: "A state of matter, like ice", category: scienceCat, difficulty: "medium" },
      { text: "fossil", meaning: "The preserved remains of an ancient organism", category: scienceCat, difficulty: "medium" },
      { text: "brain", meaning: "The organ in your head", category: scienceCat, difficulty: "medium" },
      { text: "heart", meaning: "The organ that pumps blood", category: scienceCat, difficulty: "medium" },
      { text: "blood", meaning: "The red liquid in your veins", category: scienceCat, difficulty: "medium" },
      { text: "virus", meaning: "A small infectious agent", category: scienceCat, difficulty: "medium" },
      { text: "bacteria", meaning: "Single-celled microorganisms", category: scienceCat, difficulty: "medium" },
      { text: "oxygen", meaning: "The gas we breathe", category: scienceCat, difficulty: "medium" },
      { text: "carbon", meaning: "A chemical element, the basis of life", category: scienceCat, difficulty: "medium" },

      // Hard (16)
      { text: "molecule", meaning: "A group of atoms bonded together", category: scienceCat, difficulty: "hard" },
      { text: "electron", meaning: "A negatively charged subatomic particle", category: scienceCat, difficulty: "hard" },
      { text: "proton", meaning: "A positively charged subatomic particle", category: scienceCat, difficulty: "hard" },
      { text: "neutron", meaning: "A subatomic particle with no charge", category: scienceCat, difficulty: "hard" },
      { text: "nucleus", meaning: "The center of an atom", category: scienceCat, difficulty: "hard" },
      { text: "velocity", meaning: "Speed in a given direction", category: scienceCat, difficulty: "hard" },
      { text: "photosynthesis", meaning: "The process plants use to make food", category: scienceCat, difficulty: "hard" },
      { text: "evolution", meaning: "The process of change over time in living organisms", category: scienceCat, difficulty: "hard" },
      { text: "chromosome", meaning: "A structure in the cell nucleus that carries genes", category: scienceCat, difficulty: "hard" },
      { text: "galaxy", meaning: "A large system of stars", category: scienceCat, difficulty: "hard" },
      { text: "asteroid", meaning: "A small rocky body orbiting the sun", category: scienceCat, difficulty: "hard" },
      { text: "blackhole", meaning: "An object in space with gravity so strong, not even light can escape", category: scienceCat, difficulty: "hard" },
      { text: "metabolism", meaning: "The chemical processes in a living organism", category: scienceCat, difficulty: "hard" },
      { text: "catalyst", meaning: "A substance that speeds up a chemical reaction", category: scienceCat, difficulty: "hard" },
      { text: "enzyme", meaning: "A biological catalyst", category: scienceCat, difficulty: "hard" },
      { text: "thermodynamics", meaning: "The branch of physics dealing with heat and energy", category: scienceCat, difficulty: "hard" },
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
