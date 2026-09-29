// Illustrative data only. Replace this export with verified contribution data.
const start = new Date('2026-01-01T12:00:00Z');
export const leadingDays = start.getUTCDay();
export const contributions = Array.from({ length: 272 }, (_, index) => {
  const date = new Date(start.getTime() + index * 86400000);
  const seed = (index * 37 + index * index * 11) % 101;
  const count = seed < 18 ? 0 : seed < 55 ? 1 : seed < 78 ? 3 : seed < 93 ? 6 : 10;
  return {
    date: date.toISOString().slice(0, 10),
    count,
    level: count === 0 ? 0 : count === 1 ? 1 : count === 3 ? 2 : count === 6 ? 3 : 4,
    label: `${count} sample contribution${count === 1 ? '' : 's'} on ${date.toLocaleDateString(
      'en-US',
      { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }
    )}`,
  };
});
export const months = contributions.flatMap((day, index) =>
  day.date.endsWith('-01')
    ? [
        {
          label: new Date(day.date + 'T12:00:00Z').toLocaleDateString('en-US', {
            month: 'short',
            timeZone: 'UTC',
          }),
          column: Math.floor((index + leadingDays) / 7) + 1,
        },
      ]
    : []
);
