import {
  CAPTION,
  CENTRE,
  layoutBoard,
  polaroidHeight,
  reconcileOrder,
  smoothPath,
  stringPath,
  stringPoints,
  swapPlaces,
} from './memoryBoardLayout';
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

  test.each(boards.flatMap(([w, h]) => [2, 3, 6, 9, 10].map((n) => [n, w, h])))(
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

  test.each(boards.flatMap(([w, h]) => [2, 3, 6].map((n) => [n, w, h])))(
    '3:4 portrait ring of %i on %ix%i keeps every polaroid on board and off the card',
    (count, width, height) => {
      const layout = layoutBoard(count, width, height, '3:4');
      expect(layout.mode).toBe('ring');
      const { centre } = layout;
      expect(centre.width / centre.height).toBeCloseTo(0.75, 1);
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
        expect(overlap({ ...b, bottom: b.bottom - CAPTION }, card)).toBe(0);
      });
    }
  );

  test('with a photo either side, the centre gets a near-square space with room for any photo', () => {
    const few = layoutBoard(2, 1000, 600).centre;
    const many = layoutBoard(9, 1000, 600).centre;
    expect(few.width).toBeGreaterThan(many.width * 1.5);
    expect(few.height).toBeGreaterThan(many.height * 1.5);
    expect(few.width / few.height).toBeGreaterThan(0.8);
    expect(few.width / few.height).toBeLessThan(1.25);
  });

  test('phones keep a square space for the centre card', () => {
    const { centre } = layoutBoard(10, 343, 640);
    expect(centre.width).toBe(centre.height);
  });

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

describe('stringPoints', () => {
  const from = { x: 0, y: 100 };
  const to = { x: 300, y: 140 };

  test('at rest it follows the curve stringPath draws', () => {
    const points = stringPoints(from, to);
    expect(points[0]).toEqual(from);
    expect(points[points.length - 1]).toEqual(to);
    // A cubic with both handles a third of the way along, dropped by the sag.
    const sag = Math.min(70, 14 + Math.hypot(300, 40) * 0.1);
    const middle = points[12];
    expect(middle.x).toBeCloseTo(150);
    expect(middle.y).toBeCloseTo(120 + 0.75 * sag);
  });

  test('swaying and rippling move the string but never its pins', () => {
    const rest = stringPoints(from, to);
    const moving = stringPoints(from, to, { sag: 1.1, sway: 4, wave: 12, wavePhase: 2.3 });
    expect(moving[0]).toEqual(from);
    expect(moving[moving.length - 1]).toEqual(to);
    const moved = moving.map((p, i) => Math.hypot(p.x - rest[i].x, p.y - rest[i].y));
    expect(Math.max(...moved)).toBeGreaterThan(5);
    expect(Math.max(...moved)).toBeLessThan(30);
  });

  test('the ripple travels along the string as its phase grows', () => {
    const at = (wavePhase: number, direction: 1 | -1 = 1) =>
      stringPoints(from, to, { wave: 10, wavePhase, direction }).map((p) => p.y);
    expect(at(1)).not.toEqual(at(0));
    expect(at(1, -1)).not.toEqual(at(1, 1));
  });
});

test('smoothPath curves through every point and ends on the last one', () => {
  const d = smoothPath([
    { x: 0, y: 0 },
    { x: 10, y: 5 },
    { x: 20, y: 0 },
  ]);
  expect(d).toBe('M 0.0 0.0 Q 10.0 5.0 15.0 2.5 L 20.0 0.0');
  expect(smoothPath([])).toBe('');
});

describe('board order', () => {
  test('swapping puts the memory coming down in the place of the one going up', () => {
    expect(swapPlaces(['a', 'b', 'c', 'd'], 'c', 'a')).toEqual(['c', 'b', 'a', 'd']);
  });

  test('keeps the order it has, dropping ids that are gone and adding new ones at the end', () => {
    expect(reconcileOrder(['c', 'b', 'a'], ['a', 'b', 'd'])).toEqual(['b', 'a', 'd']);
  });
});
