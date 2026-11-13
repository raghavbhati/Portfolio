// Pure geometry for the memory boards: where each polaroid sits, where the
// centre card goes, and how the strings between them hang.

export interface Point {
  x: number;
  y: number;
}

export interface Slot extends Point {
  width: number;
  /** Photo height divided by photo width. */
  ratio: number;
  rotate: number;
}

export type CenterRatio = '3:4' | 'landscape';

export interface BoardLayout {
  /** `ring` circles the centre card (desktop); `stack` flows below it (phones). */
  mode: 'ring' | 'stack';
  width: number;
  height: number;
  /** The centre card, a landscape viewer for the memory that's brought up. */
  centre: Point & { width: number; height: number };
  slots: Slot[];
  /** Pairs of slot indexes joined by a string; CENTRE is the centre card. */
  links: Array<[number, number]>;
}

export const CENTRE = -1;
/** White polaroid border, both sides combined. */
export const FRAME = 10;
/** Caption line under each polaroid, including its top margin. */
export const CAPTION = 26;

const STACK_MAX_WIDTH = 640;
const STACK_MAX_HEIGHT = 440;

// Shapes, tilts and nudges cycle so the board reads as hand-pinned, not gridded.
const RATIOS = [1.28, 0.74, 1, 1.32, 0.76, 1.24, 0.8, 1, 1.3, 0.72];
const TILTS = [-2.5, 1.5, -1, 2, -2, 1, -1.5, 2.5, -0.5, 1.5];
const WIDTHS = [1, 1.12, 0.94, 1.02, 1.14, 0.96, 1.08, 0.92, 1, 1.1];
const NUDGES: Array<[number, number]> = [
  [-8, 12],
  [6, -10],
  [12, 6],
  [-10, -6],
  [8, 10],
  [-6, -8],
  [10, -6],
  [-12, 8],
  [6, 6],
  [-8, -10],
];

const pick = <T>(list: T[], index: number) => list[index % list.length];
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function polaroidHeight(slot: Pick<Slot, 'width' | 'ratio'>) {
  return slot.width * slot.ratio + FRAME + CAPTION;
}

function shape(index: number, base: number) {
  return {
    width: base * pick(WIDTHS, index),
    ratio: pick(RATIOS, index),
    rotate: pick(TILTS, index),
  };
}

/**
 * Angles that space `count` points evenly by distance along an ellipse. Even angles
 * would bunch photos up at the narrow ends of a wide board.
 */
function evenAngles(count: number, rx: number, ry: number, start: number) {
  const steps = 720;
  const lengths = [0];
  for (let step = 1; step <= steps; step++) {
    const a = start + ((step - 1) / steps) * 2 * Math.PI;
    const b = start + (step / steps) * 2 * Math.PI;
    const length = Math.hypot(rx * (Math.cos(b) - Math.cos(a)), ry * (Math.sin(b) - Math.sin(a)));
    lengths.push(lengths[step - 1] + length);
  }
  const total = lengths[steps];
  let step = 0;
  return Array.from({ length: count }, (_, index) => {
    const target = (index / count) * total;
    while (lengths[step] < target) step++;
    return start + (step / steps) * 2 * Math.PI;
  });
}

/**
 * Nudges polaroids apart until none covers another or the centre card, keeping all of
 * them on the board. Moves each overlap out along its shallower side.
 */
function spread(slots: Slot[], centre: BoardLayout['centre'], width: number, height: number) {
  const gap = 10;
  const push = (overlapX: number, overlapY: number, dx: number, dy: number) =>
    overlapX < overlapY
      ? { x: (dx < 0 ? -1 : 1) * overlapX, y: 0 }
      : { x: 0, y: (dy < 0 ? -1 : 1) * overlapY };

  for (let round = 0; round < 120; round++) {
    let moved = false;
    slots.forEach((a, i) => {
      slots.slice(i + 1).forEach((b) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const overlapX = (a.width + b.width) / 2 + gap - Math.abs(dx);
        const overlapY = (polaroidHeight(a) + polaroidHeight(b)) / 2 + gap - Math.abs(dy);
        if (overlapX <= 0 || overlapY <= 0) return;
        const step = push(overlapX, overlapY, dx, dy);
        a.x += step.x / 2;
        a.y += step.y / 2;
        b.x -= step.x / 2;
        b.y -= step.y / 2;
        moved = true;
      });
    });
    slots.forEach((slot) => {
      const h = polaroidHeight(slot);
      const dx = slot.x - centre.x;
      const dy = slot.y - centre.y;
      const overlapX = (slot.width + centre.width) / 2 + gap - Math.abs(dx);
      const overlapY = (h + centre.height) / 2 + gap - Math.abs(dy);
      if (overlapX > 0 && overlapY > 0) {
        const step = push(overlapX, overlapY, dx, dy);
        slot.x += step.x;
        slot.y += step.y;
        moved = true;
      }
      slot.x = clamp(slot.x, slot.width / 2 + 8, width - slot.width / 2 - 8);
      slot.y = clamp(slot.y, h / 2 + 8, height - h / 2 - 8);
    });
    if (!moved) return;
  }
}

function ringLayout(
  count: number,
  width: number,
  height: number,
  centerRatio: CenterRatio = 'landscape'
): BoardLayout {
  const scale = clamp(Math.min(width / 1100, height / 620), 0.55, 1);
  // Keep polaroids balanced so the centre showcase card remains the dominant hero.
  const base = 140 * scale * (count <= 3 ? 1.15 : count <= 6 ? 1.25 : 1);
  const cx = width / 2;
  const cy = height / 2;
  // Small boards start on the left so their few photos spread across the wide axis.
  const start = count <= 6 ? -Math.PI : -Math.PI * 0.8;
  const angles = evenAngles(count, cx - base / 2, cy - base / 2, start);
  const slots = Array.from({ length: count }, (_, index) => {
    const slot = shape(index, base);
    const h = polaroidHeight(slot);
    // Each polaroid gets its own radius so short ones can sit further out.
    const rx = cx - slot.width / 2 - 24 * scale;
    const ry = cy - h / 2 - 12 * scale;
    const angle = angles[index];
    const [nx, ny] = pick(NUDGES, index);
    return {
      ...slot,
      x: cx + rx * Math.cos(angle) + nx * scale,
      y: cy + ry * Math.sin(angle) + ny * scale,
    };
  });
  let centreWidth: number;
  let centreHeight: number;

  if (centerRatio === '3:4') {
    centreHeight = clamp(
      Math.min(width * (count <= 3 ? 0.36 : 0.24), height * (count <= 3 ? 0.62 : 0.35)),
      150,
      count <= 3 ? 410 : 230
    );
    centreWidth = Math.round(centreHeight * 0.75);
  } else {
    if (count <= 2) {
      // With just a photo either side, a near-square space in the middle of the board: the
      // card takes the shape of the photo on show inside it, so wide and tall photos both
      // show large.
      centreWidth = Math.round(clamp(width * 0.46, 200, 600));
      centreHeight = Math.round(clamp(height * 0.78, 180, 520));
    } else {
      // A 1.3:1 landscape card.
      centreHeight = clamp(
        Math.min(width * 0.18, height * (count <= 3 ? 0.4 : 0.36)),
        140,
        count <= 3 ? 250 : 230
      );
      centreWidth = Math.round(centreHeight * 1.3);
    }
  }

  const centre = { x: cx, y: cy, width: centreWidth, height: centreHeight };
  spread(slots, centre, width, height);
  const links: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    if (i < count - 1) links.push([i, i + 1]);
    if (i % 2 === 0) links.push([i, CENTRE]);
  }
  return { mode: 'ring', width, height, centre, slots, links };
}

function stackLayout(
  count: number,
  width: number,
  centerRatio: CenterRatio = 'landscape'
): BoardLayout {
  const pad = 16;
  let centreWidth: number;
  let centreHeight: number;

  if (centerRatio === '3:4') {
    centreWidth = Math.min(width - pad * 2, 300);
    centreHeight = Math.round(centreWidth * (4 / 3));
  } else {
    // Square, so the card can take the shape of a wide or a tall photo inside it.
    centreWidth = Math.min(width - pad * 2, 360);
    centreHeight = centreWidth;
  }
  const cols = width >= 460 ? 3 : 2;
  const cell = (width - pad * 2) / cols;
  const shapes = Array.from({ length: count }, (_, index) => shape(index, cell * 0.72));
  const rowHeight = Math.max(0, ...shapes.map(polaroidHeight)) + 20;
  const top = pad + centreHeight + 36;
  const slots = shapes.map((slot, index) => {
    const [nx, ny] = pick(NUDGES, index);
    return {
      ...slot,
      x: pad + cell * ((index % cols) + 0.5) + nx * 0.6,
      y: top + rowHeight * (Math.floor(index / cols) + 0.5) + ny * 0.6,
    };
  });
  const links: Array<[number, number]> = count > 0 ? [[CENTRE, 0]] : [];
  for (let i = 0; i < count - 1; i++) links.push([i, i + 1]);
  return {
    mode: 'stack',
    width,
    height: top + rowHeight * Math.ceil(count / cols) + pad,
    centre: { x: width / 2, y: pad + centreHeight / 2, width: centreWidth, height: centreHeight },
    slots,
    links,
  };
}

export function layoutBoard(
  count: number,
  width: number,
  height: number,
  centerRatio: CenterRatio = 'landscape'
): BoardLayout {
  return width < STACK_MAX_WIDTH || height < STACK_MAX_HEIGHT
    ? stackLayout(count, width, centerRatio)
    : ringLayout(count, width, height, centerRatio);
}

/**
 * The board's ids in place order, brought up to date with `ids`: ids no longer there are
 * dropped and new ones join at the end.
 */
export function reconcileOrder(order: readonly string[], ids: readonly string[]): string[] {
  const kept = order.filter((id) => ids.includes(id));
  return [...kept, ...ids.filter((id) => !kept.includes(id))];
}

/**
 * Swaps two ids, so the memory going up onto the centre card leaves its place on the board
 * to the one coming down from it.
 */
export function swapPlaces(order: readonly string[], a: string, b: string): string[] {
  return order.map((id) => (id === a ? b : id === b ? a : id));
}

const restingSag = (dx: number, dy: number) => Math.min(70, 14 + Math.hypot(dx, dy) * 0.1);
const fixed = (n: number) => n.toFixed(1);

/** A string pinned at both ends, sagging under its own weight. */
export function stringPath(from: Point, to: Point): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const sag = restingSag(dx, dy);
  const f = fixed;
  return `M ${f(from.x)} ${f(from.y)} C ${f(from.x + dx / 3)} ${f(from.y + dy / 3 + sag)} ${f(
    from.x + (2 * dx) / 3
  )} ${f(from.y + (2 * dy) / 3 + sag)} ${f(to.x)} ${f(to.y)}`;
}

export interface StringMotion {
  /** Scales the resting sag; 1 hangs exactly like `stringPath`. */
  sag?: number;
  /** How far the middle of the string sways sideways, in px. */
  sway?: number;
  /** Height of the ripple running along the string, in px. */
  wave?: number;
  /** Where the ripple is in its cycle, in radians. Grow it over time to move the ripple. */
  wavePhase?: number;
  /** 1 runs the ripple from `from` towards `to`; -1 the other way. */
  direction?: 1 | -1;
}

/**
 * Points along a string from `from` to `to` (the curve `stringPath` draws), moved sideways
 * by `motion`. Both ends stay pinned however it moves.
 */
export function stringPoints(
  from: Point,
  to: Point,
  { sag = 1, sway = 0, wave = 0, wavePhase = 0, direction = 1 }: StringMotion = {},
  segments = 24
): Point[] {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const drop = restingSag(dx, dy) * sag;
  // Sideways is across the line between the pins.
  const nx = -dy / length;
  const ny = dx / length;
  return Array.from({ length: segments + 1 }, (_, i) => {
    if (i === segments) return { x: to.x, y: to.y };
    const s = i / segments;
    const pinned = Math.sin(Math.PI * s);
    const side = pinned * (sway + wave * Math.sin(3 * Math.PI * s - direction * wavePhase));
    return {
      x: from.x + dx * s + nx * side,
      y: from.y + dy * s + 3 * s * (1 - s) * drop + ny * side,
    };
  });
}

/** A smooth path through `points`, curving through the midpoints between them. */
export function smoothPath(points: readonly Point[]): string {
  if (points.length === 0) return '';
  const f = fixed;
  let d = `M ${f(points[0].x)} ${f(points[0].y)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const next = points[i + 1];
    d += ` Q ${f(p.x)} ${f(p.y)} ${f((p.x + next.x) / 2)} ${f((p.y + next.y) / 2)}`;
  }
  const last = points[points.length - 1];
  return points.length > 1 ? `${d} L ${f(last.x)} ${f(last.y)}` : d;
}
