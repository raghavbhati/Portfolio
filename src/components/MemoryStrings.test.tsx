import { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import MemoryStrings from './MemoryStrings';
import type { BoardString } from './MemoryStrings';

// A string hanging between (0, 100) and (300, 100); its middle rests at about y = 133.
const string = (twang = 0): BoardString => ({
  key: 'a-b',
  from: { x: 0, y: 100 },
  to: { x: 300, y: 100 },
  opacity: 0.55,
  twang,
});

function Board({ strings }: { strings: BoardString[] }) {
  const surface = useRef<HTMLDivElement>(null);
  return (
    <div ref={surface} data-testid="surface">
      <MemoryStrings strings={strings} surfaceRef={surface} />
      <button type="button">photo</button>
    </div>
  );
}

const path = () => document.querySelector('path')!;
const frames = (ms: number) => vi.advanceTimersByTime(ms);
const sweep = (target: Element) => {
  fireEvent.pointerMove(target, { clientX: 150, clientY: 90 });
  fireEvent.pointerMove(target, { clientX: 150, clientY: 180 });
};

describe('MemoryStrings', () => {
  const matchMedia = window.matchMedia;
  const reduceMotion = (reduce: boolean) => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: reduce }) as typeof window.matchMedia;
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  });

  afterEach(() => {
    vi.useRealTimers();
    window.matchMedia = matchMedia;
  });

  test('the strings sway on their own', () => {
    reduceMotion(false);
    const { getByTestId } = render(<Board strings={[string()]} />);
    frames(100);
    const before = path().getAttribute('d');
    expect(before).toMatch(/^M 0\.0 100\.0 Q /);
    frames(500);
    expect(path().getAttribute('d')).not.toBe(before);
    expect(getByTestId('surface')).toBeInTheDocument();
  });

  test('brushing the cursor across a string sets it rippling, and it settles again', () => {
    reduceMotion(false);
    const { getByTestId } = render(<Board strings={[string()]} />);
    frames(50);
    expect(path().style.strokeOpacity).toBe('');

    sweep(getByTestId('surface'));
    frames(32);
    expect(Number(path().style.strokeOpacity)).toBeGreaterThan(0.55);

    frames(5000);
    expect(path().style.strokeOpacity).toBe('');
  });

  test('moving over a photo on the board leaves the strings underneath alone', () => {
    reduceMotion(false);
    const { getByRole } = render(<Board strings={[string()]} />);
    frames(50);
    sweep(getByRole('button'));
    frames(32);
    expect(path().style.strokeOpacity).toBe('');
  });

  test('a string twangs when a photo lands on one of its pins', () => {
    reduceMotion(false);
    const { rerender } = render(<Board strings={[string(0)]} />);
    frames(50);
    expect(path().style.strokeOpacity).toBe('');
    rerender(<Board strings={[string(1)]} />);
    frames(32);
    expect(Number(path().style.strokeOpacity)).toBeGreaterThan(0.55);
  });

  test('with reduced motion the strings hang still', () => {
    reduceMotion(true);
    const { getByTestId } = render(<Board strings={[string()]} />);
    const resting = path().getAttribute('d');
    expect(resting).toMatch(/^M 0\.0 100\.0 C /);
    sweep(getByTestId('surface'));
    frames(500);
    expect(path().getAttribute('d')).toBe(resting);
    expect(path().style.strokeOpacity).toBe('');
  });
});
