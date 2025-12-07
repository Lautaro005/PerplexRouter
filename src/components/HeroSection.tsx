import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown, Cpu, Globe2, Zap, Mic, MicOff } from 'lucide-react';
import type { Language, ModelOption, Theme } from '../types/chat';
import type { Translator } from '../constants/translations';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  models: ModelOption[];
  selectedModel: ModelOption;
  setSelectedModel: (model: ModelOption) => void;
  webSearchEnabled: boolean;
  onToggleWebSearch: () => void;
  t: Translator;
  theme: Theme;
  language: Language;
}

const HeroSection = ({
  onSearch,
  models,
  selectedModel,
  setSelectedModel,
  webSearchEnabled,
  onToggleWebSearch,
  t,
  theme,
  language
}: HeroSectionProps) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    const maxHeight = 8 * 24; // limit to roughly 8 lines
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    adjustHeight();
  }, [query]);

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
      setQuery((prev) => `${prev} ${transcript}`.trim());
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

  const textColor = theme === 'dark' ? 'text-[#e8e8e6]' : 'text-gray-900';
  const textAreaBg =
    theme === 'dark'
      ? 'bg-[#202020] border-[#333] hover:border-[#444]'
      : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm';
  const dropdownBg =
    theme === 'dark' ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200';
  const dropdownItemHover = theme === 'dark' ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-100';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-3xl mx-auto w-full animate-fade-in">
      <h1 className={`text-4xl md:text-5xl font-serif italic mb-8 text-center opacity-90 ${textColor}`}>
        {t('whereKnowledgeBegins')}
      </h1>

      <div className="w-full relative group">
        <form
          onSubmit={handleSubmit}
          className={`relative z-10 border rounded-xl shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#2dd4bf]/20 ${textAreaBg}`}
        >
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSearch(query);
              }
            }}
            placeholder={t('askAnything')}
            className={`w-full bg-transparent placeholder-gray-500 text-lg p-5 pr-14 outline-none resize-none min-h-[60px] max-h-[320px] overflow-y-auto leading-relaxed ${textColor}`}
            rows={1}
          />

          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 text-xs font-medium bg-[#2d2d2d] hover:bg-[#333] px-3 py-1.5 rounded-full transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-[#2dd4bf]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Cpu size={14} />
                  <span className="max-w-[100px] truncate">{selectedModel.name}</span>
                  <ChevronDown size={12} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div
                      className={`absolute top-full left-0 mt-2 w-56 border rounded-lg shadow-xl z-20 py-1 overflow-hidden ${dropdownBg}`}
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
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${dropdownItemHover} ${
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
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  webSearchEnabled
                    ? 'bg-[#2dd4bf]/20 text-[#2dd4bf]'
                    : theme === 'dark'
                      ? 'bg-[#2d2d2d] text-gray-400 hover:text-[#2dd4bf]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white'
                }`}
                title={webSearchEnabled ? t('webSearchOn') : t('webSearchOff')}
              >
                <Globe2 size={14} />
                <span className="hidden sm:inline">{t('webSearch')}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
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
                  query.trim()
                    ? 'bg-[#2dd4bf] text-black hover:scale-105'
                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!query.trim()}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;
