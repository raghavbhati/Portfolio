// GitHub contribution history, shared by the Cloudflare function that fetches it
// (functions/api/github-contributions.ts) and the graph that draws it.

export const GITHUB_LOGIN = 'raghavbhati';

export const CONTRIBUTIONS_QUERY = `query ($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { firstDay contributionDays { contributionCount } }
      }
    }
  }
}`;

/** The part of GitHub's `contributionCalendar` that CONTRIBUTIONS_QUERY asks for. */
export interface ContributionCalendar {
  totalContributions: number;
  weeks: Array<{ firstDay: string; contributionDays: Array<{ contributionCount: number }> }>;
}

export interface ContributionWeek {
  /** First day of the week, YYYY-MM-DD. */
  start: string;
  count: number;
}

/** What /api/github-contributions returns: the last year, oldest week first. */
export interface Contributions {
  total: number;
  weeks: ContributionWeek[];
}

export function toWeeklyContributions(calendar: ContributionCalendar): Contributions {
  return {
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((week) => ({
      start: week.firstDay,
      count: week.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0),
    })),
  };
}

export function isContributions(value: unknown): value is Contributions {
  if (!value || typeof value !== 'object') return false;
  const { total, weeks } = value as Partial<Contributions>;
  return (
    typeof total === 'number' &&
    Array.isArray(weeks) &&
    weeks.every((week) => typeof week?.start === 'string' && typeof week?.count === 'number')
  );
}
