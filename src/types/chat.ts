export type Role = 'user' | 'assistant' | 'error' | 'sources';

export interface ModelOption {
  id: string;
  name: string;
}

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export interface Message {
  role: Role;
  content: string;
  sources?: SearchResult[];
}

export interface ChatHistoryItem {
  id: number;
  title: string;
  date: string;
  preview: string;
  messages: Message[];
  projectId?: number;
}

export interface Project {
  id: number;
  title: string;
  icon: string;
  aiPrompt: string;
  chats: ChatHistoryItem[];
}

export type ViewState = 'home' | 'chat' | 'library' | 'projects' | 'projectDetail';
export type Theme = 'dark' | 'light';
export type Language = 'es' | 'en';
