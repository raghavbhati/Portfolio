import {
  calendarWeeks,
  contributionLevels,
  fromPublicContributions,
  isContributions,
  isPublicContributions,
  toDailyContributions,
} from './githubContributions';

const day = (date: string, count = 0) => ({ date, count });

describe('toDailyContributions', () => {
  test('lists every day of GitHub’s calendar in order and keeps its total', () => {
    expect(
      toDailyContributions({
        totalContributions: 9,
        weeks: [
          {
            contributionDays: [
              { date: '2025-10-12', contributionCount: 2 },
              { date: '2025-10-13', contributionCount: 3 },
            ],
          },
          { contributionDays: [{ date: '2025-10-19', contributionCount: 4 }] },
        ],
      })
    ).toEqual({
      total: 9,
      days: [day('2025-10-12', 2), day('2025-10-13', 3), day('2025-10-19', 4)],
    });
  });

  test('an empty calendar is an empty year', () => {
    expect(toDailyContributions({ totalContributions: 0, weeks: [] })).toEqual({
      total: 0,
      days: [],
    });
  });
});

describe('isContributions', () => {
  test('accepts what the function returns', () => {
    expect(isContributions({ total: 3, days: [day('2025-10-12', 3)] })).toBe(true);
  });

  test.each([
    null,
    'nope',
    { error: 'not-configured' },
    { total: '3', days: [] },
    { total: 3, days: [{ date: '2025-10-12' }] },
    // What the function used to return, which an edge cache may still hold.
    { total: 3, weeks: [{ start: '2025-10-12', count: 3 }] },
  ])('rejects %j', (value) => {
    expect(isContributions(value)).toBe(false);
  });
});

describe('fromPublicContributions', () => {
  test('keeps every day, oldest first, and the given total', () => {
    expect(
      fromPublicContributions({
        total: { lastYear: 12 },
        contributions: [day('2025-11-02', 2), day('2025-11-01', 1)],
      })
    ).toEqual({ total: 12, days: [day('2025-11-01', 1), day('2025-11-02', 2)] });
  });

  test('adds the days up when no total is given', () => {
    expect(
      fromPublicContributions({ contributions: [day('2025-11-03', 4), day('2025-11-04', 1)] }).total
    ).toBe(5);
  });
});

test('isPublicContributions accepts only a list of dated daily counts', () => {
  expect(isPublicContributions({ contributions: [day('2025-11-02')] })).toBe(true);
  expect(isPublicContributions({ contributions: [] })).toBe(true);
  expect(isPublicContributions({ contributions: [{ date: 'yesterday', count: 1 }] })).toBe(false);
  expect(isPublicContributions({ contributions: [{ date: '2025-11-02' }] })).toBe(false);
  expect(isPublicContributions({ error: 'nope' })).toBe(false);
  expect(isPublicContributions(null)).toBe(false);
});

describe('calendarWeeks', () => {
  test('puts each day in its Sunday-to-Saturday week, leaving the slots outside the range empty', () => {
    // Thursday 30 Oct 2025 to Monday 3 Nov 2025.
    const days = ['2025-10-30', '2025-10-31', '2025-11-01', '2025-11-02', '2025-11-03'].map(
      (date) => day(date)
    );
    const weeks = calendarWeeks(days);
    expect(weeks).toHaveLength(2);
    expect(weeks[0].map((slot) => slot?.date ?? null)).toEqual([
      null,
      null,
      null,
      null,
      '2025-10-30',
      '2025-10-31',
      '2025-11-01',
    ]);
    expect(weeks[1].map((slot) => slot?.date ?? null)).toEqual([
      '2025-11-02',
      '2025-11-03',
      null,
      null,
      null,
      null,
      null,
    ]);
  });

  test('no days, no weeks', () => {
    expect(calendarWeeks([])).toEqual([]);
  });
});

describe('contributionLevels', () => {
  test('shades busy days by quartile, with the busiest always darkest', () => {
    const levelOf = contributionLevels(
      [1, 2, 3, 4, 5, 6, 7, 8, 40].map((count, index) => day(`2025-11-0${index + 1}`, count))
    );
    expect([0, 1, 2, 3, 5, 6, 7, 8, 40].map(levelOf)).toEqual([0, 1, 1, 1, 2, 3, 3, 4, 4]);
  });

  test('days that are all equally busy are all fully shaded', () => {
    const levelOf = contributionLevels([day('2025-11-01', 2), day('2025-11-02', 2)]);
    expect(levelOf(2)).toBe(4);
    expect(levelOf(0)).toBe(0);
  });

  test('a year with no contributions shades nothing', () => {
    expect(contributionLevels([day('2025-11-01')])(0)).toBe(0);
  });
});
