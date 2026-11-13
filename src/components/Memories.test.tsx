import { fireEvent, render, screen, within } from '@testing-library/react';
import Memories from './Memories';
import { memories } from '../data/memories';
import type { MemoryEvent } from '../data/memories';

const openBoard = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Open event memories' }));
const polaroid = (event: MemoryEvent) =>
  screen.getByRole('button', { name: `${event.title}, ${event.date}` });
const footer = () => screen.getByRole('dialog').querySelector('footer')!;
const onCentre = (event: MemoryEvent) =>
  screen.getByRole('group', { name: new RegExp(`^${event.title}, photo`) });
const [clickhouse, mongodb, promptwars] = memories;

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

  test('opens on the latest event, with one polaroid per other event pinned around it', () => {
    render(<Memories />);
    openBoard();

    screen.getByRole('dialog', { name: 'Event Memories' });
    expect(onCentre(promptwars)).toBeInTheDocument();
    [clickhouse, mongodb].forEach((event) => expect(polaroid(event)).toBeInTheDocument());
    expect(
      screen.queryByRole('button', { name: `${promptwars.title}, ${promptwars.date}` })
    ).not.toBeInTheDocument();
  });

  test('tells only the title, date and description of the event that is up', () => {
    render(<Memories defaultOpen />);
    expect(footer()).toHaveTextContent(
      'Promptwars Hackathon · 17th Oct 2026' +
        '1day sprint: rapid AI prototyping & distributed services'
    );
    expect(within(footer()).queryByRole('link')).not.toBeInTheDocument();
    expect(within(footer()).queryByRole('button')).not.toBeInTheDocument();
  });

  test('bringing up an event shows its story and every one of its photos', () => {
    render(<Memories defaultOpen />);
    const place = polaroid(mongodb);
    fireEvent.click(place);

    expect(within(footer()).getByText('MongoDB.local Delhi')).toBeInTheDocument();
    expect(within(footer()).getByText(/1st Jul 2025/)).toBeInTheDocument();
    expect(
      within(footer()).getByText('Atlas, vector search & generative AI pipelines')
    ).toBeInTheDocument();
    const viewer = screen.getByRole('group', { name: 'MongoDB.local Delhi, photo 1 of 3' });
    fireEvent.click(within(viewer).getByRole('button', { name: 'Next photo' }));
    expect(viewer).toHaveAccessibleName('MongoDB.local Delhi, photo 2 of 3');

    // The event that was up comes down into the place mongodb left.
    expect(place).toHaveAccessibleName(`${promptwars.title}, ${promptwars.date}`);
  });

  test('an event hash opens the board on that event', () => {
    window.location.hash = '#mongodb-2025';
    render(<Memories />);
    expect(onCentre(mongodb)).toBeInTheDocument();
    expect(within(footer()).getByText('MongoDB.local Delhi')).toBeInTheDocument();
    expect(polaroid(promptwars)).toBeInTheDocument();
  });

  test('closing clears the hash, returns focus to the folder, and reopens on the latest', () => {
    window.location.hash = '#memories';
    render(<Memories />);
    fireEvent.click(polaroid(clickhouse));

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(window.location.hash).toBe('');
    expect(screen.getByRole('button', { name: 'Open event memories' })).toHaveFocus();

    openBoard();
    expect(onCentre(promptwars)).toBeInTheDocument();
  });
});
