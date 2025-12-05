import { Clock, Library, Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { ChatHistoryItem, Theme } from '../types/chat';
import type { Translator } from '../constants/translations';

interface LibrarySectionProps {
  history: ChatHistoryItem[];
  onLoadChat: (item: ChatHistoryItem) => void;
  onDelete: (id: number, e?: MouseEvent<HTMLButtonElement>) => void;
  onBack: () => void;
  t: Translator;
  theme: Theme;
}

const LibrarySection = ({
  history,
  onLoadChat,
  onDelete,
  onBack,
  t,
  theme
}: LibrarySectionProps) => {
  const textColor = theme === 'dark' ? 'text-[#e8e8e6]' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg =
    theme === 'dark'
      ? 'bg-white/5 hover:bg-white/10'
      : 'bg-white border border-gray-200 hover:border-[#2dd4bf]/50 hover:shadow-md';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#2dd4bf]/10 rounded-xl">
          <Library className="text-[#2dd4bf]" size={32} />
        </div>
        <h1 className={`text-3xl font-serif ${textColor}`}>{t('libraryTitle')}</h1>
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
    </div>
  );
};

export default LibrarySection;
