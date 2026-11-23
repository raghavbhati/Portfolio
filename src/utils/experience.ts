/**
 * Whole half-years since `start`, written the way a résumé says it: "2.5+", "3+".
 * Rounds down, so the figure never claims more than has actually passed.
 */
export function experienceYears(start: Date, now: Date = new Date()): string {
  const months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const halves = Math.max(0, Math.floor(months / 6));
  return `${halves / 2}+`;
}
