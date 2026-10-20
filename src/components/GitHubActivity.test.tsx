import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import GitHubActivity from './GitHubActivity';

// 53 weeks ending with the current one; a quiet start, a busy middle.
const weeks = Array.from({ length: 53 }, (_, index) => ({
  start: new Date(Date.UTC(2024, 9, 20 + index * 7)).toISOString().slice(0, 10),
  count: index < 5 ? 0 : index === 30 ? 40 : index % 7,
}));
const data = { total: weeks.reduce((sum, week) => sum + week.count, 0), weeks };

function respond(body: unknown, ok = true) {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok, status: ok ? 200 : 503, json: async () => body });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('GitHubActivity', () => {
  afterEach(() => vi.unstubAllGlobals());

  test('draws a year of weekly contributions from the API', async () => {
    const fetchMock = respond(data);
    render(<GitHubActivity />);
    expect(screen.getByRole('status', { name: 'Loading contribution graph' })).toBeInTheDocument();

    const graph = await screen.findByRole('img', {
      name: /contributions on GitHub in the last year/,
    });
    expect(fetchMock.mock.calls[0][0]).toBe('/api/github-contributions');
    expect(graph.children).toHaveLength(53);
    expect(graph).toHaveAccessibleName(
      `${data.total} contributions on GitHub in the last year. Busiest week: ${new Date(
        weeks[30].start
      ).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      })}, with 40 contributions.`
    );
    expect(screen.getByText(data.total.toLocaleString('en-IN'))).toBeInTheDocument();
    // This week is picked out in the accent; empty weeks are dotted stubs.
    expect(graph.lastElementChild).toHaveClass('bg-string');
    expect(graph.firstElementChild).toHaveStyle({ height: '18px' });
    expect(screen.queryByText(/not connected here yet/)).not.toBeInTheDocument();
  });

  test('hovering a week tells its story', async () => {
    respond(data);
    render(<GitHubActivity />);
    const graph = await screen.findByRole('img');
    expect(screen.getByText(`This week · ${weeks[52].count} contributions`)).toBeInTheDocument();

    fireEvent.mouseEnter(graph.children[30]);
    expect(screen.getByText(/^Week of .* · 40 contributions$/)).toBeInTheDocument();
    fireEvent.mouseLeave(graph);
    expect(screen.getByText(/^This week · /)).toBeInTheDocument();
  });

  test.each([
    ['the function is not set up', () => respond({ error: 'not-configured' }, false)],
    ['the answer is malformed', () => respond({ total: 'lots' })],
    [
      'the request fails',
      () => vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline'))),
    ],
  ])('says so plainly when %s', async (_, setup) => {
    setup();
    render(<GitHubActivity />);
    expect(
      await screen.findByText(/Contribution graph is unavailable right now/)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View GitHub ↗' })).toHaveAttribute(
      'href',
      'https://github.com/raghavbhati'
    );
  });
});
