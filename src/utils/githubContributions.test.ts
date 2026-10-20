import { isContributions, toWeeklyContributions } from './githubContributions';

describe('toWeeklyContributions', () => {
  test('sums each week and keeps GitHub’s total', () => {
    expect(
      toWeeklyContributions({
        totalContributions: 9,
        weeks: [
          {
            firstDay: '2025-10-12',
            contributionDays: [
              { contributionCount: 2 },
              { contributionCount: 0 },
              { contributionCount: 3 },
            ],
          },
          { firstDay: '2025-10-19', contributionDays: [{ contributionCount: 4 }] },
        ],
      })
    ).toEqual({
      total: 9,
      weeks: [
        { start: '2025-10-12', count: 5 },
        { start: '2025-10-19', count: 4 },
      ],
    });
  });

  test('an empty calendar is an empty year', () => {
    expect(toWeeklyContributions({ totalContributions: 0, weeks: [] })).toEqual({
      total: 0,
      weeks: [],
    });
  });
});

describe('isContributions', () => {
  test('accepts what the function returns', () => {
    expect(isContributions({ total: 3, weeks: [{ start: '2025-10-12', count: 3 }] })).toBe(true);
  });

  test.each([
    null,
    'nope',
    { error: 'not-configured' },
    { total: '3', weeks: [] },
    { total: 3, weeks: [{ start: '2025-10-12' }] },
  ])('rejects %j', (value) => {
    expect(isContributions(value)).toBe(false);
  });
});
