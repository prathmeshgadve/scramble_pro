# Scrambled Word Game

A full-stack MERN web application featuring 10-round word scrambling gameplay with hints, timers, scoring, global leaderboards, and an admin dashboard.

## Features

### 🎮 Gameplay
- **10 Rounds per Game**: Challenge yourself with 10 exciting rounds of word unscrambling
- **Timer System**: 30 seconds per round with time-based bonus points
- **Smart Hints**: Get word meanings when stuck (costs 5 points)
- **Dynamic Scoring**: Points based on difficulty, speed, and hint usage
- **Categories & Difficulties**: Choose from multiple categories with easy, medium, and hard levels

### 🏆 Leaderboard
- Global leaderboard showing top 20 players
- Score tracking with category and difficulty breakdown
- Real-time updates after each game

### 👤 User Features
- User registration and authentication (JWT + bcrypt)
- Personal profile with stats and game history
- Best score tracking
- Games played counter

### 🛠️ Admin Dashboard
- Complete word management (add/edit/delete)
- Category management
- Leaderboard moderation
- User overview
- Protected admin routes

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Framer Motion** for animations
- **Howler.js** for sound effects
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)

### Environment Variables

Create the following secrets in your Replit environment:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASS=your_admin_password
```

### Installation

1. The project dependencies are already installed via Replit's packager

2. Seed the database with initial data:
```bash
npm run seed
```

This will create:
- Admin user (using ADMIN_EMAIL and ADMIN_PASS from secrets)
- 5 categories (Animals, Technology, Nature, Food, Science)
- 60+ words across different difficulties

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components (shadcn/ui)
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
│   └── index.html
├── server/                # Backend Express application
│   ├── models/           # Mongoose models
│   ├── middleware/       # Auth middleware
│   ├── routes.ts         # API routes
│   ├── db.ts            # MongoDB connection
│   ├── seed.ts          # Database seeding script
│   └── index.ts         # Server entry point
├── shared/              # Shared TypeScript schemas
│   └── schema.ts        # Zod validation schemas
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Categories
- `GET /api/categories` - Get all categories

### Games
- `GET /api/games/start?category=X&difficulty=Y` - Start new game (requires auth)
- `POST /api/games/finish` - Finish game and save result (requires auth)
- `GET /api/games/recent` - Get user's recent games (requires auth)
- `GET /api/games/history` - Get user's game history (requires auth)

### Leaderboard
- `GET /api/leaderboard?limit=20` - Get top scores

### Admin (requires admin auth)
- `GET /api/admin/words` - Get all words
- `POST /api/admin/words` - Add new word
- `DELETE /api/admin/words/:id` - Delete word
- `POST /api/admin/categories` - Add new category
- `DELETE /api/admin/categories/:id` - Delete category
- `DELETE /api/admin/leaderboard/:id` - Remove leaderboard entry
- `GET /api/admin/users` - Get all users

## Game Rules

1. **Choose Your Challenge**: Select a category and difficulty level
2. **Unscramble Words**: You have 30 seconds per round to solve each scrambled word
3. **Scoring**:
   - Easy words: 10 base points
   - Medium words: 20 base points
   - Hard words: 30 base points
   - Time bonus: Up to 50% of base points based on remaining time
   - Hint penalty: -5 points
4. **Win**: Complete all 10 rounds and save your score to the leaderboard!

## Deployment

The application is configured for Replit deployment:

1. Ensure all environment secrets are set
2. Run the seed script to populate the database
3. The app will be available on your Replit domain

## License

MIT

## Credits

Built with modern web technologies for an engaging word game experience!
