// GitHub contribution history, shared by the Cloudflare function that fetches it
// (functions/api/github-contributions.ts) and the graph that draws it.

export const GITHUB_LOGIN = 'raghavbhati';

export const CONTRIBUTIONS_QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`;

/** The part of GitHub's `contributionCalendar` that CONTRIBUTIONS_QUERY asks for. */
export interface ContributionCalendar {
  totalContributions: number;
  weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }>;
}

export interface ContributionDay {
  /** YYYY-MM-DD. */
  date: string;
  count: number;
}

/** What /api/github-contributions returns: every day of the last year, oldest first. */
export interface Contributions {
  total: number;
  days: ContributionDay[];
}

export function toDailyContributions(calendar: ContributionCalendar): Contributions {
  return {
    total: calendar.totalContributions,
    days: calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount }))
    ),
  };
}

/**
 * A public mirror of GitHub's contribution calendar that browsers can read directly (it
 * allows any origin) and that needs no token. The graph falls back to it wherever the
 * site's own /api/github-contributions isn't running — the dev server, or a host without
 * GITHUB_TOKEN set.
 */
export const PUBLIC_CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_LOGIN}?y=last`;

/** What PUBLIC_CONTRIBUTIONS_URL returns: a count for every day of the last year. */
export interface PublicContributions {
  total?: { lastYear?: number };
  contributions: ContributionDay[];
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function isDay(value: unknown): value is ContributionDay {
  const day = value as Partial<ContributionDay> | null;
  return typeof day?.date === 'string' && DATE.test(day.date) && typeof day?.count === 'number';
}

export function isPublicContributions(value: unknown): value is PublicContributions {
  if (!value || typeof value !== 'object') return false;
  const { contributions } = value as Partial<PublicContributions>;
  return Array.isArray(contributions) && contributions.every(isDay);
}

export function fromPublicContributions({
  total,
  contributions,
}: PublicContributions): Contributions {
  const days = contributions
    .map(({ date, count }) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return {
    total:
      typeof total?.lastYear === 'number'
        ? total.lastYear
        : days.reduce((sum, day) => sum + day.count, 0),
    days,
  };
}

export function isContributions(value: unknown): value is Contributions {
  if (!value || typeof value !== 'object') return false;
  const { total, days } = value as Partial<Contributions>;
  return typeof total === 'number' && Array.isArray(days) && days.every(isDay);
}

const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

/**
 * Days laid out the way GitHub draws them: one column per week, Sunday at the top. Slots
 * before the first day or after the last are null.
 */
export function calendarWeeks(
  days: readonly ContributionDay[]
): Array<Array<ContributionDay | null>> {
  const weeks: Array<Array<ContributionDay | null>> = [];
  let previous: string | null = null;
  for (const day of days) {
    const index = weekday(day.date);
    const start = new Date(`${day.date}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() - index);
    const week = start.toISOString().slice(0, 10);
    if (week !== previous) weeks.push(Array<ContributionDay | null>(7).fill(null));
    previous = week;
    weeks[weeks.length - 1][index] = day;
  }
  return weeks;
}

export type Level = 0 | 1 | 2 | 3 | 4;

/**
 * How strongly to shade a day, from 0 (no contributions) to 4 (the busiest), split by the
 * quartiles of the days that had any — the way GitHub shades its own calendar.
 */
export function contributionLevels(days: readonly ContributionDay[]): (count: number) => Level {
  const busy = days
    .map((day) => day.count)
    .filter((count) => count > 0)
    .sort((a, b) => a - b);
  const quartile = (q: number) => busy[Math.floor(q * (busy.length - 1))];
  const max = busy[busy.length - 1] ?? 0;
  const [q1, q2, q3] = busy.length ? [quartile(0.25), quartile(0.5), quartile(0.75)] : [0, 0, 0];
  return (count) => {
    if (count <= 0) return 0;
    if (count >= max) return 4;
    if (count <= q1) return 1;
    if (count <= q2) return 2;
    if (count <= q3) return 3;
    return 4;
  };
}
