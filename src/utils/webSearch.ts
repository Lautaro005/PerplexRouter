import type { SearchResult } from '../types/chat';

export const fetchSearchResults = async (query: string): Promise<SearchResult[]> => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);

  if (!response.ok) {
    throw new Error('SEARCH_FAILED');
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
};
