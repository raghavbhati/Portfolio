import { render, screen, fireEvent } from '@testing-library/react';
import Memories from './Memories';
import { memories } from '../data/memories';

describe('Memories Component - Floating Widget & Modal Timeline', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  test('renders floating folder widget at bottom-right with badge and photos preview', () => {
    const { container } = render(<Memories />);
    expect(container.querySelector('#memories')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Click to view memories/i })).toBeInTheDocument();
    expect(screen.getByText('click to view memories')).toBeInTheDocument();
    expect(screen.getByText('3 events')).toBeInTheDocument();
  });

  test('clicking folder widget opens modal dialog with connected dots timeline and 3 events', () => {
    render(<Memories />);

    // Modal initially closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Click trigger widget
    fireEvent.click(screen.getByRole('button', { name: /Click to view memories/i }));

    // Modal is now open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Memories & Timeline/i })).toBeInTheDocument();
    expect(screen.getByText('memories, on a string')).toBeInTheDocument();

    // Verify all 3 events are present in the top ribbon and connected list
    expect(
      screen.getByRole('button', { name: /Jump to ClickUp Event \(March 2025\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Jump to MongoDB Developer Day \(July 2025\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Jump to Google Hackathon \(October 2025\)/i })
    ).toBeInTheDocument();
  });

  test('supports defaultOpen prop to render modal open immediately', () => {
    render(<Memories defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ClickUp Event' })).toBeInTheDocument();
  });

  test('clicking an event in connected dots ribbon or milestone list switches the active event', () => {
    render(<Memories defaultOpen />);

    // Default active event is ClickUp Event
    expect(screen.getByRole('heading', { name: 'ClickUp Event' })).toBeInTheDocument();
    expect(screen.getByText('March 2025')).toBeInTheDocument();
    expect(screen.getByText(/Modern Engineering Workflows & Team Velocity/i)).toBeInTheDocument();

    // Click MongoDB Developer Day
    fireEvent.click(
      screen.getByRole('button', { name: /Select event: MongoDB Developer Day \(July 2025\)/i })
    );
    expect(screen.getByRole('heading', { name: 'MongoDB Developer Day' })).toBeInTheDocument();
    expect(screen.getByText('July 2025')).toBeInTheDocument();
    expect(
      screen.getByText(/MongoDB Atlas, Vector Search & Generative AI Pipelines/i)
    ).toBeInTheDocument();

    // Click Google Hackathon via top ribbon
    fireEvent.click(
      screen.getByRole('button', { name: /Jump to Google Hackathon \(October 2025\)/i })
    );
    expect(screen.getByRole('heading', { name: 'Google Hackathon' })).toBeInTheDocument();
    expect(screen.getByText('October 2025')).toBeInTheDocument();
    expect(screen.getByText(/48-Hour Sprint: Rapid AI Prototyping/i)).toBeInTheDocument();
  });

  test('renders scrollable image controls and allows advancing slides', () => {
    render(<Memories defaultOpen />);

    // In showcase mode, the active event images are rendered
    const images = screen.getAllByRole('button', { name: /View photo/i });
    expect(images.length).toBeGreaterThanOrEqual(1);

    const nextBtn = screen.getByRole('button', { name: 'Next image' });
    const prevBtn = screen.getByRole('button', { name: 'Previous image' });

    // Prev button initially disabled on first image
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();

    // Click next button
    fireEvent.click(nextBtn);
    expect(prevBtn).toBeEnabled();

    // Click previous button
    fireEvent.click(prevBtn);
    expect(prevBtn).toBeDisabled();
  });

  test('renders LinkedIn redirection button for active event with secure attributes', () => {
    render(<Memories defaultOpen />);
    const linkedInBtn = screen.getByRole('link', { name: /View LinkedIn post for ClickUp Event/i });
    expect(linkedInBtn).toBeInTheDocument();
    expect(linkedInBtn).toHaveAttribute('target', '_blank');
    expect(linkedInBtn).toHaveAttribute('rel', 'noreferrer');
    expect(linkedInBtn.getAttribute('href')).toContain('linkedin.com');
  });

  test('opens lightbox on photo click and supports navigating between photos', () => {
    render(<Memories defaultOpen />);
    const photoButtons = screen.getAllByRole('button', { name: /View photo 1 of/i });
    expect(photoButtons.length).toBeGreaterThan(0);

    // Open lightbox
    fireEvent.click(photoButtons[0]);
    const closeBtn = screen.getByRole('button', { name: 'Close photo preview' });
    expect(closeBtn).toBeInTheDocument();
    expect(screen.getByText(/Photo 1 of/i)).toBeInTheDocument();

    // Next photo inside lightbox
    const nextPhotoBtn = screen.getByRole('button', { name: 'Next photo' });
    expect(nextPhotoBtn).toBeInTheDocument();
    fireEvent.click(nextPhotoBtn);
    expect(screen.getByText(/Photo 2 of/i)).toBeInTheDocument();

    // Close lightbox
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('button', { name: 'Close photo preview' })).not.toBeInTheDocument();
  });

  test('category filter pills filter the available events and update active selection', () => {
    render(<Memories defaultOpen />);

    // Filter to Hackathons
    fireEvent.click(screen.getByRole('button', { name: 'Hackathons' }));
    expect(screen.getByRole('heading', { name: 'Google Hackathon' })).toBeInTheDocument();
    expect(screen.getByText('October 2025')).toBeInTheDocument();

    // Filter to Conferences
    fireEvent.click(screen.getByRole('button', { name: 'Conferences' }));
    expect(screen.getByRole('heading', { name: 'ClickUp Event' })).toBeInTheDocument();

    // Reset to All
    fireEvent.click(screen.getByRole('button', { name: /^All \(/i }));
    expect(
      screen.getByRole('button', { name: /Select event: ClickUp Event/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Select event: MongoDB Developer Day/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Select event: Google Hackathon/i })
    ).toBeInTheDocument();
  });

  test('toggles view mode between Showcase and All Events stream', () => {
    render(<Memories defaultOpen />);

    // Toggle to All Events (timeline stream)
    const allEventsToggle = screen.getByRole('button', { name: 'All Events' });
    fireEvent.click(allEventsToggle);

    // In All Events mode, all 3 event articles are rendered simultaneously
    expect(screen.getByRole('heading', { name: 'ClickUp Event' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'MongoDB Developer Day' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Google Hackathon' })).toBeInTheDocument();

    // Toggle back to Showcase mode
    const showcaseToggle = screen.getByRole('button', { name: 'Showcase' });
    fireEvent.click(showcaseToggle);
    expect(screen.getByLabelText('List of events with connected dots')).toBeInTheDocument();
  });

  test('closes modal via close button, backdrop click, and Escape key', () => {
    render(<Memories defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close via close button
    fireEvent.click(screen.getByRole('button', { name: 'Close memories modal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen via folder button and close via Escape
    fireEvent.click(screen.getByRole('button', { name: /Click to view memories/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen via folder button and close via backdrop click
    fireEvent.click(screen.getByRole('button', { name: /Click to view memories/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const dialogBackdrop = screen.getByRole('dialog');
    fireEvent.click(dialogBackdrop);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('automatically opens modal if URL hash is #memories', () => {
    window.location.hash = '#memories';
    render(<Memories />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Memories & Timeline/i })).toBeInTheDocument();
  });

  test('opens modal and selects specific event when deep-linked with event hash', () => {
    window.location.hash = '#mongodb-2025';
    render(<Memories />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'MongoDB Developer Day' })).toBeInTheDocument();
    expect(screen.getByText('July 2025')).toBeInTheDocument();
  });

  test('clicking board polaroid card switches active event', () => {
    render(<Memories defaultOpen />);
    expect(screen.getByRole('heading', { name: 'ClickUp Event' })).toBeInTheDocument();

    // Click Google Hackathon polaroid on board
    const googleBoardCard = screen.getByRole('button', {
      name: /View Google Hackathon \(October 2025\) on board/i,
    });
    fireEvent.click(googleBoardCard);
    expect(screen.getByRole('heading', { name: 'Google Hackathon' })).toBeInTheDocument();
    expect(screen.getByText('October 2025')).toBeInTheDocument();

    // Click MongoDB polaroid on board
    const mongoBoardCard = screen.getByRole('button', {
      name: /View MongoDB Developer Day \(July 2025\) on board/i,
    });
    fireEvent.click(mongoBoardCard);
    expect(screen.getByRole('heading', { name: 'MongoDB Developer Day' })).toBeInTheDocument();
    expect(screen.getByText('July 2025')).toBeInTheDocument();
  });

  test('closing modal clears #memories or event hash from window URL', () => {
    window.location.hash = '#memories';
    render(<Memories />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close memories modal' });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('');
  });
});
