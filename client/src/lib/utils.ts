import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrambleWord(word: string): string {
  const chars = word.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const scrambled = chars.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
}

export function calculatePoints(
  difficulty: "easy" | "medium" | "hard",
  timeRemaining: number,
  usedHint: boolean,
  maxTime: number = 30
): number {
  const basePoints = {
    easy: 10,
    medium: 20,
    hard: 30,
  };

  const base = basePoints[difficulty];
  const timeBonus = Math.floor((timeRemaining / maxTime) * base * 0.5);
  const hintPenalty = usedHint ? 5 : 0;

  return Math.max(0, base + timeBonus - hintPenalty);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(seconds: number): string {
  return `${seconds}s`;
}
