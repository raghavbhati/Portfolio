import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import GitHubActivity from './GitHubActivity';

// A year of days from Sunday 2 Nov 2025 to Friday 6 Nov 2026: four busy days, the
// busiest on 21 May 2026, and one contribution this week.
const counts: Record<number, number> = { 1: 3, 4: 2, 200: 12, 369: 1 };
const days = Array.from({ length: 370 }, (_, index) => ({
  date: new Date(Date.UTC(2025, 10, 2 + index)).toISOString().slice(0, 10),
  count: counts[index] ?? 0,
}));
const data = { total: 18, days };

function respond(body: unknown, ok = true) {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok, status: ok ? 200 : 503, json: async () => body });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const calendar = () =>
  screen.findByRole('img', { name: /contributions on GitHub in the last year/ });

describe('GitHubActivity', () => {
  afterEach(() => vi.unstubAllGlobals());

  test('draws a square for every day of the last year, a column per week from Sunday', async () => {
    const fetchMock = respond(data);
    render(<GitHubActivity />);
    expect(screen.getByRole('status', { name: 'Loading contribution graph' })).toBeInTheDocument();

    const graph = await calendar();
    expect(fetchMock.mock.calls[0][0]).toBe('/api/github-contributions');
    expect(graph).toHaveAccessibleName(
      '18 contributions on GitHub in the last year. Busiest day: Thu, 21 May 2026, with 12 contributions.'
    );
    expect(screen.getByText('18')).toBeInTheDocument();

    // 53 weeks of 7; the last week ends on a Friday, so its Saturday is blank.
    expect(graph.children).toHaveLength(53 * 7);
    expect(graph.children[0]).toHaveAttribute('title', 'Sun, 2 Nov 2025 · 0 contributions');
    expect(graph.children[369]).toHaveAttribute('title', 'Fri, 6 Nov 2026 · 1 contribution');
    expect(graph.children[370]).not.toHaveAttribute('title');
  });

  test('shades each day by how busy it was, with a legend', async () => {
    respond(data);
    render(<GitHubActivity />);
    const graph = await calendar();
    const shade = (index: number) => graph.children[index];

    expect(shade(0)).toHaveClass('bg-tag');
    expect(shade(369)).toHaveClass('bg-string/25');
    expect(shade(4)).toHaveClass('bg-string/45');
    expect(shade(1)).toHaveClass('bg-string/70');
    expect(shade(200)).toHaveClass('bg-string');
    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
  });

  test('labels the months, skipping a sliver of one at the end', async () => {
    respond(data);
    render(<GitHubActivity />);
    const graph = await calendar();
    const labels = Array.from(graph.nextElementSibling!.children).map((label) => label.textContent);
    expect(labels).toEqual([
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
    ]);
  });

  test('hovering a day tells its date and count', async () => {
    respond(data);
    render(<GitHubActivity />);
    const graph = await calendar();
    expect(screen.getByText('This week · 1 contribution')).toBeInTheDocument();

    fireEvent.mouseEnter(graph.children[200]);
    expect(screen.getByText('Thu, 21 May 2026 · 12 contributions')).toBeInTheDocument();
    expect(graph.children[200]).toHaveClass('ring-1');
    fireEvent.mouseLeave(graph);
    expect(screen.getByText('This week · 1 contribution')).toBeInTheDocument();
  });

  test('falls back to GitHub’s public calendar where the site’s own function is not running', async () => {
    const fetchMock = vi.fn((url: string) =>
      Promise.resolve(
        url === '/api/github-contributions'
          ? // The dev server answers an unknown route with the page itself.
            {
              ok: true,
              status: 200,
              json: async () => {
                throw new SyntaxError('Unexpected token <');
              },
            }
          : {
              ok: true,
              status: 200,
              json: async () => ({ total: { lastYear: 18 }, contributions: days }),
            }
      )
    );
    vi.stubGlobal('fetch', fetchMock);
    render(<GitHubActivity />);

    const graph = await calendar();
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/api/github-contributions',
      'https://github-contributions-api.jogruber.de/v4/raghavbhati?y=last',
    ]);
    expect(graph).toHaveAccessibleName(/^18 contributions/);
    expect(graph.children).toHaveLength(53 * 7);
  });

  test('has no list of repositories', async () => {
    respond(data);
    render(<GitHubActivity />);
    await calendar();
    expect(screen.queryByText('Project repositories')).not.toBeInTheDocument();
  });

  test.each([
    ['neither source is set up', () => respond({ error: 'not-configured' }, false)],
    ['both answers are malformed', () => respond({ total: 'lots' })],
    [
      'both requests fail',
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
