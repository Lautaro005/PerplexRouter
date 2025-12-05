import type { APIRoute } from 'astro';
import { load } from 'cheerio';

export const prerender = false;

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
];

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 's-maxage=60'
};

const ENDPOINTS = ['https://duckduckgo.com/html/', 'https://html.duckduckgo.com/html/'];
const CACHE_TTL_MS = 5 * 60 * 1000;

type SearchResult = {
  title: string;
  link: string;
  snippet: string;
};

type CacheValue = {
  results: SearchResult[];
  createdAt: number;
};

const globalWithCache = globalThis as typeof globalThis & { __SEARCH_CACHE__?: Map<string, CacheValue> };
const cache: Map<string, CacheValue> = globalWithCache.__SEARCH_CACHE__ || new Map<string, CacheValue>();
if (!globalWithCache.__SEARCH_CACHE__) {
  globalWithCache.__SEARCH_CACHE__ = cache;
}

const pickUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

const normalizeLink = (rawLink: string) => {
  if (!rawLink) return '';
  try {
    const parsed = new URL(rawLink, 'https://duckduckgo.com');
    const redirected = parsed.searchParams.get('uddg');
    return redirected ? decodeURIComponent(redirected) : rawLink;
  } catch {
    return rawLink;
  }
};

const looksBlocked = (html: string) =>
  /captcha/i.test(html) || /unusual traffic/i.test(html) || /detected unusual/i.test(html);

const parseResults = (html: string): SearchResult[] => {
  const $ = load(html);

  return $('.result')
    .map((_, el) => {
      const title = $(el).find('.result__a').text().trim();
      const link = normalizeLink($(el).find('.result__a').attr('href') || '');
      const snippet =
        $(el).find('.result__snippet').text().trim() || $(el).find('.result__url').text().trim() || '';

      return { title, link, snippet };
    })
    .get()
    .filter((item) => item.title && item.link)
    .slice(0, 10);
};

const searchUpstream = async (query: string) => {
  const userAgent = pickUserAgent();

  for (const endpoint of ENDPOINTS) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': userAgent,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7',
        Referer: 'https://duckduckgo.com/',
        Origin: 'https://duckduckgo.com',
        'Cache-Control': 'no-cache'
      },
      body: new URLSearchParams({ q: query })
    });

    if (!response.ok) {
      continue;
    }

    const html = await response.text();
    const parsed = parseResults(html);

    if (parsed.length) {
      return { results: parsed, blocked: false };
    }

    if (looksBlocked(html)) {
      return { results: [], blocked: true };
    }
  }

  return { results: [], blocked: false };
};

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query parameter "q"' }), {
      status: 400,
      headers
    });
  }

  try {
    const trimmedQuery = query.trim();
    const cached = cache.get(trimmedQuery.toLowerCase());
    const isFresh = cached && Date.now() - cached.createdAt < CACHE_TTL_MS;

    if (cached && isFresh) {
      return new Response(JSON.stringify({ query, results: cached.results }), {
        status: 200,
        headers: { ...headers, 'X-Search-Cache': 'HIT' }
      });
    }

    const { results, blocked } = await searchUpstream(trimmedQuery);

    if (results.length) {
      cache.set(trimmedQuery.toLowerCase(), { results, createdAt: Date.now() });
      return new Response(JSON.stringify({ query, results }), {
        status: 200,
        headers: { ...headers, 'X-Search-Cache': 'MISS' }
      });
    }

    if (blocked) {
      return new Response(JSON.stringify({ error: 'DuckDuckGo bloqueó la solicitud' }), {
        status: 429,
        headers
      });
    }

    return new Response(JSON.stringify({ error: 'Search upstream returned no results' }), {
      status: 502,
      headers
    });
  } catch (error) {
    console.error('Search API error', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch search results' }), {
      status: 500,
      headers
    });
  }
};
