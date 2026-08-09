import type { SessionLog } from "../types";

/**
 * Calculate consecutive-day reading streak.
 * Counts backwards from today (or yesterday as grace for current day),
 * requiring at least one session log per calendar date.
 *
 * Returns 0 if no streak, even if there are individual sessions scattered.
 */
export function calculateStreak(sessions: SessionLog[], paused: boolean): number {
  if (paused) return 0;

  // Collect unique dates that have at least one real session (pages > 0) OR bedtime
  // Actually per PRD: "Consecutive calendar days with ≥1 session log"
  // Any session log counts — including bedtime-only entries
  const activeDates = new Set<string>();
  for (const s of sessions) {
    activeDates.add(s.date);
  }

  if (activeDates.size === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  // Allow grace: if today has no session, check if yesterday has one
  // (user might not have logged yet today, but yesterday's count is the active streak)
  const todayStr = formatDate(today);
  if (!activeDates.has(todayStr)) {
    // Check yesterday first — if yesterday has no session, streak is 0
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    if (!activeDates.has(yesterdayStr)) {
      return 0; // Neither today nor yesterday has a session — no active streak
    }
    // Start counting from yesterday
    checkDate = yesterday;
  }

  // Count backwards from the starting date
  while (true) {
    const dateStr = formatDate(checkDate);
    if (activeDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getTodayDate(): string {
  return formatDate(new Date());
}