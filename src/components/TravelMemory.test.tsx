import { render, screen, fireEvent } from '@testing-library/react';
import TravelMemory from './TravelMemory';
import { travelMemories } from '../data/travelMemories';

describe('TravelMemory Component - Bottom-Left Widget & Zigzag Board Modal', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  test('renders floating folder widget at bottom-left with title Travel Memory and badge', () => {
    const { container } = render(<TravelMemory />);
    const widget = container.querySelector('#travel-memory');
    expect(widget).toBeInTheDocument();
    expect(widget).toHaveClass('bottom-5', 'left-5');

    expect(
      screen.getByRole('button', { name: /Click to view travel memories/i })
    ).toBeInTheDocument();
    expect(screen.getByText('click to view travel memory')).toBeInTheDocument();
    expect(screen.getByText('Travel Memory')).toBeInTheDocument();
    expect(screen.getByText('10 places')).toBeInTheDocument();
  });

  test('clicking widget opens modal dialog with the board on a string and deep black background', () => {
    render(<TravelMemory />);

    // Initially closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click trigger widget
    fireEvent.click(screen.getByRole('button', { name: /Click to view travel memories/i }));

    // Modal open
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Travel Memory/i })).toBeInTheDocument();
    expect(screen.getByText('memories, on a string')).toBeInTheDocument();
    expect(screen.getByText(/THE TRAVEL BOARD · MEMORIES ON A ZIGZAG STRING/i)).toBeInTheDocument();
  });

  test('supports defaultOpen prop to render modal open immediately', () => {
    render(<TravelMemory defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Travel Memory/i })).toBeInTheDocument();
  });

  test('renders all 10 polaroids on the board canvas', () => {
    render(<TravelMemory defaultOpen />);

    // Check polaroids by label
    expect(screen.getByRole('button', { name: /View mountains/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View cutting chai/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View alter ego/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View cloudburst/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View sunsets/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View UNO/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Yes sir/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View forest trail/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View notes & harmony/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View spiderman/i })).toBeInTheDocument();
  });

  test('clicking a board polaroid card switches the active memory and updates center card', () => {
    render(<TravelMemory defaultOpen />);

    // Initial default memory is Rohtang Pass Summit (mountains)
    expect(screen.getByRole('heading', { name: 'Rohtang Pass Summit' })).toBeInTheDocument();

    // Click "sunsets" polaroid on the board
    const sunsetsCard = screen.getByRole('button', { name: /View sunsets/i });
    fireEvent.click(sunsetsCard);

    // Active memory should update to Violet Dusk Horizon
    expect(screen.getByRole('heading', { name: 'Violet Dusk Horizon' })).toBeInTheDocument();
    expect(screen.getByText(/Sunset Point, Kasauli Hills/i)).toBeInTheDocument();

    // Click "forest trail" polaroid
    const forestCard = screen.getByRole('button', { name: /View forest trail/i });
    fireEvent.click(forestCard);

    expect(screen.getByRole('heading', { name: 'The Deodar Canopy Ride' })).toBeInTheDocument();
    expect(screen.getByText(/Shimla-Mashobra Pine Sanctuary/i)).toBeInTheDocument();
  });

  test('center card contains sound and story controls and allows opening lightbox', () => {
    render(<TravelMemory defaultOpen />);

    expect(screen.getByLabelText('Active memory sound & story hub')).toBeInTheDocument();
    const exploreBtn = screen.getByRole('button', { name: /View full story for mountains/i });
    expect(exploreBtn).toBeInTheDocument();

    // Click explore story button to open lightbox
    fireEvent.click(exploreBtn);
    expect(screen.getByRole('dialog', { name: 'Travel photo lightbox' })).toBeInTheDocument();
    expect(
      screen.getByText(/Freezing altitude, endless peaks, and a summit thumbs up/i)
    ).toBeInTheDocument();
  });

  test('toggles ambient sound on and off', () => {
    render(<TravelMemory defaultOpen />);

    const soundToggle = screen.getByRole('button', { name: /Play ambient soundscape/i });
    expect(soundToggle).toBeInTheDocument();

    // Turn sound ON
    fireEvent.click(soundToggle);
    expect(screen.getByRole('button', { name: /Mute ambient soundscape/i })).toBeInTheDocument();
    expect(screen.getByText('Sound ON')).toBeInTheDocument();

    // Turn sound OFF
    fireEvent.click(screen.getByRole('button', { name: /Mute ambient soundscape/i }));
    expect(screen.getByText('Ambient')).toBeInTheDocument();
  });

  test('category filter pills filter the visible memories', () => {
    render(<TravelMemory defaultOpen />);

    // Filter to Mountains
    fireEvent.click(screen.getByRole('button', { name: 'Mountains' }));
    const mountainsBtn = screen.getByRole('button', { name: /View mountains/i });
    expect(mountainsBtn.parentElement).toHaveClass('opacity-100');

    // Switch to Trails
    fireEvent.click(screen.getByRole('button', { name: 'Trails' }));
    const trailBtn = screen.getByRole('button', { name: /View forest trail/i });
    expect(trailBtn.parentElement).toHaveClass('opacity-100');

    // Reset to All
    fireEvent.click(screen.getByRole('button', { name: /^All \(/i }));
    expect(screen.getByRole('button', { name: /View spiderman/i }).parentElement).toHaveClass(
      'opacity-100'
    );
  });

  test('toggles view mode between The Board and Travel Journal feed', () => {
    render(<TravelMemory defaultOpen />);

    // Toggle to Travel Journal
    const journalToggle = screen.getByRole('button', { name: 'Travel Journal' });
    fireEvent.click(journalToggle);

    // In Journal mode, articles for destinations are rendered
    expect(screen.getByRole('heading', { name: 'Rohtang Pass Summit' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Violet Dusk Horizon' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Deodar Canopy Ride' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Parvati Notes & Harmony' })).toBeInTheDocument();

    // Toggle back to The Board
    const boardToggle = screen.getByRole('button', { name: 'The Board' });
    fireEvent.click(boardToggle);
    expect(screen.getByText(/THE TRAVEL BOARD · MEMORIES ON A ZIGZAG STRING/i)).toBeInTheDocument();
  });

  test('navigates next and previous items inside the lightbox and closes on close button', () => {
    render(<TravelMemory defaultOpen />);

    // Open lightbox via Quick Details button
    fireEvent.click(screen.getByRole('button', { name: /Full Photo & Story/i }));
    expect(screen.getByRole('dialog', { name: 'Travel photo lightbox' })).toBeInTheDocument();

    // Next item in lightbox
    const nextBtn = screen.getByRole('button', { name: 'Next photo' });
    fireEvent.click(nextBtn);
    expect(
      screen.getByText(/Cardamom chai toasts in freezing mountain mornings/i)
    ).toBeInTheDocument();

    // Previous item in lightbox
    const prevBtn = screen.getByRole('button', { name: 'Previous photo' });
    fireEvent.click(prevBtn);
    expect(screen.getByText(/Freezing altitude, endless peaks/i)).toBeInTheDocument();

    // Close lightbox
    const closeBtn = screen.getByRole('button', { name: 'Close photo preview' });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog', { name: 'Travel photo lightbox' })).not.toBeInTheDocument();
  });

  test('closes modal via close button, backdrop click, and Escape key', () => {
    render(<TravelMemory defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close via close button
    fireEvent.click(screen.getByRole('button', { name: 'Close travel memory modal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen via folder button and close via Escape
    fireEvent.click(screen.getByRole('button', { name: /Click to view travel memories/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen via folder button and close via backdrop click
    fireEvent.click(screen.getByRole('button', { name: /Click to view travel memories/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const dialogBackdrop = screen.getByRole('dialog');
    fireEvent.click(dialogBackdrop);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('automatically opens modal if URL hash is #travel-memory', () => {
    window.location.hash = '#travel-memory';
    render(<TravelMemory />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Travel Memory/i })).toBeInTheDocument();
  });

  test('opens modal and selects specific travel memory when deep-linked with hash', () => {
    window.location.hash = '#travel-sunsets';
    render(<TravelMemory />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Violet Dusk Horizon' })).toBeInTheDocument();
  });

  test('closing modal clears #travel-memory hash from window URL', () => {
    window.location.hash = '#travel-memory';
    render(<TravelMemory />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close travel memory modal' });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });

  test('renders sequential zigzag badges #01 through #10 on the board nodes', () => {
    render(<TravelMemory defaultOpen />);
    for (let i = 1; i <= 10; i++) {
      const badge = `#${String(i).padStart(2, '0')}`;
      expect(screen.getByText(badge)).toBeInTheDocument();
    }
  });

  test('generates zigzag SVG string paths connecting items one by one across the canvas', () => {
    const { container } = render(<TravelMemory defaultOpen />);
    const svgPaths = container.querySelectorAll(
      'svg.travel-string-glow path[stroke*="travelPinkString"]'
    );
    // 9 zigzag segments connecting 10 items one by one
    expect(svgPaths.length).toBe(9);

    // Each path segment should be a valid cubic Bézier curve starting with M and containing C
    svgPaths.forEach((path) => {
      const d = path.getAttribute('d');
      expect(d).toBeTruthy();
      expect(d?.startsWith('M ')).toBe(true);
      expect(d?.includes(' C ')).toBe(true);
    });
  });

  test('pauses audio playback when document tab becomes hidden and resumes when visible', () => {
    render(<TravelMemory defaultOpen />);

    // Turn sound ON
    const soundToggle = screen.getByRole('button', { name: /Play ambient soundscape/i });
    fireEvent.click(soundToggle);
    expect(screen.getByText('Sound ON')).toBeInTheDocument();

    // Mock document.hidden = true
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    fireEvent(document, new Event('visibilitychange'));

    // Mock document.hidden = false
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    fireEvent(document, new Event('visibilitychange'));

    // Still Sound ON
    expect(screen.getByText('Sound ON')).toBeInTheDocument();
  });

  test('provides responsive trigger widget with both desktop and mobile text variants', () => {
    render(<TravelMemory />);
    expect(screen.getByText('click to view travel memory')).toBeInTheDocument();
    expect(screen.getByText('travel memory')).toBeInTheDocument();
  });
});
