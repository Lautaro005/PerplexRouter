import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import ChatSection from './ChatSection';
import HeroSection from './HeroSection';
import LibrarySection from './LibrarySection';
import SettingsModal from './SettingsModal';
import Sidebar from './Sidebar';
import { DEFAULT_MODELS } from '../constants/models';
import { createTranslator } from '../constants/translations';
import { callOpenRouter } from '../utils/openRouter';
import { fetchSearchResults } from '../utils/webSearch';
import type {
  ChatHistoryItem,
  Language,
  Message,
  ModelOption,
  SearchResult,
  Theme,
  ViewState
} from '../types/chat';
import { Menu, X } from 'lucide-react';

const isBrowser = typeof window !== 'undefined';

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('home');

  const [apiKey, setApiKey] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [customModels, setCustomModels] = useState<ModelOption[]>(DEFAULT_MODELS);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(DEFAULT_MODELS[0]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [showWebSearchInfo, setShowWebSearchInfo] = useState(false);

  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('es');

  const t = useMemo(() => createTranslator(language), [language]);

  useEffect(() => {
    if (!isBrowser) return;
    const storedKey = localStorage.getItem('openrouter_key');
    const storedHistory = localStorage.getItem('chat_history');
    const storedModels = localStorage.getItem('custom_models');
    const storedWebSearch = localStorage.getItem('web_search_enabled');
    const storedSystemPrompt = localStorage.getItem('system_prompt');

    if (storedKey) setApiKey(storedKey);
    if (storedSystemPrompt) setSystemPrompt(storedSystemPrompt);
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch {
        setHistory([]);
      }
    }
    if (storedModels) {
      try {
        const parsed = JSON.parse(storedModels);
        if (Array.isArray(parsed) && parsed.length) {
          setCustomModels(parsed);
          setSelectedModel(parsed[0]);
        }
      } catch {
        setCustomModels(DEFAULT_MODELS);
        setSelectedModel(DEFAULT_MODELS[0]);
      }
    }
    if (storedWebSearch) {
      setWebSearchEnabled(storedWebSearch === 'true');
    }
  }, []);

  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem('openrouter_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem('system_prompt', systemPrompt);
  }, [systemPrompt]);

  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem('chat_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem('custom_models', JSON.stringify(customModels));
  }, [customModels]);

  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem('web_search_enabled', String(webSearchEnabled));
  }, [webSearchEnabled]);

  useEffect(() => {
    if (!customModels.length) {
      setSelectedModel(DEFAULT_MODELS[0]);
      return;
    }
    if (!customModels.some((model) => model.id === selectedModel.id)) {
      setSelectedModel(customModels[0]);
    }
  }, [customModels, selectedModel.id]);

  useEffect(() => {
    if (!isBrowser) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const currentModel = selectedModel || customModels[0] || DEFAULT_MODELS[0];
  const formatDate = () =>
    new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

  const updateHistoryMessages = (chatId: number, messages: Message[]) => {
    setHistory((prev) => prev.map((h) => (h.id === chatId ? { ...h, messages } : h)));
  };

  const handleInitialSearch = async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const initialMsg: Message = { role: 'user', content: trimmedQuery };
    let visibleMessages: Message[] = [initialMsg];
    const newChatId = Date.now();

    setActiveChatId(newChatId);
    setCurrentMessages(visibleMessages);
    setViewState('chat');
    setIsTyping(true);

    const newEntry: ChatHistoryItem = {
      id: newChatId,
      title: trimmedQuery,
      date: formatDate(),
      preview: '...',
      messages: visibleMessages
    };
    setHistory((prev) => [newEntry, ...prev]);

    let searchResults: SearchResult[] | undefined;

    if (webSearchEnabled) {
      try {
        searchResults = await fetchSearchResults(trimmedQuery);
        if (searchResults.length) {
          const sourcesMsg: Message = { role: 'sources', content: t('sources'), sources: searchResults };
          visibleMessages = [...visibleMessages, sourcesMsg];
          setCurrentMessages(visibleMessages);
          updateHistoryMessages(newChatId, visibleMessages);
        }
      } catch {
        const searchError: Message = { role: 'error', content: t('webSearchError') };
        visibleMessages = [...visibleMessages, searchError];
        setCurrentMessages(visibleMessages);
        updateHistoryMessages(newChatId, visibleMessages);
      }
    }

    try {
      const reply = await callOpenRouter(visibleMessages, currentModel.id, apiKey, systemPrompt, searchResults);
      const assistantMsg: Message = { role: 'assistant', content: reply };
      const updatedMessages = [...visibleMessages, assistantMsg];

      setCurrentMessages(updatedMessages);
      setHistory((prev) =>
        prev.map((h) =>
          h.id === newChatId
            ? { ...h, preview: `${reply.substring(0, 100)}...`, messages: updatedMessages }
            : h
        )
      );
    } catch (error) {
      const errorMsg =
        error instanceof Error && error.message === 'NO_API_KEY'
          ? t('errorNoKey')
          : `${t('errorApi')} (${error instanceof Error ? error.message : 'Unknown error'})`;
      const errorMsgObj: Message = { role: 'error', content: errorMsg };

      const finalMessages = [...visibleMessages, errorMsgObj];
      setCurrentMessages(finalMessages);
      updateHistoryMessages(newChatId, finalMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFollowUp = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !activeChatId) return;

    const userMsg: Message = { role: 'user', content: trimmed };
    let visibleMessages = [...currentMessages, userMsg];

    setCurrentMessages(visibleMessages);
    setIsTyping(true);
    updateHistoryMessages(activeChatId, visibleMessages);

    let searchResults: SearchResult[] | undefined;

    if (webSearchEnabled) {
      try {
        searchResults = await fetchSearchResults(trimmed);
        if (searchResults.length) {
          const sourcesMsg: Message = { role: 'sources', content: t('sources'), sources: searchResults };
          visibleMessages = [...visibleMessages, sourcesMsg];
          setCurrentMessages(visibleMessages);
          updateHistoryMessages(activeChatId, visibleMessages);
        }
      } catch {
        const searchError: Message = { role: 'error', content: t('webSearchError') };
        visibleMessages = [...visibleMessages, searchError];
        setCurrentMessages(visibleMessages);
        updateHistoryMessages(activeChatId, visibleMessages);
      }
    }

    try {
      const reply = await callOpenRouter(visibleMessages, currentModel.id, apiKey, systemPrompt, searchResults);
      const finalMessages = [...visibleMessages, { role: 'assistant', content: reply } as Message];

      setCurrentMessages(finalMessages);
      setHistory((prev) =>
        prev.map((h) =>
          h.id === activeChatId
            ? { ...h, messages: finalMessages, preview: `${reply.substring(0, 100)}...` }
            : h
        )
      );
    } catch (error) {
      const errorMsg =
        error instanceof Error && error.message === 'NO_API_KEY'
          ? t('errorNoKey')
          : `${t('errorApi')} (${error instanceof Error ? error.message : 'Unknown error'})`;
      const errorMsgObj: Message = { role: 'error', content: errorMsg };

      const finalMessages = [...visibleMessages, errorMsgObj];
      setCurrentMessages(finalMessages);
      updateHistoryMessages(activeChatId, finalMessages);
    } finally {
      setIsTyping(false);
    }
  };

  const loadChat = (chatItem: ChatHistoryItem) => {
    setActiveChatId(chatItem.id);
    const messages = chatItem.messages?.length
      ? chatItem.messages
      : [{ role: 'user', content: chatItem.title } as Message];
    setCurrentMessages(messages);
    setViewState('chat');

    if (isBrowser && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteHistoryItem = (id: number, e?: MouseEvent<HTMLButtonElement>) => {
    if (e) e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeChatId === id) {
      goToHome();
    }
  };

  const handleDeleteAllHistory = () => {
    setHistory([]);
    setActiveChatId(null);
    setCurrentMessages([]);
    setViewState('library');
  };

  const handleStartNewFromLibrary = () => {
    goToHome();
  };

  const handleAddModel = (newModel: ModelOption) => {
    setCustomModels((prev) => {
      if (prev.some((model) => model.id === newModel.id)) return prev;
      return [...prev, newModel];
    });
  };

  const handleDeleteModel = (id: string) => {
    setCustomModels((prev) => prev.filter((model) => model.id !== id));
  };

  const handleReorderModel = (index: number, direction: 'up' | 'down') => {
    setCustomModels((prev) => {
      const updated = [...prev];
      if (direction === 'up' && index > 0) {
        [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      } else if (direction === 'down' && index < updated.length - 1) {
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      }
      return updated;
    });
  };

  const goToHome = () => {
    setViewState('home');
    setCurrentMessages([]);
    setActiveChatId(null);
  };

  const handleToggleWebSearch = () => {
    setWebSearchEnabled((prev) => {
      const next = !prev;
      if (next) setShowWebSearchInfo(true);
      return next;
    });
  };

  const renderContent = () => {
    switch (viewState) {
      case 'home':
        return (
          <HeroSection
            onSearch={handleInitialSearch}
            models={customModels}
            selectedModel={currentModel}
            setSelectedModel={setSelectedModel}
            webSearchEnabled={webSearchEnabled}
            onToggleWebSearch={handleToggleWebSearch}
            t={t}
            theme={theme}
          />
        );
      case 'chat':
        return (
          <ChatSection
            messages={currentMessages}
            isTyping={isTyping}
            selectedModel={currentModel}
            webSearchEnabled={webSearchEnabled}
            onToggleWebSearch={handleToggleWebSearch}
            onBack={goToHome}
            onFollowUp={handleFollowUp}
            t={t}
            theme={theme}
          />
        );
      case 'library':
        return (
          <LibrarySection
            history={history}
            onLoadChat={loadChat}
            onDelete={handleDeleteHistoryItem}
            onDeleteAll={handleDeleteAllHistory}
            onStartNew={handleStartNewFromLibrary}
            onBack={goToHome}
            t={t}
            theme={theme}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#191919] text-[#e8e8e6] selection:bg-[#2dd4bf] selection:text-black'
          : 'bg-[#f0f0f0] text-[#191919] selection:bg-[#2dd4bf] selection:text-white'
      }`}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setSidebarOpen(!isSidebarOpen)}
        history={history}
        openSettings={() => setShowSettings(true)}
        onLibraryClick={() => setViewState('library')}
        onHomeClick={goToHome}
        onLoadChat={loadChat}
        currentView={viewState}
        theme={theme}
        t={t}
      />

      <main
        className={`flex-1 flex flex-col relative transition-all duration-300 ${
          isSidebarOpen ? 'ml-0 md:ml-0' : 'ml-0'
        }`}
      >
        <div
          className={`sticky top-0 z-20 flex items-center justify-between p-4 md:hidden ${
            theme === 'dark' ? 'bg-[#191919]' : 'bg-[#f0f0f0]'
          }`}
        >
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-md ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
            }`}
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-lg tracking-tight">
            Perplexity<span className="text-[#2dd4bf]">.clone</span>
          </span>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {renderContent()}
        </div>
      </main>

      {showSettings && (
        <SettingsModal
          close={() => setShowSettings(false)}
          apiKey={apiKey}
          setApiKey={setApiKey}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          models={customModels}
          addModel={handleAddModel}
          deleteModel={handleDeleteModel}
          reorderModel={handleReorderModel}
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
          t={t}
        />
      )}

      {showWebSearchInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-2xl rounded-2xl shadow-2xl border p-6 space-y-4 ${
              theme === 'dark'
                ? 'bg-[#1f1f1f] border-[#2d2d2d] text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">{t('webSearchInfoTitle')}</h3>
                <div className="mt-3 space-y-3 text-sm leading-6">
                  {t('webSearchInfoBody')
                    .split('\n\n')
                    .map((paragraph, idx) => (
                      <p key={idx} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {paragraph.includes('https://github.com/Lautaro005/PerplexRouter') ? (
                          <>
                            {paragraph.split('https://github.com/Lautaro005/PerplexRouter')[0]}
                            <a
                              className="text-[#2dd4bf] underline break-all"
                              href="https://github.com/Lautaro005/PerplexRouter"
                              target="_blank"
                              rel="noreferrer"
                            >
                              https://github.com/Lautaro005/PerplexRouter
                            </a>
                            {paragraph.split('https://github.com/Lautaro005/PerplexRouter')[1]}
                          </>
                        ) : (
                          paragraph
                        )}
                      </p>
                    ))}
                </div>
              </div>
              <button
                onClick={() => setShowWebSearchInfo(false)}
                className={`p-2 rounded-full ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
                aria-label={t('cancel')}
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowWebSearchInfo(false)}
                className="px-4 py-2 rounded-lg bg-[#2dd4bf] text-black font-medium hover:bg-[#25b5a3] transition-colors text-sm"
              >
                {t('webSearchInfoOk')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
