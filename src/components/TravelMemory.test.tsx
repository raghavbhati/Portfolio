import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import TravelMemory from './TravelMemory';
import { CLOUDFLARE_R2_BASE_URL } from '../data/memories';
import type { TravelMemory as TravelMemoryItem } from '../data/travelMemories';

const openBoard = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Open travel memories' }));
/** A polaroid, by the place written under it. */
const polaroid = (place: string) => screen.getByRole('button', { name: new RegExp(`^${place},`) });
const footer = () => screen.getByRole('dialog').querySelector('footer')!;
const onCentre = (place: string) =>
  screen.getByRole('group', { name: new RegExp(`^${place}, photo`) });
const centreCard = () => onCentre('.+').closest('div.absolute')!;

// Sample trips for how the board behaves, whatever the real trips are.
const trip = (id: string, location: string, dates: string, photos = 1): TravelMemoryItem => ({
  id,
  location,
  dates,
  experience: `What ${location.split(',')[0]} was like`,
  photos: Array.from({ length: photos }, (_, index) => ({
    src: `/test/${id}-${index + 1}.jpg`,
    alt: `${location}, photo ${index + 1}`,
  })),
});
const trips = [
  trip('travel-rohtang', 'Rohtang Pass, Himachal Pradesh', 'Oct 2024'),
  trip('travel-kasauli', 'Sunset Point, Kasauli Hills', 'Aug 2024'),
  trip('travel-manali', 'Old Manali Ridge, Himachal Pradesh', 'Sep 2024'),
  trip('travel-tirthan', 'Tirthan Valley Riverside Camp', '12–14 Nov 2024'),
  trip('travel-solang', 'Solang Valley, Manali', 'Jun 2024'),
];
const LATEST = 'Tirthan Valley Riverside Camp';
const board = () => render(<TravelMemory defaultOpen memories={trips} />);

describe('TravelMemory', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  describe('the real trips', () => {
    test('show as a folder in the bottom-left corner with a count, the board closed', () => {
      const { container } = render(<TravelMemory />);
      expect(container.querySelector('#travel-memory')).toHaveClass('fixed', 'left-6', 'bottom-6');
      expect(screen.getByRole('button', { name: 'Open travel memories' })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
      expect(screen.getByText('3 places')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('open on the latest, the Yulla Kanda trek, with the other two pinned around it', () => {
      render(<TravelMemory />);
      openBoard();

      expect(onCentre('Yulla Kanda Trek')).toHaveAccessibleName('Yulla Kanda Trek, photo 1 of 4');
      expect(footer()).toHaveTextContent(
        'Yulla Kanda Trek, Kinnaur · 9–10 May 2026' +
          'A two-day trek up to the lake at Yulla Kanda.'
      );
      expect(polaroid('Shimla')).toHaveAccessibleName('Shimla, Himachal Pradesh, 21–23 Feb 2025');
      expect(polaroid('Aadi Himani Chamunda Trek')).toHaveAccessibleName(
        'Aadi Himani Chamunda Trek, Palampur, 9–10 Nov 2025'
      );
    });

    test('Yulla Kanda links to its photo dump on Instagram; the others have no post', () => {
      render(<TravelMemory defaultOpen />);
      const dump = within(footer()).getByRole('link', { name: 'See dump on Instagram' });
      expect(dump).toHaveAttribute('href', 'https://www.instagram.com/p/DYsTnAVk74n/');
      expect(dump).toHaveAttribute('target', '_blank');
      expect(dump).toHaveAttribute('rel', 'noreferrer');
      expect(dump).toHaveTextContent('See dump on Instagram ↗');

      fireEvent.click(polaroid('Shimla'));
      expect(within(footer()).queryByRole('link')).not.toBeInTheDocument();
    });

    test('use every photo from the portfolio-image bucket', () => {
      render(<TravelMemory defaultOpen />);
      fireEvent.click(polaroid('Shimla'));
      expect(onCentre('Shimla')).toHaveAccessibleName('Shimla, photo 1 of 4');
      const photos = Array.from(screen.getByRole('dialog').querySelectorAll('img'));
      expect(photos.length).toBeGreaterThan(0);
      photos.forEach((photo) =>
        expect(photo.getAttribute('src')).toMatch(new RegExp(`^${CLOUDFLARE_R2_BASE_URL}/`))
      );
    });
  });

  test('opens on the latest trip, with every other trip pinned around it', () => {
    board();
    const dialog = screen.getByRole('dialog', { name: 'Travel Memory' });
    expect(within(dialog).getByText('memories, on a string')).toBeInTheDocument();
    expect(onCentre(LATEST)).toBeInTheDocument();
    ['Rohtang Pass', 'Sunset Point', 'Old Manali Ridge', 'Solang Valley'].forEach((place) =>
      expect(polaroid(place)).toBeInTheDocument()
    );
    expect(screen.queryByRole('button', { name: new RegExp(`^${LATEST},`) })).toBeNull();
  });

  test('tells only where the trip was, when, and what it was like, with no sound', () => {
    board();
    expect(footer()).toHaveTextContent(
      'Tirthan Valley Riverside Camp · 12–14 Nov 2024What Tirthan Valley Riverside Camp was like'
    );
    expect(within(footer()).queryByRole('button')).not.toBeInTheDocument();
    expect(within(footer()).queryByRole('link')).not.toBeInTheDocument();
  });

  test('captions each polaroid with the place, without its region', () => {
    board();
    expect(polaroid('Rohtang Pass')).toHaveTextContent(/^Rohtang Pass$/);
  });

  test('photos around the centre card show at full strength, never dimmed or see-through', () => {
    board();
    // A see-through photo would show the strings tied behind it.
    expect(polaroid('Rohtang Pass').className).not.toMatch(/opacity-\d|brightness-/);
  });

  test('the centre card shows each photo whole, over a blurred copy that fills the card', () => {
    board();
    const [backdrop, photo] = Array.from(onCentre(LATEST).querySelectorAll('img'));
    expect(photo).toHaveClass('object-contain');
    expect(photo).toHaveAttribute('alt', 'Tirthan Valley Riverside Camp, photo 1');
    expect(backdrop).toHaveClass('object-cover', 'blur-2xl');
    expect(backdrop).toHaveAttribute('alt', '');
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop).toHaveAttribute('src', photo.getAttribute('src'));
  });

  test('ties the polaroids together with sagging strings', () => {
    board();
    const strings = screen.getByRole('dialog').querySelectorAll('svg path');
    // 3 links around the ring of 4, plus every other polaroid tied into the centre.
    expect(strings).toHaveLength(5);
    strings.forEach((path) => expect(path.getAttribute('d')).toMatch(/^M [\d.-]+ [\d.-]+ C /));
  });

  test('clicking a polaroid swaps it onto the centre card and tells its story', () => {
    board();
    const place = polaroid('Sunset Point');
    fireEvent.click(place);

    expect(onCentre('Sunset Point')).toBeInTheDocument();
    expect(within(footer()).getByText('Sunset Point, Kasauli Hills')).toBeInTheDocument();
    expect(within(footer()).getByText(/Aug 2024/)).toBeInTheDocument();
    // The trip that was up comes down into the place Sunset Point left.
    expect(place).toHaveAccessibleName(new RegExp(`^${LATEST},`));
    expect(screen.queryByRole('button', { name: /^Sunset Point,/ })).not.toBeInTheDocument();
  });

  test('each new trip trades places with the one on the centre card', () => {
    board();
    fireEvent.click(polaroid('Sunset Point'));
    const place = polaroid('Old Manali Ridge');
    fireEvent.click(place);

    expect(onCentre('Old Manali Ridge')).toBeInTheDocument();
    expect(within(footer()).getByText('What Old Manali Ridge was like')).toBeInTheDocument();
    expect(place).toHaveAccessibleName(/^Sunset Point,/);
  });

  test('closing and opening again goes back to the latest trip', () => {
    render(<TravelMemory memories={trips} />);
    openBoard();
    fireEvent.click(polaroid('Rohtang Pass'));
    fireEvent.click(screen.getByRole('button', { name: 'Close travel memories' }));

    openBoard();
    expect(onCentre(LATEST)).toBeInTheDocument();
    expect(polaroid('Rohtang Pass')).toBeInTheDocument();
  });

  test('dragging a polaroid onto the centre card brings it up; dropping it elsewhere does not', () => {
    board();
    const card = centreCard();
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

    const manali = polaroid('Old Manali Ridge');
    const pin = manali.style.transform;
    fireEvent.pointerDown(manali, { button: 0, pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(manali, { pointerId: 1, clientX: 300, clientY: 150 });
    fireEvent.pointerUp(manali, { pointerId: 1, clientX: 300, clientY: 150 });
    fireEvent.click(manali);
    expect(onCentre(LATEST)).toBeInTheDocument();

    fireEvent.pointerDown(manali, { button: 0, pointerId: 2, clientX: 300, clientY: 150 });
    fireEvent.pointerMove(manali, { pointerId: 2, clientX: 500, clientY: 300 });
    fireEvent.pointerUp(manali, { pointerId: 2, clientX: 500, clientY: 300 });
    fireEvent.click(manali);
    expect(onCentre('Old Manali Ridge')).toBeInTheDocument();
    // The latest trip comes down onto Old Manali's own pin, not where it was dropped.
    expect(manali).toHaveAccessibleName(new RegExp(`^${LATEST},`));
    expect(manali.style.transform).toBe(pin);
  });

  test('a photo flung off the board stays on its edge, and the next drag starts from there', () => {
    board();
    const sunset = polaroid('Sunset Point');
    const left = () => parseFloat(sunset.style.transform.slice('translate('.length));

    fireEvent.pointerDown(sunset, { button: 0, pointerId: 1, clientX: 500, clientY: 300 });
    fireEvent.pointerMove(sunset, { pointerId: 1, clientX: -5000, clientY: 300 });
    fireEvent.pointerUp(sunset, { pointerId: 1, clientX: -5000, clientY: 300 });
    expect(left()).toBeCloseTo(0);

    fireEvent.pointerDown(sunset, { button: 0, pointerId: 2, clientX: 500, clientY: 300 });
    fireEvent.pointerMove(sunset, { pointerId: 2, clientX: 530, clientY: 300 });
    expect(left()).toBeCloseTo(30);
  });

  test('closes with the close button, Escape and a backdrop click', () => {
    render(<TravelMemory memories={trips} />);

    openBoard();
    fireEvent.click(polaroid('Rohtang Pass'));
    fireEvent.click(screen.getByRole('button', { name: 'Close travel memories' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open travel memories' })).toHaveFocus();

    openBoard();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    openBoard();
    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('clicks inside the board do not close it', () => {
    board();
    fireEvent.click(screen.getByText('memories, on a string'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('locks page scroll while open', () => {
    render(<TravelMemory memories={trips} />);
    openBoard();
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.click(screen.getByRole('button', { name: 'Close travel memories' }));
    expect(document.body.style.overflow).toBe('');
  });

  test('#travel-memory opens the board and closing clears the hash', () => {
    window.location.hash = '#travel-memory';
    render(<TravelMemory memories={trips} />);
    expect(screen.getByRole('dialog', { name: 'Travel Memory' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close travel memories' }));
    expect(window.location.hash).toBe('');
  });

  test('a trip hash opens the board on that trip', () => {
    window.location.hash = '#travel-kasauli';
    render(<TravelMemory memories={trips} />);

    expect(onCentre('Sunset Point')).toBeInTheDocument();
    expect(polaroid(LATEST)).toBeInTheDocument();
    expect(within(footer()).getByText('Sunset Point, Kasauli Hills')).toBeInTheDocument();
  });

  describe('with several photos', () => {
    const spiti: TravelMemoryItem = {
      ...trip('travel-spiti', 'Spiti Valley, Himachal Pradesh', 'Dec 2024'),
      photos: [
        { src: '/test/spiti-1.jpg', alt: 'Key Monastery' },
        { src: '/test/spiti-2.jpg', alt: 'Chandratal lake' },
        { src: '/test/spiti-3.jpg', alt: 'Kaza at night' },
      ],
    };
    // Spiti is the later of the two, so it's on the centre card when the board opens.
    const memories = [spiti, trips[0]];
    const viewer = () => onCentre('Spiti Valley');
    const show = () => render(<TravelMemory defaultOpen memories={memories} />);

    test('the centre card steps through every photo of the trip, wrapping around', () => {
      show();
      expect(viewer()).toHaveAccessibleName('Spiti Valley, photo 1 of 3');
      expect(within(viewer()).getByText('1/3')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
      expect(viewer()).toHaveAccessibleName('Spiti Valley, photo 2 of 3');
      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
      expect(viewer()).toHaveAccessibleName('Spiti Valley, photo 1 of 3');
      fireEvent.click(screen.getByRole('button', { name: 'Previous photo' }));
      expect(viewer()).toHaveAccessibleName('Spiti Valley, photo 3 of 3');
      // Only the photo on show is exposed to assistive tech.
      expect(within(viewer()).getByRole('img')).toHaveAttribute('alt', 'Kaza at night');
    });

    test('arrow keys and swipes move between photos too', () => {
      show();
      fireEvent.keyDown(viewer(), { key: 'ArrowRight' });
      expect(viewer()).toHaveAccessibleName('Spiti Valley, photo 2 of 3');
      fireEvent.keyDown(viewer(), { key: 'ArrowLeft' });
      expect(viewer()).toHaveAccessibleName('Spiti Valley, photo 1 of 3');

      fireEvent.pointerDown(viewer(), { clientX: 300 });
      fireEvent.pointerUp(viewer(), { clientX: 200 });
      expect(viewer()).toHaveAccessibleName('Spiti Valley, photo 2 of 3');
      fireEvent.pointerDown(viewer(), { clientX: 200 });
      fireEvent.pointerUp(viewer(), { clientX: 190 });
      expect(viewer()).toHaveAccessibleName('Spiti Valley, photo 2 of 3');
    });

    test('each trip starts on its first photo', () => {
      show();
      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
      fireEvent.click(polaroid('Rohtang Pass'));
      fireEvent.click(polaroid('Spiti Valley'));
      expect(viewer()).toHaveAccessibleName('Spiti Valley, photo 1 of 3');
    });

    test('the card takes the shape of the photo on show, as large as fits', () => {
      show();
      // Two trips, so a near-square space in the middle of the default 1000×600 board.
      const space = viewer().parentElement!;
      const box = { width: parseFloat(space.style.width), height: parseFloat(space.style.height) };
      const load = (index: number, width: number, height: number) => {
        const photo = viewer().querySelectorAll('img:not([alt=""])')[index] as HTMLImageElement;
        Object.defineProperty(photo, 'naturalWidth', { value: width });
        Object.defineProperty(photo, 'naturalHeight', { value: height });
        fireEvent.load(photo);
      };
      // Until the photo has loaded, the card fills the space.
      expect(viewer()).toHaveStyle({ width: `${box.width}px`, height: `${box.height}px` });

      load(0, 3024, 4032); // a tall 3:4 photo: full height, narrower
      expect(viewer()).toHaveStyle({
        width: `${Math.round(box.height * 0.75)}px`,
        height: `${box.height}px`,
      });

      load(1, 4032, 2268); // a wide 16:9 photo, next in line
      fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
      expect(viewer()).toHaveStyle({
        width: `${box.width}px`,
        height: `${Math.round((box.width * 9) / 16)}px`,
      });
    });

    test('a photo already loaded on the board opens the card at its shape straight away', () => {
      show();
      const pinned = screen.getByRole('button', { name: /^Rohtang Pass,/ }).querySelector('img')!;
      Object.defineProperty(pinned, 'naturalWidth', { value: 4032 });
      Object.defineProperty(pinned, 'naturalHeight', { value: 2268 });
      fireEvent.load(pinned);

      fireEvent.click(polaroid('Rohtang Pass'));
      const card = onCentre('Rohtang Pass');
      const space = card.parentElement!;
      const width = parseFloat(space.style.width);
      expect(card).toHaveStyle({
        width: `${width}px`,
        height: `${Math.round((width * 9) / 16)}px`,
      });
    });

    test('a single photo needs no carousel controls', () => {
      show();
      fireEvent.click(polaroid('Rohtang Pass'));
      expect(screen.queryByRole('button', { name: 'Next photo' })).not.toBeInTheDocument();
      expect(screen.queryByText('1/1')).not.toBeInTheDocument();
    });
  });
});
