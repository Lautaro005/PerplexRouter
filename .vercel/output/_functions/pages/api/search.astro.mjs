import { load } from 'cheerio';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
];
const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "s-maxage=60"
};
const UPSTREAMS = [
  { url: "https://duckduckgo.com/html/", method: "POST" },
  { url: "https://html.duckduckgo.com/html/", method: "POST" },
  { url: "https://duckduckgo.com/html/", method: "GET" },
  { url: "https://html.duckduckgo.com/html/", method: "GET" },
  { url: "https://lite.duckduckgo.com/lite/", method: "GET" }
];
const CACHE_TTL_MS = 5 * 60 * 1e3;
const globalWithCache = globalThis;
const cache = globalWithCache.__SEARCH_CACHE__ || /* @__PURE__ */ new Map();
if (!globalWithCache.__SEARCH_CACHE__) {
  globalWithCache.__SEARCH_CACHE__ = cache;
}
const pickUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
const normalizeLink = (rawLink) => {
  if (!rawLink) return "";
  try {
    const parsed = new URL(rawLink, "https://duckduckgo.com");
    const redirected = parsed.searchParams.get("uddg");
    return redirected ? decodeURIComponent(redirected) : rawLink;
  } catch {
    return rawLink;
  }
};
const looksBlocked = (html, status) => {
  if (status === 403 || status === 429) return true;
  const lower = html.toLowerCase();
  return lower.includes("captcha") || lower.includes("unusual traffic") || lower.includes("detected unusual") || lower.includes("access denied") || lower.includes("forbidden") || lower.includes("rate limit") || lower.includes("unusual activity") || lower.includes("verify you are human") || lower.includes("blocked request");
};
const parseResults = (html) => {
  const $ = load(html);
  const seen = /* @__PURE__ */ new Set();
  const results = [];
  const pushResult = (title, link, snippet) => {
    const normalizedLink = normalizeLink(link);
    if (!title || !normalizedLink || seen.has(normalizedLink)) return;
    seen.add(normalizedLink);
    results.push({ title, link: normalizedLink, snippet });
  };
  $(".result").each((_, el) => {
    const title = $(el).find(".result__a, a.result__a").text().trim();
    const link = $(el).find(".result__a, a.result__a").attr("href") || "";
    const snippet = $(el).find(".result__snippet, .result__desc, .result__url").text().trim() || "";
    pushResult(title, link, snippet);
  });
  if (!results.length) {
    $("a.result__a, a.result__url, a.result-link").each((_, el) => {
      const link = $(el).attr("href") || "";
      const title = $(el).text().trim();
      const snippet = $(el).closest(".result, .result-link, .web-result").find(".result__snippet, .result__desc").text().trim() || "";
      pushResult(title, link, snippet);
    });
  }
  if (!results.length) {
    $('a[href^="/l/?"], a[href*="uddg="]').each((_, el) => {
      const link = $(el).attr("href") || "";
      const title = $(el).text().trim();
      if (title.length < 3) return;
      pushResult(title, link, "");
    });
  }
  return results.slice(0, 10);
};
const searchUpstream = async (query) => {
  const userAgent = pickUserAgent();
  for (const { url, method } of UPSTREAMS) {
    const params = new URLSearchParams({ q: query });
    const targetUrl = method === "GET" ? `${url}?${params.toString()}` : url;
    const baseHeaders = {
      "User-Agent": userAgent,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7",
      Referer: "https://duckduckgo.com/",
      Origin: "https://duckduckgo.com",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      DNT: "1",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-User": "?1",
      "Sec-Fetch-Dest": "document"
    };
    const response = await fetch(targetUrl, {
      method,
      headers: method === "POST" ? { ...baseHeaders, "Content-Type": "application/x-www-form-urlencoded" } : baseHeaders,
      body: method === "POST" ? params : void 0
    });
    const html = await response.text();
    const blocked = looksBlocked(html, response.status);
    if (!response.ok && !blocked) {
      continue;
    }
    if (blocked) {
      return { results: [], blocked: true };
    }
    const parsed = parseResults(html);
    if (parsed.length) {
      return { results: parsed, blocked: false };
    }
  }
  return { results: [], blocked: false };
};
const GET = async ({ url }) => {
  const query = url.searchParams.get("q");
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
        headers: { ...headers, "X-Search-Cache": "HIT" }
      });
    }
    const { results, blocked } = await searchUpstream(trimmedQuery);
    if (results.length) {
      cache.set(trimmedQuery.toLowerCase(), { results, createdAt: Date.now() });
      return new Response(JSON.stringify({ query, results }), {
        status: 200,
        headers: { ...headers, "X-Search-Cache": "MISS" }
      });
    }
    if (blocked) {
      return new Response(JSON.stringify({ error: "DuckDuckGo bloqueó la solicitud" }), {
        status: 429,
        headers
      });
    }
    return new Response(JSON.stringify({ error: "Search upstream returned no results" }), {
      status: 502,
      headers
    });
  } catch (error) {
    console.error("Search API error", error);
    return new Response(JSON.stringify({ error: "Failed to fetch search results" }), {
      status: 500,
      headers
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
