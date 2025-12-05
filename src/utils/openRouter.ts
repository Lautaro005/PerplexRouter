import type { Message, SearchResult } from '../types/chat';

const withOrigin = () =>
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'https://astro-app.local';

const isChatRole = (role: Message['role']): role is 'user' | 'assistant' =>
  role === 'user' || role === 'assistant';

export const callOpenRouter = async (
  messages: Message[],
  modelId: string,
  apiKey: string,
  searchResults?: SearchResult[]
): Promise<string> => {
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const sanitizedMessages = messages
    .filter((m): m is Message & { role: 'user' | 'assistant' } => isChatRole(m.role))
    .map((m) => ({ role: m.role, content: m.content }));

  const searchContext =
    searchResults && searchResults.length
      ? [
          {
            role: 'user',
            content: `Resultados de búsqueda web recientes:\n${searchResults
              .map(
                (result, idx) =>
                  `${idx + 1}. ${result.title}\nURL: ${result.link}\nResumen: ${result.snippet}`
              )
              .join(
                '\n\n'
              )}\nUtiliza estas fuentes para mejorar tu respuesta y cita las URLs cuando sea útil.`
          } as const
        ]
      : [];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': withOrigin(),
      'X-Title': 'Perplexity Clone'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [...sanitizedMessages, ...searchContext]
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'API Error');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};
