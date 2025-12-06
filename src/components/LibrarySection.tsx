import { Clock, Library, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState, type MouseEvent } from 'react';
import type { ChatHistoryItem, Theme } from '../types/chat';
import type { Translator } from '../constants/translations';

interface LibrarySectionProps {
  history: ChatHistoryItem[];
  onLoadChat: (item: ChatHistoryItem) => void;
  onDelete: (id: number, e?: MouseEvent<HTMLButtonElement>) => void;
  onDeleteAll: () => void;
  onStartNew: () => void;
  onBack: () => void;
  t: Translator;
  theme: Theme;
}

const LibrarySection = ({
  history,
  onLoadChat,
  onDelete,
  onDeleteAll,
  onStartNew,
  onBack,
  t,
  theme
}: LibrarySectionProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const textColor = theme === 'dark' ? 'text-[#e8e8e6]' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg =
    theme === 'dark'
      ? 'bg-white/5 hover:bg-white/10'
      : 'bg-white border border-gray-200 hover:border-[#2dd4bf]/50 hover:shadow-md';

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.preview.toLowerCase().includes(q)
    );
  }, [history, searchQuery]);

  const handleDeleteAll = () => {
    const confirmed = window.confirm(t('confirmDeleteAll'));
    if (confirmed) {
      onDeleteAll();
      setShowSearch(false);
    }
  };

  const openSearch = () => {
    setShowSearch(true);
    setSearchQuery('');
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in w-full">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#2dd4bf]/10 rounded-xl">
            <Library className="text-[#2dd4bf]" size={32} />
          </div>
          <h1 className={`text-3xl font-serif ${textColor}`}>{t('libraryTitle')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openSearch}
            className={`p-2 rounded-full border transition-colors ${
              theme === 'dark'
                ? 'border-[#2dd4bf]/30 text-[#2dd4bf] hover:bg-white/5'
                : 'border-[#2dd4bf]/40 text-[#2dd4bf] hover:bg-[#2dd4bf]/10'
            }`}
            title={t('searchChats')}
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => {
              onStartNew();
              setShowSearch(false);
              setSearchQuery('');
            }}
            className={`p-2 rounded-full border transition-colors ${
              theme === 'dark'
                ? 'border-[#2dd4bf]/20 text-[#2dd4bf] hover:bg-white/5'
                : 'border-[#2dd4bf]/30 text-[#0f766e] hover:bg-[#2dd4bf]/10'
            }`}
            title={t('startNewThread')}
          >
            <Plus size={18} />
          </button>
          <button
            onClick={handleDeleteAll}
            className={`p-2 rounded-full border transition-colors ${
              theme === 'dark'
                ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
                : 'border-red-200 text-red-500 hover:bg-red-50'
            }`}
            title={t('deleteAllChats')}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {history.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>{t('libraryEmpty')}</p>
            <button onClick={onBack} className="text-[#2dd4bf] mt-2 hover:underline">
              {t('startNewThread')}
            </button>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onLoadChat(item)}
              className={`group relative p-5 rounded-xl border border-transparent transition-all cursor-pointer ${cardBg}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3
                  className={`font-semibold text-lg pr-8 group-hover:text-[#2dd4bf] transition-colors ${textColor}`}
                >
                  {item.title}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                  <Clock size={12} /> {item.date}
                </span>
              </div>
              <p className={`text-sm line-clamp-2 ${subTextColor}`}>{item.preview}</p>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => onDelete(item.id, e)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div
            className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${
              theme === 'dark' ? 'bg-[#1d1d1d] border-[#2d2d2d]' : 'bg-white border-gray-200'
            }`}
          >
            <div
              className={`flex items-center gap-3 px-4 py-3 border-b ${
                theme === 'dark' ? 'border-[#2d2d2d]' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 bg-black/5 dark:bg-white/5 rounded-full px-3 py-2">
                <Search size={16} className="text-gray-500" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchChatsPlaceholder')}
                  className={`flex-1 bg-transparent outline-none text-sm ${
                    theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              <button
                onClick={closeSearch}
                className={`text-sm font-medium px-3 py-2 rounded-full transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-white/5'
                    : 'text-[#0f766e] hover:bg-[#2dd4bf]/15'
                }`}
              >
                {t('cancel')}
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-200 dark:divide-[#2d2d2d]">
              {filteredHistory.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">{t('noResults')}</div>
              ) : (
                filteredHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onLoadChat(item);
                      closeSearch();
                    }}
                    className={`w-full text-left px-5 py-4 transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-white/5'
                        : 'hover:bg-[#2dd4bf]/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className={`font-semibold text-base mb-1 ${textColor}`}>{item.title}</div>
                        <p className={`text-sm line-clamp-2 ${subTextColor}`}>{item.preview}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                        <Clock size={12} /> {item.date}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarySection;
