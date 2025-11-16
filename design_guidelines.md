# Design Guidelines: Scrambled Word Game

## Design Approach: Reference-Based (Gaming + Productivity Hybrid)

**Primary Inspiration:** Wordle (minimalism + focus) + Duolingo (playful engagement) + Linear (clean typography) + Kahoot (energetic feedback)

**Core Principles:**
1. **Gameplay Focus:** Remove all distractions during active rounds
2. **Playful Clarity:** Fun but sophisticated, not cartoonish
3. **Instant Feedback:** Visual rewards for correct answers, gentle correction for mistakes
4. **Information Hierarchy:** Game state always visible and clear

---

## Typography

**Font Stack:**
- Primary: 'Inter' (Google Fonts) - UI text, buttons, labels
- Display: 'Space Grotesk' (Google Fonts) - Headlines, scrambled letters, scores

**Scale:**
- Hero titles: text-6xl font-bold (Space Grotesk)
- Game letters: text-5xl font-semibold tracking-wider (Space Grotesk)
- Score/Timer: text-3xl font-bold
- Body text: text-base font-normal
- Hints/meanings: text-lg italic
- Small labels: text-sm font-medium

---

## Layout System

**Spacing Units:** Tailwind units 2, 4, 6, 8, 12, 16, 20
- Tight spacing: gap-2, p-2
- Standard spacing: gap-4, p-4, m-6
- Section spacing: py-12, py-16, py-20
- Large gaps: gap-8, gap-12

**Container Strategy:**
- Landing/Marketing: max-w-7xl mx-auto px-6
- Game screen: max-w-4xl mx-auto (keep focused)
- Admin dashboard: max-w-7xl (data tables need width)
- Leaderboard: max-w-5xl

---

## Component Library

### Navigation
**Landing:** Centered logo, right-aligned Login/Register buttons with subtle backdrop blur when over hero
**Authenticated:** Top nav with Logo (left), Profile/Leaderboard/Logout (right), sticky positioning

### Game Screen Components

**Round Indicator:**
- Horizontal progress bar showing 10 rounds as circles
- Completed: filled circles, Current: pulsing ring, Upcoming: outline only
- Position: top of game area, mb-8

**Scrambled Word Display:**
- Large letter tiles in a flex row with gap-3
- Each tile: square aspect ratio, rounded-xl, shadow-lg
- Letters centered with text-5xl
- Subtle hover lift effect (transform: translateY(-2px))

**Input Area:**
- Either drag-drop tiles OR text input with letter selection
- For drag-drop: destination slots with dashed borders when empty
- For input: large rounded-2xl input field, text-3xl, text-center

**Timer Display:**
- Circular progress ring (top-right corner)
- Numbers inside: countdown seconds
- Changes visual weight when < 5 seconds (pulse animation)
- Fixed position during round

**Hint Panel:**
- Card with rounded-xl, p-6
- "Show Hint" button initially
- Revealed: italic text with book icon, subtle background
- Shows point deduction: "(-5 points)" in smaller text

**Score Display:**
- Persistent top bar showing: Current Round Score | Total Score
- Score increases animate with scale pulse
- Use tabular numbers (font-variant-numeric: tabular-nums)

### Leaderboard
- Card-based layout for top 10
- Ranking badges: #1 (gold accent), #2 (silver), #3 (bronze)
- Each entry: Rank | Avatar/Name | Score | Category | Date
- Alternating subtle row backgrounds
- User's own entry highlighted with border

### Admin Dashboard
- Sidebar navigation (fixed left, w-64)
- Main content area with data tables
- Tab interface for: Words | Categories | Leaderboard | Users
- CRUD forms in modals with backdrop blur
- Data tables: striped rows, hover states, sortable headers

### Authentication Forms
- Centered cards (max-w-md)
- Single-column layout
- Large input fields with icons (email/lock)
- Primary button full-width
- Switch between Login/Register with underline link

### Profile Page
- Two-column on desktop: Avatar/Stats (left 1/3) | Game History (right 2/3)
- Mobile: stack vertically
- Stats cards with icons: Best Score, Games Played, Win Rate
- Game history: timeline design with connecting lines

---

## Animations (Framer Motion - Minimal, Purposeful)

**Critical Animations Only:**
1. **Correct Answer:** Letter tiles flip green with stagger, score number scales up
2. **Wrong Answer:** Tiles shake horizontally (1-2 vibrations)
3. **Round Transition:** Fade out old, slide in new scrambled word
4. **Score Save:** Confetti burst (brief, 1s) when saving to leaderboard
5. **Page Transitions:** Fade between routes (0.2s)

**Avoid:** Continuous animations, decorative motion, parallax effects

---

## Page Layouts

### Landing Page
- **Hero Section (80vh):** 
  - Centered layout with game title (Space Grotesk, text-7xl)
  - Tagline: "Unscramble. Compete. Conquer."
  - Large hero image: Abstract word tiles/letters in playful arrangement (vibrant, modern)
  - CTA buttons: "Play Now" (primary, large), "View Leaderboard" (secondary)
  - Subtle background gradient overlay on image
  
- **Features (3-column grid on desktop):**
  - Icon + Title + Short description
  - Icons from Heroicons
  - Features: "10 Rounds of Fun" | "Smart Hints" | "Global Leaderboard"
  
- **How to Play (single column, max-w-3xl):**
  - Numbered steps with visual icons
  - Clean, scannable format
  
- **Leaderboard Teaser (full-width):**
  - "Top Players This Week" heading
  - Show top 5 entries in card format
  - CTA: "See Full Leaderboard"

- **Footer:** Simple centered layout, copyright, admin login link (subtle)

### Game Screen
- Full viewport height with padding
- Centered vertical layout:
  - Round indicator (top)
  - Timer (top-right, fixed)
  - Scrambled word display (center-top)
  - Input area (center)
  - Hint button (below input)
  - Score display (persistent bar at very top)
  - Quit/Pause buttons (top-left, minimal)

### Admin Dashboard
- **Sidebar (w-64, fixed):** Logo, navigation links with icons, logout at bottom
- **Top bar:** Page title, breadcrumbs, admin user info
- **Main content:** Data tables with search, filters, pagination
- **Modals:** Centered, max-w-2xl, form layouts with clear labels

---

## Images

**Hero Image (Landing):**
- Large, vibrant image of scattered letter tiles or alphabet blocks in modern colors
- Abstract/stylized, not literal
- Position: Full-bleed background with gradient overlay
- Purpose: Establish playful, intelligent tone

**Profile Avatars:**
- User-uploaded or default geometric patterns
- Circular, consistent sizes (sm: w-10, lg: w-24)

**Empty States:**
- Simple illustrations for: No games played, No leaderboard entries
- Minimal line art style

---

## Accessibility & States

**Focus States:** 
- All interactive elements: ring-2 ring-offset-2 outline-none
- Visible keyboard navigation

**Button States:**
- Default: solid with shadow
- Hover: slight lift (translateY(-1px)) + shadow increase
- Active: translateY(0)
- Disabled: opacity-50, cursor-not-allowed

**Form Inputs:**
- Border on all states, thicker on focus
- Error states: red border + error message below
- Success states: green border (after validation)

**Loading States:**
- Spinner for async actions
- Skeleton screens for data loading (leaderboard, profile)

---

**Mobile Responsiveness:**
- Landing: Single column, hero 60vh on mobile
- Game: Reduce letter size, stack UI vertically
- Admin: Hamburger menu for sidebar, tables scroll horizontally
- Touch targets: minimum 44x44px (p-3 for buttons)