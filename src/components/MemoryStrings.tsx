import { useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { smoothPath, stringPath, stringPoints } from '../utils/memoryBoardLayout';
import type { Point } from '../utils/memoryBoardLayout';

export interface BoardString {
  key: string;
  from: Point;
  to: Point;
  /** Stroke opacity while the string is still. */
  opacity: number;
  /** Raise it to give the string a twang, e.g. when a photo lands on one of its pins. */
  twang?: number;
}

interface Motion {
  /** Offsets this string's idle sway so the strings don't move in step. */
  phase: number;
  /** Height of the ripple running along it, in px; dies down on its own. */
  wave: number;
  wavePhase: number;
  direction: 1 | -1;
  twang: number;
  /** Where it was last drawn, to tell when the cursor crosses it. */
  points: Point[];
}

/** How close the cursor has to pass to set a string rippling, in px. */
const REACH = 14;
/** Seconds for a ripple to die down to about a third. */
const SETTLE = 0.9;
/** How fast the ripple runs along the string, in radians a second. */
const RIPPLE_SPEED = 9;
const TWANG = 9;

const canAnimate = () =>
  typeof window !== 'undefined' &&
  typeof window.requestAnimationFrame === 'function' &&
  typeof window.matchMedia === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function distanceToSegment(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq
    ? Math.min(1, Math.max(0, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq))
    : 0;
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/**
 * The strings between the polaroids. They sway a little on their own, and ripple when the
 * cursor brushes across them on `surface` (the bare board, not the photos on it).
 */
export default function MemoryStrings({
  strings,
  surfaceRef,
}: {
  strings: BoardString[];
  surfaceRef: RefObject<HTMLElement>;
}) {
  const paths = useRef(new Map<string, SVGPathElement>());
  const motions = useRef(new Map<string, Motion>());
  const latest = useRef(strings);
  latest.current = strings;
  const paint = useRef<((now: number) => void) | null>(null);

  // React draws each string at rest whenever its pins move; put the motion straight back
  // before the browser paints, so it never flickers.
  useLayoutEffect(() => {
    paint.current?.(performance.now());
  });

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface || !canAnimate()) return;

    const motionOf = (string: BoardString) => {
      let motion = motions.current.get(string.key);
      if (!motion) {
        motion = {
          phase: Math.random() * Math.PI * 2,
          wave: 0,
          wavePhase: 0,
          direction: 1,
          twang: string.twang ?? 0,
          points: [],
        };
        motions.current.set(string.key, motion);
      }
      return motion;
    };

    paint.current = (now) => {
      const t = now / 1000;
      for (const string of latest.current) {
        const path = paths.current.get(string.key);
        if (!path) continue;
        const motion = motionOf(string);
        motion.points = stringPoints(string.from, string.to, {
          sag: 1 + 0.07 * Math.sin(0.8 * t + motion.phase),
          sway: 2.5 * Math.sin(1.1 * t + motion.phase * 1.7),
          wave: motion.wave,
          wavePhase: motion.wavePhase,
          direction: motion.direction,
        });
        path.setAttribute('d', smoothPath(motion.points));
        path.style.strokeOpacity =
          motion.wave > 0.3 ? String(Math.min(1, string.opacity + motion.wave * 0.03)) : '';
      }
    };

    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      const live = new Set<string>();
      for (const string of latest.current) {
        live.add(string.key);
        const motion = motionOf(string);
        const twang = string.twang ?? 0;
        if (twang > motion.twang) motion.wave = Math.max(motion.wave, TWANG);
        motion.twang = twang;
        motion.wave = motion.wave < 0.05 ? 0 : motion.wave * Math.exp(-dt / SETTLE);
        motion.wavePhase += RIPPLE_SPEED * dt;
      }
      motions.current.forEach((_, key) => {
        if (!live.has(key)) motions.current.delete(key);
      });
      paint.current?.(now);
      frame = requestAnimationFrame(tick);
    });

    let previous: (Point & { time: number }) | null = null;
    const onMove = (event: PointerEvent) => {
      const rect = surface.getBoundingClientRect();
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const from = previous;
      previous = { ...point, time: event.timeStamp };
      // Over a photo or the centre card the strings are underneath; leave them be.
      if (!from || event.target !== surface) return;

      const seconds = Math.max(1, event.timeStamp - from.time) / 1000;
      const speed = Math.hypot(point.x - from.x, point.y - from.y) / seconds;
      // Check along the whole stretch since the last move, so a quick flick can't skip a string.
      const steps = Math.min(
        24,
        Math.max(1, Math.ceil(Math.hypot(point.x - from.x, point.y - from.y) / 6))
      );
      for (const string of latest.current) {
        const motion = motions.current.get(string.key);
        if (!motion || motion.points.length < 2) continue;
        let nearest = Infinity;
        let at = 0;
        for (let step = 1; step <= steps; step++) {
          const p = {
            x: from.x + ((point.x - from.x) * step) / steps,
            y: from.y + ((point.y - from.y) * step) / steps,
          };
          for (let i = 0; i < motion.points.length - 1; i++) {
            const distance = distanceToSegment(p, motion.points[i], motion.points[i + 1]);
            if (distance < nearest) {
              nearest = distance;
              at = i / (motion.points.length - 1);
            }
          }
        }
        if (nearest > REACH) continue;
        const length = Math.hypot(string.to.x - string.from.x, string.to.y - string.from.y);
        const strength = Math.min(3 + speed * 0.01, 16, Math.max(3, length * 0.08));
        motion.wave = Math.max(motion.wave, strength);
        // The ripple runs away from where it was touched.
        motion.direction = at < 0.5 ? 1 : -1;
      }
    };
    const onLeave = () => {
      previous = null;
    };

    surface.addEventListener('pointermove', onMove);
    surface.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      paint.current = null;
      surface.removeEventListener('pointermove', onMove);
      surface.removeEventListener('pointerleave', onLeave);
    };
  }, [surfaceRef]);

  return (
    <svg
      className="memory-strings pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      {strings.map((string) => (
        <path
          key={string.key}
          ref={(path) => {
            if (path) paths.current.set(string.key, path);
            else paths.current.delete(string.key);
          }}
          d={stringPath(string.from, string.to)}
          className="fill-none stroke-string"
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeOpacity={string.opacity}
        />
      ))}
    </svg>
  );
}
