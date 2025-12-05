import type { ModelOption } from '../types/chat';

export const DEFAULT_MODELS: ModelOption[] = [
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
  { id: 'google/gemini-pro', name: 'Gemini Pro' }
];
