import { useEffect, useRef, useState } from 'react';
import {
  CornerDownLeft,
  MoreVertical,
  Pencil,
  Trash2,
  Cpu,
  Globe2,
  Mic,
  MicOff,
  ArrowRight,
  Zap
} from 'lucide-react';
import type { ChatHistoryItem, Project, Theme, ModelOption, Language } from '../types/chat';
import type { Translator } from '../constants/translations';

interface ProjectDetailProps {
  project: Project;
  theme: Theme;
  t: Translator;
  models: ModelOption[];
  selectedModel: ModelOption;
  setSelectedModel: (model: ModelOption) => void;
  webSearchEnabled: boolean;
  onToggleWebSearch: () => void;
  language: Language;
  onBack: () => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
  onAddChat: (projectId: number, text: string) => void;
  onDeleteChat: (chatId: number) => void;
  onOpenChat: (chat: ChatHistoryItem) => void;
}

const ProjectDetail = ({
  project,
  theme,
  t,
  models,
  selectedModel,
  setSelectedModel,
  webSearchEnabled,
  onToggleWebSearch,
  language,
  onBack,
  onEdit,
  onDelete,
  onAddChat,
  onDeleteChat,
  onOpenChat
}: ProjectDetailProps) => {
  const [question, setQuestion] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModelMenuOpen, setModelMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const followUpRef = useRef<HTMLTextAreaElement | null>(null);

  const textColor = theme === 'dark' ? 'text-[#e8e8e6]' : 'text-gray-900';
  const cardBg =
    theme === 'dark'
      ? 'bg-white/5 border-white/10 hover:border-[#2dd4bf]/40'
      : 'bg-white border-gray-200 hover:border-[#0f766e]/30';

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== 'undefined'
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'es' ? 'es-ES' : 'en-US';
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');
      setQuestion((prev) => `${prev} ${transcript}`.trim());
    };
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      recognition.stop();
      recognitionRef.current = null;
      setIsListening(false);
    };
  }, [language]);

  const adjustHeight = () => {
    const el = followUpRef.current;
    if (!el) return;
    const maxHeight = 8 * 24;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    adjustHeight();
  }, [question]);

  const toggleDictation = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    recognitionRef.current.lang = language === 'es' ? 'es-ES' : 'en-US';
    try {
      recognitionRef.current.start();
    } catch {
      recognitionRef.current.stop();
      recognitionRef.current.start();
    }
  };

  const submitQuestion = () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    onAddChat(project.id, trimmed);
    setQuestion('');
  };

  const cleanPreview = (text: string) =>
    text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`#>~\-]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const renderChat = (chat: ChatHistoryItem) => (
    <div
      key={chat.id}
      role="button"
      tabIndex={0}
      onClick={() => onOpenChat(chat)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpenChat(chat);
      }}
      className={`group rounded-lg border p-3 ${cardBg} transition-all cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/60`}
    >
      <div className="font-semibold text-base mb-1 line-clamp-2 pr-8">{chat.title}</div>
      <p className="text-sm text-gray-500 line-clamp-2 pr-8">{cleanPreview(chat.preview)}</p>
      <div className="mt-2 text-xs text-gray-500">{chat.date}</div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDeleteChat(chat.id);
        }}
        className="absolute top-2 right-2 p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-colors"
        title={t('delete')}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <button
          onClick={onBack}
          className={`text-sm flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
          }`}
        >
          <CornerDownLeft size={14} /> {t('backToHome')}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-white/10'
                : 'text-gray-700 hover:bg-black/5'
            }`}
          >
            <MoreVertical size={18} />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10 bg-transparent"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                onClick={() => setMenuOpen(false)}
                aria-hidden="true"
              />
              <div
                className={`absolute right-0 mt-2 z-20 rounded-lg border shadow-lg w-36 ${
                  theme === 'dark'
                    ? 'bg-[#1f1f1f] border-[#2d2d2d] text-gray-200'
                    : 'bg-white border-gray-200 text-gray-800'
                }`}
              >
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                  onClick={() => {
                    onEdit(project);
                    setMenuOpen(false);
                  }}
                >
                  <Pencil size={14} />
                  {t('edit')}
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                  onClick={() => {
                    onDelete(project.id);
                    setMenuOpen(false);
                  }}
                >
                  <Trash2 size={14} />
                  {t('delete')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-3xl">{project.icon || '📁'}</div>
        <div>
          <h2 className={`text-2xl font-semibold ${textColor}`}>{project.title}</h2>
          {project.aiPrompt && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{project.aiPrompt}</p>
          )}
        </div>
      </div>

      <div
        className={`rounded-2xl border shadow-sm p-3 ${
          theme === 'dark'
            ? 'bg-[#1f1f1f] border-[#2d2d2d]'
            : 'bg-white border-gray-200'
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitQuestion();
          }}
          className="flex flex-col gap-3"
        >
          <textarea
            ref={followUpRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitQuestion();
              }
            }}
            placeholder={t('projectAskPlaceholder')}
            className={`w-full bg-transparent px-4 py-2 outline-none resize-none min-h-[60px] max-h-[200px] overflow-y-auto leading-relaxed ${
              theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-500'
            }`}
            rows={2}
          />
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setModelMenuOpen((prev) => !prev)}
                  className={`p-2 rounded-full transition-colors ${
                    isModelMenuOpen ? 'bg-[#2dd4bf]/20 text-[#2dd4bf]' : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/5'
                  }`}
                  title={`${t('aiModel')}: ${selectedModel.name}`}
                >
                  <Cpu size={18} />
                </button>

                {isModelMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10 bg-transparent"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                      onClick={() => setModelMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      className={`absolute bottom-full left-0 mb-2 w-56 border rounded-lg shadow-xl z-20 py-1 overflow-hidden ${
                        theme === 'dark' ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="px-3 py-2 text-xs font-bold text-gray-500 border-b border-gray-500/20">
                        {t('availableModels')}
                      </div>
                      {models.map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model);
                            setModelMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
                            theme === 'dark' ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-100'
                          } ${
                            selectedModel.id === model.id
                              ? 'text-[#2dd4bf]'
                              : theme === 'dark'
                                ? 'text-gray-300'
                                : 'text-gray-800'
                          }`}
                        >
                          <span className="truncate">{model.name}</span>
                          {selectedModel.id === model.id && <Zap size={12} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={onToggleWebSearch}
                className={`p-2 rounded-full transition-colors ${
                  webSearchEnabled ? 'bg-[#2dd4bf]/20 text-[#2dd4bf]' : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/5'
                }`}
                title={webSearchEnabled ? t('webSearchOn') : t('webSearchOff')}
              >
                <Globe2 size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={toggleDictation}
                disabled={!speechSupported}
                className={`p-2 rounded-full transition-colors ${
                  !speechSupported
                    ? 'text-gray-500/50 cursor-not-allowed'
                    : isListening
                      ? 'bg-[#2dd4bf]/20 text-[#2dd4bf]'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                        : 'text-gray-600 hover:text-black hover:bg-black/5'
                }`}
                title={speechSupported ? t('dictation') : t('dictationUnavailable')}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="submit"
                className={`p-2 rounded-full transition-all ${
                  question.trim() ? 'bg-[#2dd4bf] text-black' : 'bg-gray-500/20 text-gray-500'
                }`}
                title={t('projectAskPlaceholder')}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className={`text-sm font-semibold uppercase tracking-wide ${textColor}`}>
          {t('projectChats')}
        </h3>
        <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
          {project.chats.length === 0 ? (
            <div className="text-sm text-gray-500">{t('noHistory')}</div>
          ) : (
            project.chats.map(renderChat)
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
