import { fireEvent, render, screen, within } from '@testing-library/react';
import Memories from './Memories';
import { memories } from '../data/memories';
import type { MemoryEvent } from '../data/memories';

const openBoard = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Open event memories' }));
const polaroid = (event: MemoryEvent) =>
  screen.getByRole('button', { name: `${event.label}, ${event.title}` });
const footer = () => screen.getByRole('dialog').querySelector('footer')!;
const [clickup, mongodb] = memories;

describe('Memories', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  test('shows a folder in the bottom-right corner with the event count', () => {
    const { container } = render(<Memories />);
    expect(container.querySelector('#memories')).toHaveClass('fixed', 'right-6', 'bottom-6');
    expect(screen.getByText('3 events')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('pins one polaroid per event, not per photo', () => {
    render(<Memories />);
    openBoard();

    const dialog = screen.getByRole('dialog', { name: 'Event Memories' });
    memories.forEach((event) => expect(polaroid(event)).toBeInTheDocument());
    expect(within(dialog).getAllByRole('button', { pressed: false })).toHaveLength(memories.length);
    expect(screen.getByText('see what it was like')).toBeInTheDocument();
  });

  test('bringing up an event shows its story and every one of its photos', () => {
    render(<Memories defaultOpen />);
    fireEvent.click(polaroid(mongodb));

    expect(within(footer()).getByText('MongoDB Developer Day')).toBeInTheDocument();
    expect(within(footer()).getByText(/Jul 2025/)).toBeInTheDocument();
    const viewer = screen.getByRole('group', { name: 'mongodb, photo 1 of 2' });
    fireEvent.click(within(viewer).getByRole('button', { name: 'Next photo' }));
    expect(viewer).toHaveAccessibleName('mongodb, photo 2 of 2');

    fireEvent.click(screen.getByRole('button', { name: 'Put mongodb back' }));
    expect(within(footer()).getByText('3 events')).toBeInTheDocument();
  });

  test('links to the LinkedIn and Twitter posts only when the event has them', () => {
    const events: MemoryEvent[] = [
      { ...clickup, twitterUrl: 'https://twitter.com/raghavbhatirv/status/1' },
      { ...mongodb, linkedInUrl: undefined, twitterUrl: undefined },
    ];
    render(<Memories defaultOpen events={events} />);

    fireEvent.click(polaroid(events[0]));
    const linkedIn = within(footer()).getByRole('link', { name: 'Check the post on LinkedIn' });
    const twitter = within(footer()).getByRole('link', { name: 'Check the post on Twitter' });
    expect(linkedIn).toHaveAttribute('href', clickup.linkedInUrl);
    expect(twitter).toHaveAttribute('href', 'https://twitter.com/raghavbhatirv/status/1');
    [linkedIn, twitter].forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
    });

    fireEvent.click(polaroid(events[1]));
    expect(within(footer()).queryByRole('link')).not.toBeInTheDocument();
  });

  test('an event hash opens the board on that event', () => {
    window.location.hash = '#mongodb-2025';
    render(<Memories />);
    expect(polaroid(mongodb)).toHaveAttribute('aria-pressed', 'true');
    expect(within(footer()).getByText('MongoDB Developer Day')).toBeInTheDocument();
  });

  test('closing clears the hash, empties the board and returns focus to the folder', () => {
    window.location.hash = '#memories';
    render(<Memories />);
    fireEvent.click(polaroid(clickup));

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('');
    expect(screen.getByRole('button', { name: 'Open event memories' })).toHaveFocus();

    openBoard();
    expect(screen.getByText('drop a memory here')).toBeInTheDocument();
  });
});
