import { Library, Plus, Search, Settings, X } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ChatHistoryItem, Theme, ViewState } from '../types/chat';
import type { Translator } from '../constants/translations';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  history: ChatHistoryItem[];
  openSettings: () => void;
  onLibraryClick: () => void;
  onHomeClick: () => void;
  onLoadChat: (item: ChatHistoryItem) => void;
  currentView: ViewState;
  theme: Theme;
  t: Translator;
}

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  theme: Theme;
}

const NavItem = ({ icon, label, active, onClick, theme }: NavItemProps) => {
  const activeClass =
    theme === 'dark'
      ? 'bg-[#2d2d2d] text-[#e8e8e6]'
      : 'bg-gray-200 text-black';
  const inactiveClass =
    theme === 'dark'
      ? 'text-gray-400 hover:bg-white/5 hover:text-[#e8e8e6]'
      : 'text-gray-600 hover:bg-black/5 hover:text-black';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active ? activeClass : inactiveClass}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const Sidebar = ({
  isOpen,
  toggle,
  history,
  openSettings,
  onLibraryClick,
  onHomeClick,
  onLoadChat,
  currentView,
  theme,
  t
}: SidebarProps) => {
  const recentHistory = history.slice(0, 5);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 border-r transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${theme === 'dark' ? 'bg-[#191919] border-[#2d2d2d]' : 'bg-[#f7f7f7] border-gray-200'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:border-none md:overflow-hidden'}`}
    >
      <div
        className={`flex flex-col h-full p-4 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
            <div className="w-8 h-8 bg-[#2dd4bf] rounded-full flex items-center justify-center text-black font-bold text-xl font-serif">
              P
            </div>
            <span
              className={`font-semibold text-xl tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              PerplexRouter
            </span>
          </div>
          <button onClick={toggle} className="md:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <button
          onClick={onHomeClick}
          className={`flex items-center gap-3 border text-sm font-medium py-3 px-4 rounded-full transition-all group mb-6
            ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-800 shadow-sm'}`}
        >
          <Plus
            size={18}
            className="text-[#2dd4bf] group-hover:rotate-90 transition-transform"
          />
          <span>{t('newThread')}</span>
          <div
            className={`ml-auto text-xs border px-1.5 rounded ${
              theme === 'dark'
                ? 'text-gray-500 border-gray-500/30'
                : 'text-gray-400 border-gray-200'
            }`}
          >
            Ctrl I
          </div>
        </button>

        <nav className="space-y-1 mb-6">
          <NavItem
            icon={<Search size={18} />}
            label={t('home')}
            active={currentView === 'home'}
            onClick={onHomeClick}
            theme={theme}
          />
          <NavItem
            icon={<Library size={18} />}
            label={t('library')}
            active={currentView === 'library'}
            onClick={onLibraryClick}
            theme={theme}
          />
        </nav>

        <div className="flex-1 overflow-y-auto pr-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            {t('recents')}
          </h3>
          <div className="space-y-1">
            {recentHistory.length === 0 && (
              <div className="px-3 text-sm text-gray-500 italic">{t('noHistory')}</div>
            )}
            {recentHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => onLoadChat(item)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors
                  ${theme === 'dark' ? 'text-gray-400 hover:text-[#e8e8e6] hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`pt-4 mt-4 border-t ${
            theme === 'dark' ? 'border-[#2d2d2d]' : 'border-gray-200'
          }`}
        >
          <button
            onClick={openSettings}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors
              ${theme === 'dark' ? 'text-gray-400 hover:text-[#e8e8e6] hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/5'}`}
          >
            <Settings size={18} />
            <span>{t('settings')}</span>
          </button>

          <div className="mt-2 flex items-center justify-between px-3">
            <span className="text-xs text-gray-500">x: <a href="https://x.com/nosoylauti/">@nosoylauti</a></span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
