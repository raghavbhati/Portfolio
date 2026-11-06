const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const DATE = /(?:(\d{1,2})(?:st|nd|rd|th)?\s+)?([a-z]{3})[a-z]*\.?,?\s+(\d{4})/gi;

/**
 * Reads the loose dates the memory data is written in — "Oct 2024", "1st Jul 2025",
 * "12–16 Oct 2024", "Dec 2024 – Jan 2025" — as a timestamp. A range counts from its last
 * day. Anything it can't read sorts first.
 */
export function memoryTime(date: string): number {
  const matches = Array.from(date.matchAll(DATE)).filter((match) =>
    MONTHS.includes(match[2].toLowerCase())
  );
  const last = matches[matches.length - 1];
  if (last) {
    return Date.UTC(Number(last[3]), MONTHS.indexOf(last[2].toLowerCase()), Number(last[1] ?? 1));
  }
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? -Infinity : parsed;
}

/** The id of the most recent memory; the first one listed wins a tie. */
export function latestMemoryId<T extends { id: string }>(
  memories: readonly T[],
  dateOf: (memory: T) => string
) {
  let latest: { id: string; time: number } | null = null;
  for (const memory of memories) {
    const time = memoryTime(dateOf(memory));
    if (!latest || time > latest.time) latest = { id: memory.id, time };
  }
  return latest?.id ?? null;
}
