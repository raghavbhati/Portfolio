import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import TravelMemory from './TravelMemory';
import { travelMemories } from '../data/travelMemories';
import type { TravelMemory as TravelMemoryItem } from '../data/travelMemories';
import { travelAudio } from '../utils/travelAudio';

const openBoard = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Open travel memories' }));
const polaroid = (label: string) =>
  screen.getByRole('button', { name: new RegExp(`^${label},`, 'i') });
const footer = () => screen.getByRole('dialog').querySelector('footer')!;

describe('TravelMemory', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  test('shows a folder in the bottom-left corner with a count, and keeps the board closed', () => {
    const { container } = render(<TravelMemory />);
    expect(container.querySelector('#travel-memory')).toHaveClass('fixed', 'left-6', 'bottom-6');
    expect(screen.getByRole('button', { name: 'Open travel memories' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByText('10 places')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('opens the board with every memory pinned around an empty centre card', () => {
    render(<TravelMemory />);
    openBoard();

    const dialog = screen.getByRole('dialog', { name: 'Travel Memory' });
    expect(within(dialog).getByText('memories, on a string')).toBeInTheDocument();
    expect(within(dialog).getByText('drop a memory here')).toBeInTheDocument();
    travelMemories.forEach((memory) =>
      expect(polaroid(memory.label)).toHaveAttribute('aria-pressed', 'false')
    );
  });

  test('ties the polaroids together with sagging strings', () => {
    render(<TravelMemory defaultOpen />);
    const strings = screen.getByRole('dialog').querySelectorAll('svg path');
    // 9 links around the ring, plus every other polaroid tied into the centre.
    expect(strings).toHaveLength(14);
    strings.forEach((path) => expect(path.getAttribute('d')).toMatch(/^M [\d.-]+ [\d.-]+ C /));
  });

  test('clicking a polaroid puts it on the centre card, tells its story, and plays its sound', () => {
    const play = vi.spyOn(travelAudio, 'play');
    render(<TravelMemory defaultOpen />);

    fireEvent.click(polaroid('sunsets'));

    expect(polaroid('sunsets')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Put sunsets back' })).toBeInTheDocument();
    expect(within(footer()).getByText('Violet Dusk Horizon')).toBeInTheDocument();
    expect(within(footer()).getByText(/Sunset Point, Kasauli Hills/)).toBeInTheDocument();
    expect(play).toHaveBeenLastCalledWith('wind');
    expect(screen.queryByText('drop a memory here')).not.toBeInTheDocument();
  });

  test('a new memory replaces the one on the centre card', () => {
    const play = vi.spyOn(travelAudio, 'play');
    render(<TravelMemory defaultOpen />);

    fireEvent.click(polaroid('sunsets'));
    fireEvent.click(polaroid('UNO'));

    expect(polaroid('sunsets')).toHaveAttribute('aria-pressed', 'false');
    expect(polaroid('UNO')).toHaveAttribute('aria-pressed', 'true');
    expect(within(footer()).getByText('UNO Under the Stars')).toBeInTheDocument();
    expect(play).toHaveBeenLastCalledWith('campfire');
  });

  test('putting a memory back empties the centre card and stops the sound', () => {
    const stop = vi.spyOn(travelAudio, 'stop');
    render(<TravelMemory defaultOpen />);

    fireEvent.click(polaroid('mountains'));
    stop.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'Put mountains back' }));

    expect(stop).toHaveBeenCalled();
    expect(screen.getByText('drop a memory here')).toBeInTheDocument();
    expect(polaroid('mountains')).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking the memory that is already up puts it back', () => {
    render(<TravelMemory defaultOpen />);
    fireEvent.click(polaroid('mountains'));
    fireEvent.click(polaroid('mountains'));
    expect(screen.getByText('drop a memory here')).toBeInTheDocument();
  });

  test('dragging a polaroid onto the centre card brings it up; dropping it elsewhere does not', () => {
    render(<TravelMemory defaultOpen />);
    const card = screen.getByText('drop a memory here').closest('div.absolute')!;
    vi.spyOn(card, 'getBoundingClientRect').mockReturnValue({
      left: 400,
      right: 600,
      top: 200,
      bottom: 400,
      width: 200,
      height: 200,
      x: 400,
      y: 200,
      toJSON: () => ({}),
    });

    const chai = polaroid('cutting chai');
    fireEvent.pointerDown(chai, { button: 0, pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(chai, { pointerId: 1, clientX: 300, clientY: 150 });
    fireEvent.pointerUp(chai, { pointerId: 1, clientX: 300, clientY: 150 });
    fireEvent.click(chai);
    expect(chai).toHaveAttribute('aria-pressed', 'false');

    fireEvent.pointerDown(chai, { button: 0, pointerId: 2, clientX: 300, clientY: 150 });
    fireEvent.pointerMove(chai, { pointerId: 2, clientX: 500, clientY: 300 });
    fireEvent.pointerUp(chai, { pointerId: 2, clientX: 500, clientY: 300 });
    fireEvent.click(chai);
    expect(chai).toHaveAttribute('aria-pressed', 'true');
    expect(within(footer()).getByText('Cutting Chai at Old Manali')).toBeInTheDocument();
  });

  test('a photo flung off the board stays on its edge, and the next drag starts from there', () => {
    render(<TravelMemory defaultOpen />);
    const uno = polaroid('UNO');
    const left = () => parseFloat(uno.style.transform.slice('translate('.length));

    fireEvent.pointerDown(uno, { button: 0, pointerId: 1, clientX: 500, clientY: 300 });
    fireEvent.pointerMove(uno, { pointerId: 1, clientX: -5000, clientY: 300 });
    fireEvent.pointerUp(uno, { pointerId: 1, clientX: -5000, clientY: 300 });
    expect(left()).toBeCloseTo(0);

    fireEvent.pointerDown(uno, { button: 0, pointerId: 2, clientX: 500, clientY: 300 });
    fireEvent.pointerMove(uno, { pointerId: 2, clientX: 530, clientY: 300 });
    expect(left()).toBeCloseTo(30);
  });

  test('the sound button mutes, and later memories stay quiet until it is turned back on', () => {
    const play = vi.spyOn(travelAudio, 'play');
    render(<TravelMemory defaultOpen />);

    fireEvent.click(polaroid('mountains'));
    fireEvent.click(screen.getByRole('button', { name: 'Mute sound' }));
    play.mockClear();

    fireEvent.click(polaroid('UNO'));
    expect(play).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Play sound' }));
    expect(play).toHaveBeenLastCalledWith('campfire');
    expect(screen.getByRole('button', { name: 'Mute sound' })).toBeInTheDocument();
  });

  test('stops the sound while the tab is hidden', () => {
    const stop = vi.spyOn(travelAudio, 'stop');
    const play = vi.spyOn(travelAudio, 'play');
    render(<TravelMemory defaultOpen />);
    fireEvent.click(polaroid('mountains'));
    stop.mockClear();
    play.mockClear();

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    fireEvent(document, new Event('visibilitychange'));
    expect(stop).toHaveBeenCalled();

    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    fireEvent(document, new Event('visibilitychange'));
    expect(play).toHaveBeenLastCalledWith('wind');
  });

  test('closes with the close button, Escape and a backdrop click, stopping any sound', () => {
    const stop = vi.spyOn(travelAudio, 'stop');
    render(<TravelMemory />);

    openBoard();
    fireEvent.click(polaroid('mountains'));
    fireEvent.click(screen.getByRole('button', { name: 'Close travel memories' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(stop).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Open travel memories' })).toHaveFocus();

    openBoard();
    expect(screen.getByText('drop a memory here')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    openBoard();
    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('clicks inside the board do not close it', () => {
    render(<TravelMemory defaultOpen />);
    fireEvent.click(screen.getByText('memories, on a string'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('locks page scroll while open', () => {
    render(<TravelMemory />);
    openBoard();
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.click(screen.getByRole('button', { name: 'Close travel memories' }));
    expect(document.body.style.overflow).toBe('');
  });

  test('#travel-memory opens the board and closing clears the hash', () => {
    window.location.hash = '#travel-memory';
    render(<TravelMemory />);
    expect(screen.getByRole('dialog', { name: 'Travel Memory' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close travel memories' }));
    expect(window.location.hash).toBe('');
  });

  test('a memory hash opens the board on that memory, without starting sound', () => {
    const play = vi.spyOn(travelAudio, 'play');
    window.location.hash = '#travel-sunsets';
    render(<TravelMemory />);

    expect(polaroid('sunsets')).toHaveAttribute('aria-pressed', 'true');
    expect(within(footer()).getByText('Violet Dusk Horizon')).toBeInTheDocument();
    expect(play).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Play sound' })).toBeInTheDocument();
  });

  describe('with several photos and an Instagram post', () => {
    const [base] = travelMemories;
    const trip: TravelMemoryItem = {
      ...base,
      id: 'travel-spiti',
      label: 'spiti',
      photos: [
        { src: '/travel/spiti-1.jpg', alt: 'Key Monastery' },
        { src: '/travel/spiti-2.jpg', alt: 'Chandratal lake' },
        { src: '/travel/spiti-3.jpg', alt: 'Kaza at night' },
      ],
      instagramUrl: 'https://www.instagram.com/p/spiti/',
    };
    const memories = [trip, travelMemories[1]];
    const viewer = () => screen.getByRole('group', { name: /^spiti, photo/ });

    test('the centre card steps through every photo of the memory, wrapping around', () => {
      render(<TravelMemory defaultOpen memories={memories} />);
      fireEvent.click(polaroid('spiti'));
      expect(viewer()).toHaveAccessibleName('spiti, photo 1 of 3');
      expect(within(viewer()).getByText('1/3')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
      expect(viewer()).toHaveAccessibleName('spiti, photo 2 of 3');
      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
      expect(viewer()).toHaveAccessibleName('spiti, photo 1 of 3');
      fireEvent.click(screen.getByRole('button', { name: 'Previous photo' }));
      expect(viewer()).toHaveAccessibleName('spiti, photo 3 of 3');
      // Only the photo on show is exposed to assistive tech.
      expect(within(viewer()).getByRole('img')).toHaveAttribute('alt', 'Kaza at night');
    });

    test('arrow keys and swipes move between photos too', () => {
      render(<TravelMemory defaultOpen memories={memories} />);
      fireEvent.click(polaroid('spiti'));

      fireEvent.keyDown(viewer(), { key: 'ArrowRight' });
      expect(viewer()).toHaveAccessibleName('spiti, photo 2 of 3');
      fireEvent.keyDown(viewer(), { key: 'ArrowLeft' });
      expect(viewer()).toHaveAccessibleName('spiti, photo 1 of 3');

      fireEvent.pointerDown(viewer(), { clientX: 300 });
      fireEvent.pointerUp(viewer(), { clientX: 200 });
      expect(viewer()).toHaveAccessibleName('spiti, photo 2 of 3');
      fireEvent.pointerDown(viewer(), { clientX: 200 });
      fireEvent.pointerUp(viewer(), { clientX: 190 });
      expect(viewer()).toHaveAccessibleName('spiti, photo 2 of 3');
    });

    test('each memory starts on its first photo', () => {
      render(<TravelMemory defaultOpen memories={memories} />);
      fireEvent.click(polaroid('spiti'));
      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
      fireEvent.click(polaroid(travelMemories[1].label));
      fireEvent.click(polaroid('spiti'));
      expect(viewer()).toHaveAccessibleName('spiti, photo 1 of 3');
    });

    test('a single photo needs no carousel controls', () => {
      render(<TravelMemory defaultOpen memories={memories} />);
      fireEvent.click(polaroid(travelMemories[1].label));
      expect(screen.queryByRole('button', { name: 'Next photo' })).not.toBeInTheDocument();
      expect(screen.queryByText('1/1')).not.toBeInTheDocument();
    });

    test('links to the Instagram post only when the memory has one', () => {
      render(<TravelMemory defaultOpen memories={memories} />);
      fireEvent.click(polaroid('spiti'));
      const link = within(footer()).getByRole('link', { name: 'Check the post on Instagram' });
      expect(link).toHaveAttribute('href', 'https://www.instagram.com/p/spiti/');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');

      fireEvent.click(polaroid(travelMemories[1].label));
      expect(within(footer()).queryByRole('link')).not.toBeInTheDocument();
    });
  });
});
