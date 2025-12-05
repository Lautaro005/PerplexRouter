import type { APIRoute } from 'astro';
import { load } from 'cheerio';

export const prerender = false;

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const headers = {
  'Content-Type': 'application/json',
  'Cache-Control': 's-maxage=60'
};

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

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Missing query parameter "q"' }), {
      status: 400,
      headers
    });
  }

  try {
    const response = await fetch('https://html.duckduckgo.com/html/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': USER_AGENT
      },
      body: new URLSearchParams({ q: query })
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Search upstream failed with status ${response.status}` }),
        { status: 502, headers }
      );
    }

    const html = await response.text();
    const $ = load(html);

    const results = $('.result')
      .map((_, el) => {
        const title = $(el).find('.result__a').text().trim();
        const link = normalizeLink($(el).find('.result__a').attr('href') || '');
        const snippet =
          $(el).find('.result__snippet').text().trim() ||
          $(el).find('.result__url').text().trim() ||
          '';

        return { title, link, snippet };
      })
      .get()
      .filter((item) => item.title && item.link)
      .slice(0, 10);

    return new Response(JSON.stringify({ query, results }), { status: 200, headers });
  } catch (error) {
    console.error('Search API error', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch search results' }), {
      status: 500,
      headers
    });
  }
};
