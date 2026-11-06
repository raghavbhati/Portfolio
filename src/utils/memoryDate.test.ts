import { latestMemoryId, memoryTime } from './memoryDate';
import { memories } from '../data/memories';
import { travelMemories } from '../data/travelMemories';

describe('memoryTime', () => {
  test.each([
    ['Oct 2024', Date.UTC(2024, 9, 1)],
    ['1st Jul 2025', Date.UTC(2025, 6, 1)],
    ['22nd Mar 2025', Date.UTC(2025, 2, 22)],
    ['17th Oct 2026', Date.UTC(2026, 9, 17)],
    ['September 2023', Date.UTC(2023, 8, 1)],
  ])('reads %s', (date, time) => expect(memoryTime(date)).toBe(time));

  test.each([
    ['12–16 Oct 2024', Date.UTC(2024, 9, 16)],
    ['28 Sep – 2 Oct 2024', Date.UTC(2024, 9, 2)],
    ['Oct–Nov 2024', Date.UTC(2024, 10, 1)],
    ['Dec 2024 – Jan 2025', Date.UTC(2025, 0, 1)],
  ])('reads the range %s by its last day', (dates, time) => expect(memoryTime(dates)).toBe(time));

  test('sorts anything unreadable first', () => {
    expect(memoryTime('someday')).toBe(-Infinity);
  });
});

describe('latestMemoryId', () => {
  const byDate = (memory: { date: string }) => memory.date;

  test('picks the most recent memory, whatever order they are listed in', () => {
    expect(
      latestMemoryId(
        [
          { id: 'a', date: 'Oct 2024' },
          { id: 'b', date: '3rd Feb 2026' },
          { id: 'c', date: 'Jan 2026' },
        ],
        byDate
      )
    ).toBe('b');
  });

  test('keeps the first one listed on a tie, and has nothing to pick from an empty list', () => {
    expect(
      latestMemoryId(
        [
          { id: 'a', date: 'Oct 2024' },
          { id: 'b', date: 'Oct 2024' },
        ],
        byDate
      )
    ).toBe('a');
    expect(latestMemoryId<{ id: string; date: string }>([], byDate)).toBeNull();
  });

  test('finds the latest event and trip in the real data', () => {
    expect(latestMemoryId(memories, (event) => event.date)).toBe('promptwars');
    expect(latestMemoryId(travelMemories, (trip) => trip.dates)).toBe('travel-yulla-kanda');
  });
});
