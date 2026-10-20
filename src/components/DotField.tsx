import { useEffect, useRef } from 'react';

// Same grid as the `dot-grid` utility in index.css: a dot every 24px, centred in its tile.
const SPACING = 24;
const OFFSET = SPACING / 2;
/** How far from the cursor dots light up. */
const REACH = 110;
/** Brightness kept per frame, so a lit dot fades out over about 0.7s. */
const FADE = 0.93;
/** Fast moves are filled in every few pixels so the trail has no gaps. */
const TRAIL_STEP = 12;

/**
 * Pinboard dots behind the page. With a mouse, the dots near the cursor light up and
 * swell, then settle back, leaving a short trail. Only the side margins show it; the
 * page column covers the rest.
 */
export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Touch screens have no cursor to follow, and reduced motion means a still page.
    if (
      !canvas ||
      !window.matchMedia?.('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let glow = new Float32Array(0);
    const lit = new Set<number>();
    let pointer: { x: number; y: number } | null = null;
    let last: { x: number; y: number } | null = null;
    let frame = 0;
    let colour = '';

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * ratio;
      canvas!.height = window.innerHeight * ratio;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      cols = Math.ceil(window.innerWidth / SPACING);
      rows = Math.ceil(window.innerHeight / SPACING);
      glow = new Float32Array(cols * rows);
      lit.clear();
    }

    function light(x: number, y: number) {
      const firstCol = Math.max(0, Math.floor((x - REACH) / SPACING));
      const lastCol = Math.min(cols - 1, Math.floor((x + REACH) / SPACING));
      const firstRow = Math.max(0, Math.floor((y - REACH) / SPACING));
      const lastRow = Math.min(rows - 1, Math.floor((y + REACH) / SPACING));
      for (let row = firstRow; row <= lastRow; row++) {
        for (let col = firstCol; col <= lastCol; col++) {
          const distance = Math.hypot(OFFSET + col * SPACING - x, OFFSET + row * SPACING - y);
          if (distance >= REACH) continue;
          const strength = (1 - distance / REACH) ** 2;
          const index = row * cols + col;
          if (strength > glow[index]) {
            glow[index] = strength;
            lit.add(index);
          }
        }
      }
    }

    function draw() {
      frame = 0;
      if (pointer) {
        const from = last ?? pointer;
        const steps = Math.max(
          1,
          Math.ceil(Math.hypot(pointer.x - from.x, pointer.y - from.y) / TRAIL_STEP)
        );
        for (let step = 1; step <= steps; step++) {
          const t = step / steps;
          light(from.x + (pointer.x - from.x) * t, from.y + (pointer.y - from.y) * t);
        }
        last = pointer;
        pointer = null;
      }

      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx!.fillStyle = colour;
      lit.forEach((index) => {
        const strength = glow[index];
        if (strength < 0.02) {
          glow[index] = 0;
          lit.delete(index);
          return;
        }
        ctx!.globalAlpha = Math.min(1, strength * 1.2);
        ctx!.beginPath();
        ctx!.arc(
          OFFSET + (index % cols) * SPACING,
          OFFSET + Math.floor(index / cols) * SPACING,
          1 + 1.8 * strength,
          0,
          Math.PI * 2
        );
        ctx!.fill();
        glow[index] = strength * FADE;
      });

      if (lit.size > 0) frame = requestAnimationFrame(draw);
      // Once everything has settled, the next move starts a fresh trail.
      else last = null;
    }

    function onPointerMove(event: PointerEvent) {
      // The memory boards cover the page while open; nothing here is visible then.
      if (event.pointerType !== 'mouse' || (event.target as Element | null)?.closest?.('dialog'))
        return;
      pointer = { x: event.clientX, y: event.clientY };
      if (frame) return;
      // Read per burst so the colour follows the theme.
      colour = getComputedStyle(document.body).getPropertyValue('--bright').trim() || '#ededed';
      frame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <div aria-hidden="true" className="dot-grid pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
