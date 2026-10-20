import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import DotField from './DotField';

function setup({ finePointer = true, reducedMotion = false } = {}) {
  window.matchMedia = vi.fn((query: string) => ({
    matches: query === '(pointer: fine)' ? finePointer : reducedMotion,
  })) as unknown as typeof window.matchMedia;
  const ctx = {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D
  );
  const frames: FrameRequestCallback[] = [];
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  const runFrame = () => frames.shift()?.(0);
  return { ctx, frames, runFrame };
}

const move = (target: Window | Element, pointerType = 'mouse') =>
  fireEvent.pointerMove(target, { pointerType, clientX: 60, clientY: 60 });

describe('DotField', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('is a decorative layer behind the page', () => {
    setup();
    const { container } = render(<DotField />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstChild).toHaveClass('dot-grid', 'fixed', '-z-10', 'pointer-events-none');
  });

  test('lights the dots near the mouse, then lets them fade and stops animating', () => {
    const { ctx, frames, runFrame } = setup();
    render(<DotField />);

    move(window);
    expect(frames).toHaveLength(1);
    runFrame();
    expect(ctx.arc).toHaveBeenCalled();
    // The closest dot, at (60, 60), swells the most.
    const radii = ctx.arc.mock.calls.map(([, , radius]) => radius as number);
    expect(Math.max(...radii)).toBeGreaterThan(2.5);

    for (let i = 0; i < 200 && frames.length > 0; i++) runFrame();
    expect(frames).toHaveLength(0);
  });

  test('ignores touch, and the page behind an open memory board', () => {
    const { frames } = setup();
    render(<DotField />);
    move(window, 'touch');
    expect(frames).toHaveLength(0);

    const dialog = document.body.appendChild(document.createElement('dialog'));
    move(dialog);
    expect(frames).toHaveLength(0);
    dialog.remove();
  });

  test('stays still for reduced motion and on touch-only screens', () => {
    for (const options of [{ reducedMotion: true }, { finePointer: false }]) {
      const { frames } = setup(options);
      const { unmount } = render(<DotField />);
      move(window);
      expect(frames).toHaveLength(0);
      unmount();
      vi.restoreAllMocks();
    }
  });
});
