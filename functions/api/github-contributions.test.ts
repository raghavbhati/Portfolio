// @vitest-environment node
import { vi } from 'vitest';
import { onRequestGet } from './github-contributions';

const calendar = {
  totalContributions: 7,
  weeks: [
    {
      firstDay: '2025-10-12',
      contributionDays: [{ contributionCount: 3 }, { contributionCount: 4 }],
    },
  ],
};

function setup({ cached }: { cached?: Response } = {}) {
  const cache = {
    match: vi.fn().mockResolvedValue(cached),
    put: vi.fn().mockResolvedValue(undefined),
  };
  vi.stubGlobal('caches', { default: cache });
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  const waitUntil = vi.fn();
  const call = (token?: string) =>
    onRequestGet({
      request: new Request('https://www.raghavbhatirv.in/api/github-contributions'),
      env: { GITHUB_TOKEN: token },
      waitUntil,
    });
  return { cache, fetchMock, waitUntil, call };
}

describe('GET /api/github-contributions', () => {
  afterEach(() => vi.unstubAllGlobals());

  test('asks GitHub with the token, returns weekly totals and caches them for six hours', async () => {
    const { cache, fetchMock, waitUntil, call } = setup();
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { user: { contributionsCollection: { contributionCalendar: calendar } } },
        })
      )
    );

    const response = await call('secret-token');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ total: 7, weeks: [{ start: '2025-10-12', count: 7 }] });
    expect(response.headers.get('cache-control')).toBe('public, max-age=21600');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.github.com/graphql');
    expect(init.headers.authorization).toBe('bearer secret-token');
    expect(JSON.parse(init.body).variables).toEqual({ login: 'raghavbhati' });
    expect(waitUntil).toHaveBeenCalled();
    expect(cache.put).toHaveBeenCalled();
  });

  test('a cached answer is served without asking GitHub', async () => {
    const cached = new Response('{"total":1,"weeks":[]}');
    const { fetchMock, call } = setup({ cached });
    expect(await call('secret-token')).toBe(cached);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('without a token it says so instead of calling GitHub', async () => {
    const { fetchMock, call } = setup();
    const response = await call();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: 'not-configured' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test.each([
    ['an error status', () => Promise.resolve(new Response('nope', { status: 401 }))],
    ['an unexpected body', () => Promise.resolve(new Response(JSON.stringify({ errors: [{}] })))],
    ['a network failure', () => Promise.reject(new TypeError('fetch failed'))],
  ])('GitHub %s becomes a 502 that is not cached', async (_, reply) => {
    const { cache, fetchMock, call } = setup();
    fetchMock.mockImplementation(reply);
    const response = await call('secret-token');
    expect(response.status).toBe(502);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(cache.put).not.toHaveBeenCalled();
  });
});
