import { useEffect, useRef, useState, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import {
  AlertTriangle,
  ArrowRight,
  CornerDownLeft,
  Cpu,
  ExternalLink,
  Globe2,
  Mic,
  MicOff,
  Zap
} from 'lucide-react';
import type { Language, Message, ModelOption, Theme } from '../types/chat';
import type { Translator } from '../constants/translations';

interface ChatSectionProps {
  messages: Message[];
  isTyping: boolean;
  selectedModel: ModelOption;
  models: ModelOption[];
  setSelectedModel: (model: ModelOption) => void;
  webSearchEnabled: boolean;
  onToggleWebSearch: () => void;
  onBack: () => void;
  onFollowUp: (text: string) => void;
  t: Translator;
  theme: Theme;
  language: Language;
}

const ChatSection = ({
  messages,
  isTyping,
  selectedModel,
  models,
  setSelectedModel,
  webSearchEnabled,
  onToggleWebSearch,
  onBack,
  onFollowUp,
  t,
  theme,
  language
}: ChatSectionProps) => {
  const [followUpText, setFollowUpText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isModelMenuOpen, setModelMenuOpen] = useState(false);
  const recognitionRef = useRef<any>(null);
  const followUpRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const hostnameFromLink = (link: string) => {
    try {
      return new URL(link).hostname.replace(/^www\./, '');
    } catch {
      return link;
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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
      setFollowUpText((prev) => `${prev} ${transcript}`.trim());
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

  const submitFollowUp = () => {
    if (!followUpText.trim() || isTyping) return;
    onFollowUp(followUpText);
    setFollowUpText('');
    if (followUpRef.current) {
      followUpRef.current.style.height = 'auto';
      followUpRef.current.style.overflowY = 'hidden';
    }
  };

  const handleSubmitFollowUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitFollowUp();
  };

  const adjustFollowUpHeight = () => {
    const el = followUpRef.current;
    if (!el) return;
    const maxHeight = 8 * 24; // roughly 8 lines
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  const textColor = theme === 'dark' ? 'text-[#e8e8e6]' : 'text-gray-900';
  const mutedTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const inputBg = theme === 'dark' ? 'bg-[#202020] border-[#333]' : 'bg-white border-gray-200 shadow-sm';
  const iconButtonBase =
    theme === 'dark'
      ? 'text-gray-400 hover:text-white hover:bg-white/5'
      : 'text-gray-600 hover:text-black hover:bg-black/5';
  const dropdownBg = theme === 'dark' ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200';
  const dropdownItemHover = theme === 'dark' ? 'hover:bg-[#2d2d2d]' : 'hover:bg-gray-100';

  useEffect(() => {
    adjustFollowUpHeight();
  }, [followUpText]);

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto px-4 w-full animate-fade-in relative">
      <div
        className={`sticky top-0 z-10 py-4 backdrop-blur-md flex justify-start items-center ${
          theme === 'dark' ? 'bg-[#191919]/80' : 'bg-[#f0f0f0]/80'
        }`}
      >
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-[#2dd4bf] flex items-center gap-2"
        >
          <CornerDownLeft size={14} /> {t('backToHome')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-32 space-y-8" ref={chatContainerRef}>
        {messages.map((msg, idx) =>
          msg.role === 'sources' ? (
            <div key={`sources-${idx}`} className="animate-slide-up space-y-3">
              <div className="flex items-center gap-2 text-[#2dd4bf] text-xs font-bold uppercase tracking-wider">
                <Zap size={16} /> {t('sources')}
              </div>
              <div
                className={`flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory ${
                  theme === 'dark' ? 'scrollbar-thumb-gray-700' : 'scrollbar-thumb-gray-300'
                }`}
              >
                {(msg.sources || []).map((source, sourceIdx) => (
                  <a
                    key={`${source.link}-${sourceIdx}`}
                    href={source.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`group min-w-[210px] max-w-[240px] snap-start border rounded-lg p-3 transition-all hover:-translate-y-0.5 ${
                      theme === 'dark'
                        ? 'border-[#2dd4bf]/20 bg-white/5 hover:border-[#2dd4bf]/40'
                        : 'border-gray-200 bg-white hover:border-[#2dd4bf]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs uppercase text-gray-500">
                      <span>#{sourceIdx + 1}</span>
                      <ExternalLink size={14} className="opacity-70 group-hover:opacity-100" />
                    </div>
                    <div className="font-semibold mt-1 text-sm line-clamp-2">{source.title}</div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3">{source.snippet}</p>
                    <div className="text-[11px] text-[#2dd4bf] mt-2">{hostnameFromLink(source.link)}</div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div
              key={`${msg.role}-${idx}-${msg.content.slice(0, 8)}`}
              className={`animate-slide-up ${
                msg.role === 'user' ? 'border-b border-gray-500/20 pb-6' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {msg.role === 'user' ? (
                  <div className={`text-2xl font-serif ${textColor}`}>{msg.content}</div>
                ) : msg.role === 'error' ? (
                  <div className="flex items-center gap-2 text-red-500 font-bold">
                    <AlertTriangle size={18} /> Error
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[#2dd4bf] text-sm font-bold uppercase tracking-wider">
                    <Zap size={16} /> PerplexRouter
                  </div>
                )}
              </div>

              {msg.role !== 'user' && (
                <div
                  className={`prose max-w-none ${
                    theme === 'dark'
                      ? 'prose-invert prose-p:text-gray-300 prose-li:text-gray-300'
                      : 'prose-gray text-gray-800'
                  } prose-p:my-6 prose-p:leading-8 prose-li:my-3 prose-ul:my-5 prose-ol:my-5 prose-headings:mt-8 prose-headings:mb-4 prose-pre:my-5 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:my-5 [&>*]:my-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a {...props} target="_blank" rel="noreferrer" className="text-[#2dd4bf] underline" />
                      ),
                      code: ({ inline, className, children, ...props }) =>
                        inline ? (
                          <code className={`${className || ''} px-1 py-0.5 rounded bg-black/10 dark:bg-white/10`} {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="p-3 rounded bg-black/5 dark:bg-white/5 overflow-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        )
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )
        )}

        {isTyping && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#2dd4bf] animate-pulse">
              <Zap size={20} />
              <span className="font-mono text-sm">{t('thinking')}</span>
            </div>
            <div
              className={`h-4 rounded w-full animate-pulse ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-300'
              }`}
            />
            <div
              className={`h-4 rounded w-4/5 animate-pulse ${
                theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-300'
              }`}
            />
          </div>
        )}
      </div>

      <div
        className={`fixed bottom-0 left-0 md:left-64 right-0 p-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-t from-[#191919] via-[#191919] to-transparent'
            : 'bg-gradient-to-t from-[#f0f0f0] via-[#f0f0f0] to-transparent'
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmitFollowUp}
            className={`flex flex-col gap-3 p-3 rounded-2xl border ${inputBg}`}
          >
            <textarea
              ref={followUpRef}
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitFollowUp();
                }
              }}
              placeholder={t('followUp')}
              className={`w-full bg-transparent px-4 py-2 outline-none resize-none min-h-[60px] max-h-[320px] overflow-y-auto leading-relaxed ${textColor} placeholder-gray-500`}
              rows={1}
            />
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setModelMenuOpen((prev) => !prev)}
                    className={`p-2 rounded-full transition-colors ${
                      isModelMenuOpen ? 'bg-[#2dd4bf]/20 text-[#2dd4bf]' : iconButtonBase
                    }`}
                    title={`${t('aiModel')}: ${selectedModel.name}`}
                  >
                    <Cpu size={18} />
                  </button>

                  {isModelMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setModelMenuOpen(false)} />
                      <div
                        className={`absolute bottom-full left-0 mb-2 w-56 border rounded-lg shadow-xl z-20 py-1 overflow-hidden ${dropdownBg}`}
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
                  className={`p-2 rounded-full transition-colors ${
                    webSearchEnabled ? 'bg-[#2dd4bf]/20 text-[#2dd4bf]' : iconButtonBase
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
                        : iconButtonBase
                  }`}
                  title={speechSupported ? t('dictation') : t('dictationUnavailable')}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  type="submit"
                  disabled={!followUpText.trim() || isTyping}
                  className={`p-2 rounded-full transition-all ${
                    followUpText.trim() ? 'bg-[#2dd4bf] text-black' : 'bg-gray-500/20 text-gray-500'
                  }`}
                  title={t('followUp')}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
