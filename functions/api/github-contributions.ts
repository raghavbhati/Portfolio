// Cloudflare Pages Function: GET /api/github-contributions
//
// Asks GitHub's GraphQL API for the last year of contributions and returns weekly totals.
// The token stays here on the server (set GITHUB_TOKEN in Cloudflare Pages → Settings →
// Variables and Secrets; a classic token with no scopes is enough for public data).
// Answers are kept in Cloudflare's edge cache for six hours.
import {
  CONTRIBUTIONS_QUERY,
  GITHUB_LOGIN,
  toWeeklyContributions,
} from '../../src/utils/githubContributions';
import type { ContributionCalendar } from '../../src/utils/githubContributions';

const CACHE_SECONDS = 6 * 60 * 60;

interface Env {
  GITHUB_TOKEN?: string;
}

interface Context {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
}

interface GraphQLResponse {
  data?: { user?: { contributionsCollection?: { contributionCalendar?: ContributionCalendar } } };
}

// Cloudflare's edge cache; not part of the browser's CacheStorage types.
declare const caches: CacheStorage & { default: Cache };

function json(body: unknown, status: number, maxAge = 0) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': maxAge > 0 ? `public, max-age=${maxAge}` : 'no-store',
    },
  });
}

export async function onRequestGet({ request, env, waitUntil }: Context): Promise<Response> {
  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  if (!env.GITHUB_TOKEN) return json({ error: 'not-configured' }, 503);

  let calendar: ContributionCalendar | undefined;
  try {
    const upstream = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        authorization: `bearer ${env.GITHUB_TOKEN}`,
        'content-type': 'application/json',
        'user-agent': 'raghavbhatirv.in',
      },
      body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { login: GITHUB_LOGIN } }),
    });
    if (upstream.ok) {
      const payload = (await upstream.json()) as GraphQLResponse;
      calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
    }
  } catch {
    // Network trouble reaching GitHub; answered below.
  }
  if (!calendar) return json({ error: 'upstream' }, 502);

  const response = json(toWeeklyContributions(calendar), 200, CACHE_SECONDS);
  waitUntil(cache.put(request, response.clone()));
  return response;
}
