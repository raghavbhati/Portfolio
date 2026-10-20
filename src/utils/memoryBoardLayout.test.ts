import { CAPTION, CENTRE, layoutBoard, polaroidHeight, stringPath } from './memoryBoardLayout';
import type { Slot } from './memoryBoardLayout';

const box = (slot: Slot) => {
  const h = polaroidHeight(slot);
  return {
    left: slot.x - slot.width / 2,
    right: slot.x + slot.width / 2,
    top: slot.y - h / 2,
    bottom: slot.y + h / 2,
  };
};
const overlap = (a: ReturnType<typeof box>, b: ReturnType<typeof box>) =>
  Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
  Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

describe('layoutBoard', () => {
  const boards = [
    [1180, 660],
    [1000, 600],
    [900, 560],
    [720, 480],
  ];

  test.each(boards.flatMap(([w, h]) => [3, 6, 10].map((n) => [n, w, h])))(
    'ring of %i on %ix%i keeps every polaroid on the board and off the centre card',
    (count, width, height) => {
      const layout = layoutBoard(count, width, height);
      expect(layout.mode).toBe('ring');
      expect(layout.slots).toHaveLength(count);

      const { centre } = layout;
      const card = {
        left: centre.x - centre.width / 2,
        right: centre.x + centre.width / 2,
        top: centre.y - centre.height / 2,
        bottom: centre.y + centre.height / 2,
      };
      layout.slots.forEach((slot) => {
        const b = box(slot);
        expect(b.left).toBeGreaterThanOrEqual(0);
        expect(b.top).toBeGreaterThanOrEqual(0);
        expect(b.right).toBeLessThanOrEqual(width);
        expect(b.bottom).toBeLessThanOrEqual(height);
        // Captions may brush the card; photos must not.
        expect(overlap({ ...b, bottom: b.bottom - CAPTION }, card)).toBe(0);
      });

      // Neighbours may overlap a little, like pinned photos do, but never pile up
      // or hide each other's captions.
      layout.slots.forEach((a, i) =>
        layout.slots.forEach((b, j) => {
          if (i === j) return;
          const smaller = Math.min(a.width * a.ratio * a.width, b.width * b.ratio * b.width);
          expect(overlap(box(a), box(b))).toBeLessThan(smaller * 0.15);
          const caption = { ...box(a), top: box(a).bottom - CAPTION };
          expect(overlap(caption, { ...box(b), bottom: box(b).bottom - CAPTION })).toBe(0);
        })
      );
    }
  );

  test('strings run along the ring and every other polaroid ties into the centre', () => {
    const { links } = layoutBoard(10, 1180, 660);
    expect(links.filter(([, to]) => to !== CENTRE)).toHaveLength(9);
    expect(links.filter(([, to]) => to === CENTRE)).toHaveLength(5);
  });

  test('phones stack polaroids under the centre card and grow the board to fit', () => {
    const layout = layoutBoard(10, 343, 640);
    expect(layout.mode).toBe('stack');
    expect(layout.height).toBeGreaterThan(640);
    const cardBottom = layout.centre.y + layout.centre.height / 2;
    layout.slots.forEach((slot) => {
      const b = box(slot);
      expect(b.top).toBeGreaterThan(cardBottom);
      expect(b.left).toBeGreaterThanOrEqual(0);
      expect(b.right).toBeLessThanOrEqual(343);
      expect(b.bottom).toBeLessThanOrEqual(layout.height);
    });
    expect(layout.links[0]).toEqual([CENTRE, 0]);
  });

  test('short landscape screens fall back to the stack', () => {
    expect(layoutBoard(10, 900, 400).mode).toBe('stack');
  });
});

test('stringPath sags below the straight line between its pins', () => {
  const d = stringPath({ x: 0, y: 100 }, { x: 300, y: 100 });
  expect(d).toMatch(/^M 0\.0 100\.0 C /);
  const [, c1y] = d.split(' C ')[1].split(' ').map(Number);
  expect(c1y).toBeGreaterThan(100);
});
