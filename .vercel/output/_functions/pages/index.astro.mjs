import { e as createComponent, f as createAstro, k as renderHead, l as renderSlot, r as renderTemplate, n as renderComponent } from '../chunks/astro/server_D74VTQOf.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                 */
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { CornerDownLeft, Zap, ExternalLink, AlertTriangle, Clipboard, RefreshCcw, Cpu, Globe2, MicOff, Mic, ArrowRight, ChevronDown, Library, Search, Plus, Trash2, Clock, X, Key, ArrowUp, ArrowDown, Moon, Sun, PanelRightOpen, PanelLeftOpen, Settings, Menu } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title = "PerplexRouter" } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body class="min-h-screen bg-slate-900 text-white"> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/VSCode/PerplexRouter/src/layouts/BaseLayout.astro", void 0);

const ChatSection = ({
  messages,
  isTyping,
  selectedModel,
  models,
  setSelectedModel,
  webSearchEnabled,
  onToggleWebSearch,
  onRegenerateLast,
  onBack,
  onFollowUp,
  t,
  theme,
  language
}) => {
  const [followUpText, setFollowUpText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isModelMenuOpen, setModelMenuOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const recognitionRef = useRef(null);
  const followUpRef = useRef(null);
  const chatContainerRef = useRef(null);
  const hostnameFromLink = (link) => {
    try {
      return new URL(link).hostname.replace(/^www\./, "");
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
    const SpeechRecognition = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      recognitionRef.current = null;
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "es" ? "es-ES" : "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(" ");
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
    recognitionRef.current.lang = language === "es" ? "es-ES" : "en-US";
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
    setFollowUpText("");
    if (followUpRef.current) {
      followUpRef.current.style.height = "auto";
      followUpRef.current.style.overflowY = "hidden";
    }
  };
  const handleSubmitFollowUp = (e) => {
    e.preventDefault();
    submitFollowUp();
  };
  const adjustFollowUpHeight = () => {
    const el = followUpRef.current;
    if (!el) return;
    const maxHeight = 8 * 24;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };
  const textColor = theme === "dark" ? "text-[#e8e8e6]" : "text-gray-900";
  const inputBg = theme === "dark" ? "bg-[#202020] border-[#333]" : "bg-white border-gray-200 shadow-sm";
  const iconButtonBase = theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-black hover:bg-black/5";
  const dropdownBg = theme === "dark" ? "bg-[#1a1a1a] border-[#333]" : "bg-white border-gray-200";
  const dropdownItemHover = theme === "dark" ? "hover:bg-[#2d2d2d]" : "hover:bg-gray-100";
  useEffect(() => {
    adjustFollowUpHeight();
  }, [followUpText]);
  const copyContent = async (content, idx) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch {
      setCopiedIndex(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full max-w-3xl mx-auto px-4 w-full animate-fade-in relative", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `sticky top-0 z-10 py-4 backdrop-blur-md flex justify-start items-center ${theme === "dark" ? "bg-[#191919]/80" : "bg-[#f0f0f0]/80"}`,
        children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onBack,
            className: "text-sm text-gray-500 hover:text-[#2dd4bf] flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(CornerDownLeft, { size: 14 }),
              " ",
              t("backToHome")
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto pb-56 md:pb-64 space-y-8", ref: chatContainerRef, children: [
      messages.map((msg, idx) => {
        const isLastAssistant = idx === messages.length - 1;
        return msg.role === "sources" ? /* @__PURE__ */ jsxs("div", { className: "animate-slide-up space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[#2dd4bf] text-xs font-bold uppercase tracking-wider", children: [
            /* @__PURE__ */ jsx(Zap, { size: 16 }),
            " ",
            t("sources")
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory ${theme === "dark" ? "scrollbar-thumb-gray-700" : "scrollbar-thumb-gray-300"}`,
              children: (msg.sources || []).map((source, sourceIdx) => /* @__PURE__ */ jsxs(
                "a",
                {
                  href: source.link,
                  target: "_blank",
                  rel: "noreferrer",
                  className: `group min-w-[210px] max-w-[240px] snap-start border rounded-lg p-3 transition-all hover:-translate-y-0.5 ${theme === "dark" ? "border-[#2dd4bf]/20 bg-white/5 hover:border-[#2dd4bf]/40" : "border-gray-200 bg-white hover:border-[#2dd4bf]/40"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs uppercase text-gray-500", children: [
                      /* @__PURE__ */ jsxs("span", { children: [
                        "#",
                        sourceIdx + 1
                      ] }),
                      /* @__PURE__ */ jsx(ExternalLink, { size: 14, className: "opacity-70 group-hover:opacity-100" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "font-semibold mt-1 text-sm line-clamp-2", children: source.title }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-2 line-clamp-3", children: source.snippet }),
                    /* @__PURE__ */ jsx("div", { className: "text-[11px] text-[#2dd4bf] mt-2", children: hostnameFromLink(source.link) })
                  ]
                },
                `${source.link}-${sourceIdx}`
              ))
            }
          )
        ] }, `sources-${idx}`) : /* @__PURE__ */ jsxs(
          "div",
          {
            className: `animate-slide-up ${msg.role === "user" ? "border-b border-gray-500/20 pb-6" : ""}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 mb-3", children: msg.role === "user" ? /* @__PURE__ */ jsx("div", { className: `text-2xl font-serif ${textColor}`, children: msg.content }) : msg.role === "error" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-red-500 font-bold", children: [
                /* @__PURE__ */ jsx(AlertTriangle, { size: 18 }),
                " Error"
              ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[#2dd4bf] text-sm font-bold uppercase tracking-wider", children: [
                /* @__PURE__ */ jsx(Zap, { size: 16 }),
                " PerplexRouter"
              ] }) }),
              msg.role !== "user" && /* @__PURE__ */ jsx(
                "div",
                {
                  className: `prose max-w-none ${theme === "dark" ? "prose-invert prose-p:text-gray-300 prose-li:text-gray-300" : "prose-gray text-gray-800"} prose-p:my-6 prose-p:leading-8 prose-li:my-3 prose-ul:my-5 prose-ol:my-5 prose-headings:mt-8 prose-headings:mb-4 prose-pre:my-5 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:my-5 [&>*]:my-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0`,
                  children: /* @__PURE__ */ jsx(
                    ReactMarkdown,
                    {
                      remarkPlugins: [remarkGfm, remarkBreaks],
                      components: {
                        a: ({ node, ...props }) => /* @__PURE__ */ jsx("a", { ...props, target: "_blank", rel: "noreferrer", className: "text-[#2dd4bf] underline" }),
                        code: ({ inline, className, children, ...props }) => inline ? /* @__PURE__ */ jsx("code", { className: `${className || ""} px-1 py-0.5 rounded bg-black/10 dark:bg-white/10`, ...props, children }) : /* @__PURE__ */ jsx("pre", { className: "p-3 rounded bg-black/5 dark:bg-white/5 overflow-auto", children: /* @__PURE__ */ jsx("code", { className, ...props, children }) })
                      },
                      children: msg.content
                    }
                  )
                }
              ),
              msg.role === "assistant" && /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 mt-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => copyContent(msg.content, idx),
                    className: `p-2 rounded-full transition-colors ${copiedIndex === idx ? "bg-[#2dd4bf]/20 text-[#2dd4bf]" : iconButtonBase}`,
                    title: copiedIndex === idx ? t("copied") : t("copyAnswer"),
                    children: /* @__PURE__ */ jsx(Clipboard, { size: 16 })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    disabled: !isLastAssistant || isTyping,
                    onClick: () => onRegenerateLast(idx),
                    className: `p-2 rounded-full transition-colors ${!isLastAssistant || isTyping ? "text-gray-500/50 cursor-not-allowed" : iconButtonBase}`,
                    title: t("regenerateAnswer"),
                    children: /* @__PURE__ */ jsx(RefreshCcw, { size: 16 })
                  }
                )
              ] })
            ]
          },
          `${msg.role}-${idx}-${msg.content.slice(0, 8)}`
        );
      }),
      isTyping && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[#2dd4bf] animate-pulse", children: [
          /* @__PURE__ */ jsx(Zap, { size: 20 }),
          /* @__PURE__ */ jsx("span", { className: "font-mono text-sm", children: t("thinking") })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-4 rounded w-full animate-pulse ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-300"}`
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-4 rounded w-4/5 animate-pulse ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-300"}`
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-24" })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed bottom-0 left-0 md:left-64 right-0 p-4 ${theme === "dark" ? "bg-gradient-to-t from-[#191919] via-[#191919] to-transparent" : "bg-gradient-to-t from-[#f0f0f0] via-[#f0f0f0] to-transparent"}`,
        children: /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: handleSubmitFollowUp,
            className: `flex flex-col gap-3 p-3 rounded-2xl border ${inputBg}`,
            children: [
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  ref: followUpRef,
                  value: followUpText,
                  onChange: (e) => setFollowUpText(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitFollowUp();
                    }
                  },
                  placeholder: t("followUp"),
                  className: `w-full bg-transparent px-4 py-2 outline-none resize-none min-h-[60px] max-h-[320px] overflow-y-auto leading-relaxed ${textColor} placeholder-gray-500`,
                  rows: 1
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setModelMenuOpen((prev) => !prev),
                        className: `p-2 rounded-full transition-colors ${isModelMenuOpen ? "bg-[#2dd4bf]/20 text-[#2dd4bf]" : iconButtonBase}`,
                        title: `${t("aiModel")}: ${selectedModel.name}`,
                        children: /* @__PURE__ */ jsx(Cpu, { size: 18 })
                      }
                    ),
                    isModelMenuOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-10", onClick: () => setModelMenuOpen(false) }),
                      /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: `absolute bottom-full left-0 mb-2 w-56 border rounded-lg shadow-xl z-20 py-1 overflow-hidden ${dropdownBg}`,
                          children: [
                            /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-xs font-bold text-gray-500 border-b border-gray-500/20", children: t("availableModels") }),
                            models.map((model) => /* @__PURE__ */ jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  setSelectedModel(model);
                                  setModelMenuOpen(false);
                                },
                                className: `w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${dropdownItemHover} ${selectedModel.id === model.id ? "text-[#2dd4bf]" : theme === "dark" ? "text-gray-300" : "text-gray-800"}`,
                                children: [
                                  /* @__PURE__ */ jsx("span", { className: "truncate", children: model.name }),
                                  selectedModel.id === model.id && /* @__PURE__ */ jsx(Zap, { size: 12 })
                                ]
                              },
                              model.id
                            ))
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onToggleWebSearch,
                      className: `p-2 rounded-full transition-colors ${webSearchEnabled ? "bg-[#2dd4bf]/20 text-[#2dd4bf]" : iconButtonBase}`,
                      title: webSearchEnabled ? t("webSearchOn") : t("webSearchOff"),
                      children: /* @__PURE__ */ jsx(Globe2, { size: 18 })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: toggleDictation,
                      disabled: !speechSupported,
                      className: `p-2 rounded-full transition-colors ${!speechSupported ? "text-gray-500/50 cursor-not-allowed" : isListening ? "bg-[#2dd4bf]/20 text-[#2dd4bf]" : iconButtonBase}`,
                      title: speechSupported ? t("dictation") : t("dictationUnavailable"),
                      children: isListening ? /* @__PURE__ */ jsx(MicOff, { size: 18 }) : /* @__PURE__ */ jsx(Mic, { size: 18 })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: !followUpText.trim() || isTyping,
                      className: `p-2 rounded-full transition-all ${followUpText.trim() ? "bg-[#2dd4bf] text-black" : "bg-gray-500/20 text-gray-500"}`,
                      title: t("followUp"),
                      children: /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
                    }
                  )
                ] })
              ] })
            ]
          }
        ) })
      }
    )
  ] });
};

const HeroSection = ({
  onSearch,
  models,
  selectedModel,
  setSelectedModel,
  webSearchEnabled,
  onToggleWebSearch,
  t,
  theme
}) => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const textareaRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };
  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    const maxHeight = 8 * 24;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };
  useEffect(() => {
    adjustHeight();
  }, [query]);
  const textColor = theme === "dark" ? "text-[#e8e8e6]" : "text-gray-900";
  const textAreaBg = theme === "dark" ? "bg-[#202020] border-[#333] hover:border-[#444]" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm";
  const dropdownBg = theme === "dark" ? "bg-[#1a1a1a] border-[#333]" : "bg-white border-gray-200";
  const dropdownItemHover = theme === "dark" ? "hover:bg-[#2d2d2d]" : "hover:bg-gray-100";
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[80vh] px-4 max-w-3xl mx-auto w-full animate-fade-in", children: [
    /* @__PURE__ */ jsx("h1", { className: `text-4xl md:text-5xl font-serif italic mb-8 text-center opacity-90 ${textColor}`, children: t("whereKnowledgeBegins") }),
    /* @__PURE__ */ jsx("div", { className: "w-full relative group", children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: `relative z-10 border rounded-xl shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#2dd4bf]/20 ${textAreaBg}`,
        children: [
          /* @__PURE__ */ jsx(
            "textarea",
            {
              ref: textareaRef,
              value: query,
              onChange: (e) => setQuery(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSearch(query);
                }
              },
              placeholder: t("askAnything"),
              className: `w-full bg-transparent placeholder-gray-500 text-lg p-5 pr-14 outline-none resize-none min-h-[60px] max-h-[320px] overflow-y-auto leading-relaxed ${textColor}`,
              rows: 1
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 pb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setDropdownOpen(!isDropdownOpen),
                    className: `flex items-center gap-2 text-xs font-medium bg-[#2d2d2d] hover:bg-[#333] px-3 py-1.5 rounded-full transition-colors ${theme === "dark" ? "text-gray-400 hover:text-[#2dd4bf]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
                    children: [
                      /* @__PURE__ */ jsx(Cpu, { size: 14 }),
                      /* @__PURE__ */ jsx("span", { className: "max-w-[100px] truncate", children: selectedModel.name }),
                      /* @__PURE__ */ jsx(ChevronDown, { size: 12 })
                    ]
                  }
                ),
                isDropdownOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-10", onClick: () => setDropdownOpen(false) }),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `absolute top-full left-0 mt-2 w-56 border rounded-lg shadow-xl z-20 py-1 overflow-hidden ${dropdownBg}`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "px-3 py-2 text-xs font-bold text-gray-500 border-b border-gray-500/20", children: t("availableModels") }),
                        models.map((model) => /* @__PURE__ */ jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              setSelectedModel(model);
                              setDropdownOpen(false);
                            },
                            className: `w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${dropdownItemHover} ${selectedModel.id === model.id ? "text-[#2dd4bf]" : theme === "dark" ? "text-gray-300" : "text-gray-800"}`,
                            children: [
                              /* @__PURE__ */ jsx("span", { className: "truncate", children: model.name }),
                              selectedModel.id === model.id && /* @__PURE__ */ jsx(Zap, { size: 12 })
                            ]
                          },
                          model.id
                        ))
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: onToggleWebSearch,
                  className: `flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${webSearchEnabled ? "bg-[#2dd4bf]/20 text-[#2dd4bf]" : theme === "dark" ? "bg-[#2d2d2d] text-gray-400 hover:text-[#2dd4bf]" : "bg-gray-100 text-gray-600 hover:bg-gray-800 hover:text-white"}`,
                  title: webSearchEnabled ? t("webSearchOn") : t("webSearchOff"),
                  children: [
                    /* @__PURE__ */ jsx(Globe2, { size: 14 }),
                    /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t("webSearch") })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: `p-2 rounded-full transition-all ${query.trim() ? "bg-[#2dd4bf] text-black hover:scale-105" : "bg-gray-500/20 text-gray-500 cursor-not-allowed"}`,
                disabled: !query.trim(),
                children: /* @__PURE__ */ jsx(ArrowRight, { size: 18 })
              }
            )
          ] })
        ]
      }
    ) })
  ] });
};

const LibrarySection = ({
  history,
  onLoadChat,
  onDelete,
  onDeleteAll,
  onStartNew,
  onBack,
  t,
  theme
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const textColor = theme === "dark" ? "text-[#e8e8e6]" : "text-gray-900";
  const subTextColor = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-white border border-gray-200 hover:border-[#2dd4bf]/50 hover:shadow-md";
  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (item) => item.title.toLowerCase().includes(q) || item.preview.toLowerCase().includes(q)
    );
  }, [history, searchQuery]);
  const handleDeleteAll = () => {
    const confirmed = window.confirm(t("confirmDeleteAll"));
    if (confirmed) {
      onDeleteAll();
      setShowSearch(false);
    }
  };
  const openSearch = () => {
    setShowSearch(true);
    setSearchQuery("");
  };
  const cleanPreview = (text) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`#>~\-]+/g, "").replace(/\s+/g, " ").trim();
  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8 animate-fade-in w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-[#2dd4bf]/10 rounded-xl", children: /* @__PURE__ */ jsx(Library, { className: "text-[#2dd4bf]", size: 32 }) }),
        /* @__PURE__ */ jsx("h1", { className: `text-3xl font-serif ${textColor}`, children: t("libraryTitle") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: openSearch,
            className: `p-2 rounded-full border transition-colors ${theme === "dark" ? "border-[#2dd4bf]/30 text-[#2dd4bf] hover:bg-white/5" : "border-[#2dd4bf]/40 text-[#2dd4bf] hover:bg-[#2dd4bf]/10"}`,
            title: t("searchChats"),
            children: /* @__PURE__ */ jsx(Search, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              onStartNew();
              setShowSearch(false);
              setSearchQuery("");
            },
            className: `p-2 rounded-full border transition-colors ${theme === "dark" ? "border-[#2dd4bf]/20 text-[#2dd4bf] hover:bg-white/5" : "border-[#2dd4bf]/30 text-[#0f766e] hover:bg-[#2dd4bf]/10"}`,
            title: t("startNewThread"),
            children: /* @__PURE__ */ jsx(Plus, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleDeleteAll,
            className: `p-2 rounded-full border transition-colors ${theme === "dark" ? "border-red-500/40 text-red-400 hover:bg-red-500/10" : "border-red-200 text-red-500 hover:bg-red-50"}`,
            title: t("deleteAllChats"),
            children: /* @__PURE__ */ jsx(Trash2, { size: 18 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: history.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20 text-gray-500", children: [
      /* @__PURE__ */ jsx("p", { children: t("libraryEmpty") }),
      /* @__PURE__ */ jsx("button", { onClick: onBack, className: "text-[#2dd4bf] mt-2 hover:underline", children: t("startNewThread") })
    ] }) : history.map((item) => /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => onLoadChat(item),
        className: `group relative p-5 rounded-xl border border-transparent transition-all cursor-pointer ${cardBg}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-2", children: /* @__PURE__ */ jsx(
            "h3",
            {
              className: `font-semibold text-lg pr-8 group-hover:text-[#2dd4bf] transition-colors ${textColor}`,
              children: item.title
            }
          ) }),
          /* @__PURE__ */ jsx("p", { className: `text-sm line-clamp-2 ${subTextColor}`, children: cleanPreview(item.preview) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-3 text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Clock, { size: 12 }),
              " ",
              item.date
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: (e) => onDelete(item.id, e),
                className: "p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100",
                title: "Eliminar",
                children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
              }
            )
          ] })
        ]
      },
      item.id
    )) }),
    showSearch && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: `w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden ${theme === "dark" ? "bg-[#1d1d1d] border-[#2d2d2d]" : "bg-white border-gray-200"}`,
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `flex items-center gap-3 px-4 py-3 border-b ${theme === "dark" ? "border-[#2d2d2d]" : "border-gray-200"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 bg-black/5 dark:bg-white/5 rounded-full px-3 py-2", children: [
                  /* @__PURE__ */ jsx(Search, { size: 16, className: "text-gray-500" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      autoFocus: true,
                      value: searchQuery,
                      onChange: (e) => setSearchQuery(e.target.value),
                      placeholder: t("searchChatsPlaceholder"),
                      className: `flex-1 bg-transparent outline-none text-sm ${theme === "dark" ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-500"}`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: closeSearch,
                    className: `text-sm font-medium px-3 py-2 rounded-full transition-colors ${theme === "dark" ? "text-gray-300 hover:bg-white/5" : "text-[#0f766e] hover:bg-[#2dd4bf]/15"}`,
                    children: t("cancel")
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "max-h-[70vh] overflow-y-auto divide-y divide-gray-200 dark:divide-[#2d2d2d]", children: filteredHistory.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-6 text-center text-sm text-gray-500", children: t("noResults") }) : filteredHistory.map((item) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                onLoadChat(item);
                closeSearch();
              },
              className: `w-full text-left px-5 py-4 transition-colors ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-[#2dd4bf]/10"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: `font-semibold text-base mb-1 ${textColor}`, children: item.title }),
                  /* @__PURE__ */ jsx("p", { className: `text-sm line-clamp-2 ${subTextColor}`, children: cleanPreview(item.preview) })
                ] }) }),
                /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs text-gray-500 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { size: 12 }),
                  " ",
                  item.date
                ] })
              ]
            },
            item.id
          )) })
        ]
      }
    ) })
  ] });
};

const SettingsModal = ({
  close,
  apiKey,
  setApiKey,
  models,
  addModel,
  deleteModel,
  reorderModel,
  theme,
  setTheme,
  language,
  setLanguage,
  systemPrompt,
  setSystemPrompt,
  t
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [newModelId, setNewModelId] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const handleAddModel = (e) => {
    e.preventDefault();
    if (!newModelId.trim() || !newModelName.trim()) return;
    addModel({ id: newModelId, name: newModelName });
    setNewModelId("");
    setNewModelName("");
  };
  const bgModal = theme === "dark" ? "bg-[#191919] border-[#333] text-white" : "bg-white border-gray-200 text-gray-900";
  const sidebarBg = theme === "dark" ? "bg-[#1f1f1f] border-[#2d2d2d]" : "bg-gray-50 border-gray-200";
  const inputBg = theme === "dark" ? "bg-[#111] border-[#333] text-white" : "bg-white border-gray-300 text-black";
  const TabButton = ({ id, label }) => /* @__PURE__ */ jsx(
    "button",
    {
      onClick: () => setActiveTab(id),
      className: `w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors 
        ${activeTab === id ? "bg-[#2dd4bf]/10 text-[#2dd4bf]" : theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`,
      children: label
    }
  );
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: `w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${bgModal}`, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex items-center justify-between p-6 border-b ${theme === "dark" ? "border-[#2d2d2d]" : "border-gray-200"}`,
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: t("settingsTitle") }),
          /* @__PURE__ */ jsx("button", { onClick: close, className: "text-gray-400 hover:text-[#2dd4bf] transition-colors", children: /* @__PURE__ */ jsx(X, { size: 24 }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: `w-48 border-r p-4 space-y-2 hidden md:block ${sidebarBg}`, children: [
        /* @__PURE__ */ jsx(TabButton, { id: "general", label: t("general") }),
        /* @__PURE__ */ jsx(TabButton, { id: "models", label: t("models") }),
        /* @__PURE__ */ jsx(TabButton, { id: "appearance", label: t("appearance") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 p-6 overflow-y-auto", children: [
        activeTab === "general" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-1", children: t("apiKeyTitle") }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: t("apiKeyDesc") }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                Key,
                {
                  className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500",
                  size: 18
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: apiKey,
                  onChange: (e) => setApiKey(e.target.value),
                  placeholder: "sk-or-v1-...",
                  className: `w-full rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#2dd4bf] transition-colors font-mono text-sm ${inputBg}`
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-1", children: t("systemPromptTitle") }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: t("systemPromptDesc") }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: systemPrompt,
                onChange: (e) => setSystemPrompt(e.target.value),
                placeholder: t("systemPromptPlaceholder"),
                className: `w-full rounded-lg p-3 text-sm focus:outline-none focus:border-[#2dd4bf] transition-colors min-h-[120px] leading-6 ${inputBg}`
              }
            )
          ] })
        ] }),
        activeTab === "models" && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-1", children: t("modelManagement") }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-4", children: t("modelManagementDesc") }),
          /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: handleAddModel,
              className: `grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 p-4 rounded-xl border ${theme === "dark" ? "bg-[#111] border-[#2d2d2d]" : "bg-gray-50 border-gray-200"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "col-span-2 md:col-span-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1", children: t("modelId") }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      required: true,
                      value: newModelId,
                      onChange: (e) => setNewModelId(e.target.value),
                      placeholder: "google/gemini-pro",
                      className: `w-full rounded px-3 py-2 text-sm focus:border-[#2dd4bf] outline-none font-mono ${inputBg}`
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "col-span-2 md:col-span-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-xs text-gray-500 mb-1", children: t("modelName") }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        required: true,
                        value: newModelName,
                        onChange: (e) => setNewModelName(e.target.value),
                        placeholder: "Gemini Pro",
                        className: `flex-1 rounded px-3 py-2 text-sm focus:border-[#2dd4bf] outline-none ${inputBg}`
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "submit",
                        className: "bg-[#2dd4bf] hover:bg-[#25b5a3] text-black p-2 rounded transition-colors",
                        children: /* @__PURE__ */ jsx(Plus, { size: 18 })
                      }
                    )
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: models.map((model, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `flex items-center justify-between p-3 rounded-lg border group ${theme === "dark" ? "bg-[#1f1f1f] border-[#2d2d2d] hover:border-[#444]" : "bg-white border-gray-200 hover:border-gray-300"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: model.name }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 font-mono", children: model.id })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => reorderModel(idx, "up"),
                      disabled: idx === 0,
                      className: `p-1.5 rounded hover:bg-gray-700/50 ${idx === 0 ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-white"}`,
                      title: "Mover arriba",
                      children: /* @__PURE__ */ jsx(ArrowUp, { size: 16 })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => reorderModel(idx, "down"),
                      disabled: idx === models.length - 1,
                      className: `p-1.5 rounded hover:bg-gray-700/50 ${idx === models.length - 1 ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-white"}`,
                      title: "Mover abajo",
                      children: /* @__PURE__ */ jsx(ArrowDown, { size: 16 })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => deleteModel(model.id),
                      className: "text-gray-500 hover:text-red-500 p-2 ml-2 transition-colors",
                      title: "Eliminar",
                      children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
                    }
                  )
                ] })
              ]
            },
            model.id
          )) })
        ] }) }),
        activeTab === "appearance" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-4", children: t("themeTitle") }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setTheme("dark"),
                  className: `flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${theme === "dark" ? "border-[#2dd4bf] bg-[#222]" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      Moon,
                      {
                        size: 32,
                        className: `mb-3 ${theme === "dark" ? "text-[#2dd4bf]" : "text-gray-500"}`
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-600"}`,
                        children: t("darkMode")
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setTheme("light"),
                  className: `flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${theme === "light" ? "border-[#2dd4bf] bg-white" : "border-[#333] bg-[#111] hover:bg-[#1a1a1a]"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      Sun,
                      {
                        size: 32,
                        className: `mb-3 ${theme === "light" ? "text-orange-500" : "text-gray-500"}`
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `text-sm font-medium ${theme === "light" ? "text-black" : "text-gray-400"}`,
                        children: t("lightMode")
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium mb-4", children: t("languageTitle") }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setLanguage("es"),
                  className: `w-full flex items-center justify-between p-4 rounded-xl border transition-all ${language === "es" ? "bg-[#2dd4bf]/10 border-[#2dd4bf]" : theme === "dark" ? "bg-[#111] border-[#333] hover:border-gray-500" : "bg-white border-gray-200 hover:border-gray-300"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🇪🇸" }),
                      /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `font-medium ${language === "es" ? "text-[#2dd4bf]" : theme === "dark" ? "text-gray-300" : "text-gray-800"}`,
                            children: "Español"
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: t("defaultLang") })
                      ] })
                    ] }),
                    language === "es" && /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-[#2dd4bf] rounded-full" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setLanguage("en"),
                  className: `w-full flex items-center justify-between p-4 rounded-xl border transition-all ${language === "en" ? "bg-[#2dd4bf]/10 border-[#2dd4bf]" : theme === "dark" ? "bg-[#111] border-[#333] hover:border-gray-500" : "bg-white border-gray-200 hover:border-gray-300"}`,
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🇺🇸" }),
                      /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `font-medium ${language === "en" ? "text-[#2dd4bf]" : theme === "dark" ? "text-gray-300" : "text-gray-800"}`,
                            children: "English"
                          }
                        ),
                        /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: t("interfaceLang") })
                      ] })
                    ] }),
                    language === "en" && /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-[#2dd4bf] rounded-full" })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `p-4 border-t flex justify-end ${theme === "dark" ? "border-[#2d2d2d] bg-[#1f1f1f]" : "border-gray-200 bg-gray-50"}`,
        children: /* @__PURE__ */ jsx(
          "button",
          {
            onClick: close,
            className: "px-4 py-2 bg-[#2dd4bf] hover:bg-[#25b5a3] text-black font-medium rounded-lg transition-colors text-sm",
            children: "OK"
          }
        )
      }
    )
  ] }) });
};

const NavItem = ({ icon, label, active, onClick, theme }) => {
  const activeClass = theme === "dark" ? "bg-[#2d2d2d] text-[#e8e8e6]" : "bg-gray-200 text-black";
  const inactiveClass = theme === "dark" ? "text-gray-400 hover:bg-white/5 hover:text-[#e8e8e6]" : "text-gray-600 hover:bg-black/5 hover:text-black";
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: `flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active ? activeClass : inactiveClass}`,
      children: [
        icon,
        /* @__PURE__ */ jsx("span", { children: label })
      ]
    }
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
}) => {
  const recentHistory = history.slice(0, 5);
  return /* @__PURE__ */ jsx(
    "aside",
    {
      className: `fixed inset-y-0 left-0 z-30 w-64 border-r transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${theme === "dark" ? "bg-[#191919] border-[#2d2d2d]" : "bg-[#f7f7f7] border-gray-200"}
        ${isOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-full md:w-0 md:border-none md:overflow-hidden md:opacity-0 md:pointer-events-none"}`,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex flex-col h-full p-4 ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-200`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 cursor-pointer", onClick: onHomeClick, children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-[#2dd4bf] rounded-full flex items-center justify-center text-black font-bold text-xl font-serif", children: "P" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `font-semibold text-xl tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`,
                    children: "PerplexRouter"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: toggle,
                  className: `text-gray-400 hover:text-white/90 hover:bg-white/5 rounded-full p-1 ${theme === "light" ? "hover:text-gray-700 hover:bg-black/5" : ""}`,
                  title: isOpen ? "Cerrar" : "Abrir",
                  children: isOpen ? /* @__PURE__ */ jsx(PanelRightOpen, { size: 20 }) : /* @__PURE__ */ jsx(PanelLeftOpen, { size: 20 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: onHomeClick,
                className: `flex items-center gap-3 border text-sm font-medium py-3 px-4 rounded-full transition-all group mb-6
            ${theme === "dark" ? "bg-white/5 hover:bg-white/10 border-white/10 text-white" : "bg-white hover:bg-gray-50 border-gray-200 text-gray-800 shadow-sm"}`,
                children: [
                  /* @__PURE__ */ jsx(
                    Plus,
                    {
                      size: 18,
                      className: "text-[#2dd4bf] group-hover:rotate-90 transition-transform"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: t("newThread") }),
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `ml-auto text-xs border px-1.5 rounded ${theme === "dark" ? "text-gray-500 border-gray-500/30" : "text-gray-400 border-gray-200"}`,
                      children: "Ctrl I"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs("nav", { className: "space-y-1 mb-6", children: [
              /* @__PURE__ */ jsx(
                NavItem,
                {
                  icon: /* @__PURE__ */ jsx(Search, { size: 18 }),
                  label: t("home"),
                  active: currentView === "home",
                  onClick: onHomeClick,
                  theme
                }
              ),
              /* @__PURE__ */ jsx(
                NavItem,
                {
                  icon: /* @__PURE__ */ jsx(Library, { size: 18 }),
                  label: t("library"),
                  active: currentView === "library",
                  onClick: onLibraryClick,
                  theme
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto pr-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2", children: t("recents") }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                recentHistory.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-3 text-sm text-gray-500 italic", children: t("noHistory") }),
                recentHistory.map((item) => /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => onLoadChat(item),
                    className: `w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors
                  ${theme === "dark" ? "text-gray-400 hover:text-[#e8e8e6] hover:bg-white/5" : "text-gray-600 hover:text-black hover:bg-black/5"}`,
                    children: item.title
                  },
                  item.id
                ))
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: `pt-4 mt-4 border-t ${theme === "dark" ? "border-[#2d2d2d]" : "border-gray-200"}`,
                children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: openSettings,
                      className: `flex items-center gap-3 w-full px-3 py-2 text-sm rounded-lg transition-colors
              ${theme === "dark" ? "text-gray-400 hover:text-[#e8e8e6] hover:bg-white/5" : "text-gray-600 hover:text-black hover:bg-black/5"}`,
                      children: [
                        /* @__PURE__ */ jsx(Settings, { size: 18 }),
                        /* @__PURE__ */ jsx("span", { children: t("settings") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "mt-2 flex items-center justify-between px-3", children: /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-500", children: [
                    "x: ",
                    /* @__PURE__ */ jsx("a", { href: "https://x.com/nosoylauti/", children: "@nosoylauti" })
                  ] }) })
                ]
              }
            )
          ]
        }
      )
    }
  );
};

const DEFAULT_MODELS = [
  { id: "openai/gpt-4o", name: "GPT-4o" },
  { id: "anthropic/claude-3-opus", name: "Claude 3 Opus" },
  { id: "google/gemini-pro", name: "Gemini Pro" }
];

const TRANSLATIONS = {
  es: {
    whereKnowledgeBegins: "Donde comienza el conocimiento",
    askAnything: "Pregunta lo que sea...",
    availableModels: "MODELOS DISPONIBLES",
    newThread: "Nuevo Hilo",
    home: "Inicio",
    library: "Biblioteca",
    recents: "RECIENTES",
    settings: "Configuración",
    noHistory: "No hay historial reciente",
    libraryTitle: "Biblioteca de Hilos",
    libraryEmpty: "Tu biblioteca está vacía.",
    startNewThread: "Comenzar un nuevo hilo",
    backToHome: "Volver al inicio",
    searchChats: "Buscar chats",
    searchChatsPlaceholder: "Buscar hilos",
    deleteAllChats: "Eliminar todos",
    confirmDeleteAll: "¿Eliminar todos los chats? Esta acción no se puede deshacer.",
    cancel: "Cancelar",
    noResults: "Sin resultados",
    generating: "GENERANDO RESPUESTA...",
    thinking: "PENSANDO...",
    sources: "Fuentes",
    webSearch: "Búsqueda web",
    webSearchOn: "Web activada",
    webSearchOff: "Web desactivada",
    webSearchError: "No se pudieron cargar las fuentes web.",
    webSearchInfoTitle: "Importante sobre la búsqueda web",
    webSearchInfoBody: 'La "API casera" deja de funcionar en Vercel porque deja de verse como un usuario normal: las requests salen desde rangos de IP de datacenter muy usados para scraping, y los sistemas anti-bot de DuckDuckGo (o de su CDN) suelen devolver HTML distinto o vacío aunque el status sea 200, por lo que tu parser no encuentra resultados; en una máquina local o un servidor propio con IP residencial esto no pasa, porque esa IP tiene un perfil de tráfico mucho más "humano" y no está en listas de bloqueo ni bajo las mismas reglas de seguridad.\n\nSe puede clonar el repositorio de GitHub y probarlo. El repositorio es el siguiente: https://github.com/Lautaro005/PerplexRouter',
    webSearchInfoOk: "Entendido",
    followUp: "Haz una pregunta de seguimiento...",
    aiModel: "Modelo IA",
    dictation: "Dictado (ES/EN)",
    dictationUnavailable: "Dictado no disponible en este navegador",
    copyAnswer: "Copiar respuesta",
    regenerateAnswer: "Regenerar respuesta",
    copied: "Copiado",
    settingsTitle: "Configuración",
    general: "General",
    models: "Modelos IA",
    appearance: "Aspecto",
    apiKeyTitle: "OpenRouter API Key",
    apiKeyDesc: "Esta llave se guarda localmente. Necesaria para conectar.",
    systemPromptTitle: "System Prompt",
    systemPromptDesc: "Define el comportamiento base del asistente. Se envía al modelo en cada conversación.",
    systemPromptPlaceholder: "Eres un asistente experto en...",
    modelManagement: "Gestión de Modelos",
    modelManagementDesc: "Agrega, elimina o reordena los modelos.",
    modelId: "ID del Modelo",
    modelName: "Nombre",
    themeTitle: "Tema de la Interfaz",
    darkMode: "Modo Oscuro",
    lightMode: "Modo Claro",
    languageTitle: "Idioma",
    defaultLang: "Idioma predeterminado",
    interfaceLang: "Idioma de la interfaz",
    errorNoKey: "Error: No se detectó API Key. Ve a configuración y añade tu OpenRouter Key.",
    errorApi: "Error al conectar con OpenRouter.",
    completed: "Completado"
  },
  en: {
    whereKnowledgeBegins: "Where knowledge begins",
    askAnything: "Ask anything...",
    availableModels: "AVAILABLE MODELS",
    newThread: "New Thread",
    home: "Home",
    library: "Library",
    recents: "RECENTS",
    settings: "Settings",
    noHistory: "No recent history",
    libraryTitle: "Thread Library",
    libraryEmpty: "Your library is empty.",
    startNewThread: "Start a new thread",
    backToHome: "Back to home",
    searchChats: "Search chats",
    searchChatsPlaceholder: "Search threads",
    deleteAllChats: "Delete all",
    confirmDeleteAll: "Delete all chats? This action cannot be undone.",
    cancel: "Cancel",
    noResults: "No results",
    generating: "GENERATING RESPONSE...",
    thinking: "THINKING...",
    sources: "Sources",
    webSearch: "Web search",
    webSearchOn: "Web on",
    webSearchOff: "Web off",
    webSearchError: "Unable to load web sources.",
    webSearchInfoTitle: "Important about web search",
    webSearchInfoBody: `The "DIY API" stops working on Vercel because traffic no longer looks like a normal user: requests come from datacenter IP ranges commonly used for scraping, and DuckDuckGo (or its CDN) anti-bot systems often return different or empty HTML even with 200 status, so your parser finds nothing; on a local machine or your own server with a residential IP this doesn't happen because that IP has more "human" traffic patterns and is not on blocklists or under the same security rules.

You can clone the GitHub repo and try it. Repo: https://github.com/Lautaro005/PerplexRouter`,
    webSearchInfoOk: "Got it",
    followUp: "Ask a follow-up...",
    aiModel: "AI Model",
    dictation: "Voice input (EN/ES)",
    dictationUnavailable: "Dictation not available in this browser",
    copyAnswer: "Copy answer",
    regenerateAnswer: "Regenerate answer",
    copied: "Copied",
    settingsTitle: "Settings",
    general: "General",
    models: "AI Models",
    appearance: "Appearance",
    apiKeyTitle: "OpenRouter API Key",
    apiKeyDesc: "Key is stored locally. Required to connect.",
    systemPromptTitle: "System Prompt",
    systemPromptDesc: "Set a base instruction the assistant will follow on every chat.",
    systemPromptPlaceholder: "You are a helpful expert assistant that...",
    modelManagement: "Model Management",
    modelManagementDesc: "Add, remove or reorder models.",
    modelId: "Model ID",
    modelName: "Name",
    themeTitle: "Interface Theme",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    languageTitle: "Language",
    defaultLang: "Default language",
    interfaceLang: "Interface language",
    errorNoKey: "Error: No API Key detected. Please go to settings and add your OpenRouter Key.",
    errorApi: "Error connecting to OpenRouter.",
    completed: "Completed"
  }
};
const createTranslator = (language) => {
  return (key) => TRANSLATIONS[language][key] || key;
};

const withOrigin = () => typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://astro-app.local";
const isChatRole = (role) => role === "user" || role === "assistant";
const callOpenRouter = async (messages, modelId, apiKey, systemPrompt, searchResults) => {
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }
  const trimmedSystemPrompt = systemPrompt?.trim();
  const sanitizedMessages = messages.filter((m) => isChatRole(m.role)).map((m) => ({ role: m.role, content: m.content }));
  const searchContext = searchResults && searchResults.length ? [
    {
      role: "user",
      content: `Resultados de búsqueda web recientes:
${searchResults.map(
        (result, idx) => `${idx + 1}. ${result.title}
URL: ${result.link}
Resumen: ${result.snippet}`
      ).join(
        "\n\n"
      )}
Utiliza estas fuentes para mejorar tu respuesta y cita las URLs cuando sea útil.`
    }
  ] : [];
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": withOrigin(),
      "X-Title": "Perplexity Clone"
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        ...trimmedSystemPrompt ? [{ role: "system", content: trimmedSystemPrompt }] : [],
        ...sanitizedMessages,
        ...searchContext
      ]
    })
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "API Error");
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

const fetchSearchResults = async (query) => {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
  if (!response.ok) {
    throw new Error("SEARCH_FAILED");
  }
  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
};

const isBrowser = typeof window !== "undefined";
const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [viewState, setViewState] = useState("home");
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [customModels, setCustomModels] = useState(DEFAULT_MODELS);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODELS[0]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [showWebSearchInfo, setShowWebSearchInfo] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("es");
  const t = useMemo(() => createTranslator(language), [language]);
  useEffect(() => {
    if (!isBrowser) return;
    const storedKey = localStorage.getItem("openrouter_key");
    const storedHistory = localStorage.getItem("chat_history");
    const storedModels = localStorage.getItem("custom_models");
    const storedWebSearch = localStorage.getItem("web_search_enabled");
    const storedSystemPrompt = localStorage.getItem("system_prompt");
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
      setWebSearchEnabled(storedWebSearch === "true");
    }
  }, []);
  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem("openrouter_key", apiKey);
  }, [apiKey]);
  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem("system_prompt", systemPrompt);
  }, [systemPrompt]);
  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem("chat_history", JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem("custom_models", JSON.stringify(customModels));
  }, [customModels]);
  useEffect(() => {
    if (!isBrowser) return;
    localStorage.setItem("web_search_enabled", String(webSearchEnabled));
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
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  const currentModel = selectedModel || customModels[0] || DEFAULT_MODELS[0];
  const formatDate = () => (/* @__PURE__ */ new Date()).toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
  const updateHistoryMessages = (chatId, messages) => {
    setHistory((prev) => prev.map((h) => h.id === chatId ? { ...h, messages } : h));
  };
  const handleInitialSearch = async (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    const initialMsg = { role: "user", content: trimmedQuery };
    let visibleMessages = [initialMsg];
    const newChatId = Date.now();
    setActiveChatId(newChatId);
    setCurrentMessages(visibleMessages);
    setViewState("chat");
    setIsTyping(true);
    const newEntry = {
      id: newChatId,
      title: trimmedQuery,
      date: formatDate(),
      preview: "...",
      messages: visibleMessages
    };
    setHistory((prev) => [newEntry, ...prev]);
    let searchResults;
    if (webSearchEnabled) {
      try {
        searchResults = await fetchSearchResults(trimmedQuery);
        if (searchResults.length) {
          const sourcesMsg = { role: "sources", content: t("sources"), sources: searchResults };
          visibleMessages = [...visibleMessages, sourcesMsg];
          setCurrentMessages(visibleMessages);
          updateHistoryMessages(newChatId, visibleMessages);
        }
      } catch {
        const searchError = { role: "error", content: t("webSearchError") };
        visibleMessages = [...visibleMessages, searchError];
        setCurrentMessages(visibleMessages);
        updateHistoryMessages(newChatId, visibleMessages);
      }
    }
    try {
      const reply = await callOpenRouter(visibleMessages, currentModel.id, apiKey, systemPrompt, searchResults);
      const assistantMsg = { role: "assistant", content: reply };
      const updatedMessages = [...visibleMessages, assistantMsg];
      setCurrentMessages(updatedMessages);
      setHistory(
        (prev) => prev.map(
          (h) => h.id === newChatId ? { ...h, preview: `${reply.substring(0, 100)}...`, messages: updatedMessages } : h
        )
      );
    } catch (error) {
      const errorMsg = error instanceof Error && error.message === "NO_API_KEY" ? t("errorNoKey") : `${t("errorApi")} (${error instanceof Error ? error.message : "Unknown error"})`;
      const errorMsgObj = { role: "error", content: errorMsg };
      const finalMessages = [...visibleMessages, errorMsgObj];
      setCurrentMessages(finalMessages);
      updateHistoryMessages(newChatId, finalMessages);
    } finally {
      setIsTyping(false);
    }
  };
  const handleFollowUp = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || !activeChatId) return;
    const userMsg = { role: "user", content: trimmed };
    let visibleMessages = [...currentMessages, userMsg];
    setCurrentMessages(visibleMessages);
    setIsTyping(true);
    updateHistoryMessages(activeChatId, visibleMessages);
    let searchResults;
    if (webSearchEnabled) {
      try {
        searchResults = await fetchSearchResults(trimmed);
        if (searchResults.length) {
          const sourcesMsg = { role: "sources", content: t("sources"), sources: searchResults };
          visibleMessages = [...visibleMessages, sourcesMsg];
          setCurrentMessages(visibleMessages);
          updateHistoryMessages(activeChatId, visibleMessages);
        }
      } catch {
        const searchError = { role: "error", content: t("webSearchError") };
        visibleMessages = [...visibleMessages, searchError];
        setCurrentMessages(visibleMessages);
        updateHistoryMessages(activeChatId, visibleMessages);
      }
    }
    try {
      const reply = await callOpenRouter(visibleMessages, currentModel.id, apiKey, systemPrompt, searchResults);
      const finalMessages = [...visibleMessages, { role: "assistant", content: reply }];
      setCurrentMessages(finalMessages);
      setHistory(
        (prev) => prev.map(
          (h) => h.id === activeChatId ? { ...h, messages: finalMessages, preview: `${reply.substring(0, 100)}...` } : h
        )
      );
    } catch (error) {
      const errorMsg = error instanceof Error && error.message === "NO_API_KEY" ? t("errorNoKey") : `${t("errorApi")} (${error instanceof Error ? error.message : "Unknown error"})`;
      const errorMsgObj = { role: "error", content: errorMsg };
      const finalMessages = [...visibleMessages, errorMsgObj];
      setCurrentMessages(finalMessages);
      updateHistoryMessages(activeChatId, finalMessages);
    } finally {
      setIsTyping(false);
    }
  };
  const handleRegenerateLast = async (assistantIndex) => {
    if (!activeChatId) return;
    const isLast = assistantIndex === currentMessages.length - 1;
    const target = currentMessages[assistantIndex];
    if (!isLast || !target || target.role !== "assistant") return;
    const baseMessages = currentMessages.slice(0, assistantIndex);
    const lastUser = [...baseMessages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setIsTyping(true);
    let visibleMessages = [...baseMessages];
    let searchResults;
    setCurrentMessages(visibleMessages);
    updateHistoryMessages(activeChatId, visibleMessages);
    if (webSearchEnabled && lastUser.content) {
      try {
        searchResults = await fetchSearchResults(lastUser.content);
        if (searchResults.length) {
          const sourcesMsg = { role: "sources", content: t("sources"), sources: searchResults };
          visibleMessages = [...visibleMessages, sourcesMsg];
          setCurrentMessages(visibleMessages);
          updateHistoryMessages(activeChatId, visibleMessages);
        }
      } catch {
        const searchError = { role: "error", content: t("webSearchError") };
        visibleMessages = [...visibleMessages, searchError];
        setCurrentMessages(visibleMessages);
        updateHistoryMessages(activeChatId, visibleMessages);
      }
    }
    try {
      const reply = await callOpenRouter(visibleMessages, currentModel.id, apiKey, systemPrompt, searchResults);
      const updatedMessages = [...visibleMessages, { role: "assistant", content: reply }];
      setCurrentMessages(updatedMessages);
      updateHistoryMessages(activeChatId, updatedMessages);
    } catch (error) {
      const errorMsg = error instanceof Error && error.message === "NO_API_KEY" ? t("errorNoKey") : `${t("errorApi")} (${error instanceof Error ? error.message : "Unknown error"})`;
      const errorMsgObj = { role: "error", content: errorMsg };
      const finalMessages = [...visibleMessages, errorMsgObj];
      setCurrentMessages(finalMessages);
      updateHistoryMessages(activeChatId, finalMessages);
    } finally {
      setIsTyping(false);
    }
  };
  const loadChat = (chatItem) => {
    setActiveChatId(chatItem.id);
    const messages = chatItem.messages?.length ? chatItem.messages : [{ role: "user", content: chatItem.title }];
    setCurrentMessages(messages);
    setViewState("chat");
    if (isBrowser && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  const handleDeleteHistoryItem = (id, e) => {
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
    setViewState("library");
  };
  const handleStartNewFromLibrary = () => {
    goToHome();
  };
  const handleAddModel = (newModel) => {
    setCustomModels((prev) => {
      if (prev.some((model) => model.id === newModel.id)) return prev;
      return [...prev, newModel];
    });
  };
  const handleDeleteModel = (id) => {
    setCustomModels((prev) => prev.filter((model) => model.id !== id));
  };
  const handleReorderModel = (index, direction) => {
    setCustomModels((prev) => {
      const updated = [...prev];
      if (direction === "up" && index > 0) {
        [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      } else if (direction === "down" && index < updated.length - 1) {
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      }
      return updated;
    });
  };
  const goToHome = () => {
    setViewState("home");
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
      case "home":
        return /* @__PURE__ */ jsx(
          HeroSection,
          {
            onSearch: handleInitialSearch,
            models: customModels,
            selectedModel: currentModel,
            setSelectedModel,
            webSearchEnabled,
            onToggleWebSearch: handleToggleWebSearch,
            t,
            theme
          }
        );
      case "chat":
        return /* @__PURE__ */ jsx(
          ChatSection,
          {
            messages: currentMessages,
            isTyping,
            selectedModel: currentModel,
            models: customModels,
            setSelectedModel,
            webSearchEnabled,
            onToggleWebSearch: handleToggleWebSearch,
            onRegenerateLast: handleRegenerateLast,
            onBack: goToHome,
            onFollowUp: handleFollowUp,
            t,
            theme,
            language
          }
        );
      case "library":
        return /* @__PURE__ */ jsx(
          LibrarySection,
          {
            history,
            onLoadChat: loadChat,
            onDelete: handleDeleteHistoryItem,
            onDeleteAll: handleDeleteAllHistory,
            onStartNew: handleStartNewFromLibrary,
            onBack: goToHome,
            t,
            theme
          }
        );
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex h-screen font-sans overflow-hidden transition-colors duration-300 ${theme === "dark" ? "bg-[#191919] text-[#e8e8e6] selection:bg-[#2dd4bf] selection:text-black" : "bg-[#f0f0f0] text-[#191919] selection:bg-[#2dd4bf] selection:text-white"}`,
      children: [
        /* @__PURE__ */ jsx(
          Sidebar,
          {
            isOpen: isSidebarOpen,
            toggle: () => setSidebarOpen(!isSidebarOpen),
            history,
            openSettings: () => setShowSettings(true),
            onLibraryClick: () => setViewState("library"),
            onHomeClick: goToHome,
            onLoadChat: loadChat,
            currentView: viewState,
            theme,
            t
          }
        ),
        !isSidebarOpen && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSidebarOpen(true),
            className: `fixed top-4 left-4 z-40 p-3 rounded-full shadow-lg border transition-colors ${theme === "dark" ? "bg-[#191919] border-[#2d2d2d] text-gray-200 hover:text-white hover:border-[#2dd4bf]/50" : "bg-white border-gray-200 text-gray-700 hover:text-black hover:border-[#2dd4bf]/50"}`,
            "aria-label": "Open sidebar",
            children: /* @__PURE__ */ jsx(PanelLeftOpen, { size: 20 })
          }
        ),
        /* @__PURE__ */ jsxs(
          "main",
          {
            className: `flex-1 flex flex-col relative transition-all duration-300 ${isSidebarOpen ? "ml-0 md:ml-0" : "ml-0"}`,
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `sticky top-0 z-20 flex items-center justify-between p-4 md:hidden ${theme === "dark" ? "bg-[#191919]" : "bg-[#f0f0f0]"}`,
                  children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setSidebarOpen(!isSidebarOpen),
                        className: `p-2 rounded-md ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10"}`,
                        children: /* @__PURE__ */ jsx(Menu, { size: 20 })
                      }
                    ),
                    /* @__PURE__ */ jsxs("span", { className: "font-semibold text-lg tracking-tight", children: [
                      "Perplexity",
                      /* @__PURE__ */ jsx("span", { className: "text-[#2dd4bf]", children: ".clone" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "w-8" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent", children: renderContent() })
            ]
          }
        ),
        showSettings && /* @__PURE__ */ jsx(
          SettingsModal,
          {
            close: () => setShowSettings(false),
            apiKey,
            setApiKey,
            systemPrompt,
            setSystemPrompt,
            models: customModels,
            addModel: handleAddModel,
            deleteModel: handleDeleteModel,
            reorderModel: handleReorderModel,
            theme,
            setTheme,
            language,
            setLanguage,
            t
          }
        ),
        showWebSearchInfo && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: `w-full max-w-2xl rounded-2xl shadow-2xl border p-6 space-y-4 ${theme === "dark" ? "bg-[#1f1f1f] border-[#2d2d2d] text-white" : "bg-white border-gray-200 text-gray-900"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: t("webSearchInfoTitle") }),
                  /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-3 text-sm leading-6", children: t("webSearchInfoBody").split("\n\n").map((paragraph, idx) => /* @__PURE__ */ jsx("p", { className: theme === "dark" ? "text-gray-300" : "text-gray-700", children: paragraph.includes("https://github.com/Lautaro005/PerplexRouter") ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    paragraph.split("https://github.com/Lautaro005/PerplexRouter")[0],
                    /* @__PURE__ */ jsx(
                      "a",
                      {
                        className: "text-[#2dd4bf] underline break-all",
                        href: "https://github.com/Lautaro005/PerplexRouter",
                        target: "_blank",
                        rel: "noreferrer",
                        children: "https://github.com/Lautaro005/PerplexRouter"
                      }
                    ),
                    paragraph.split("https://github.com/Lautaro005/PerplexRouter")[1]
                  ] }) : paragraph }, idx)) })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setShowWebSearchInfo(false),
                    className: `p-2 rounded-full ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-500 hover:text-black hover:bg-gray-100"}`,
                    "aria-label": t("cancel"),
                    children: /* @__PURE__ */ jsx(X, { size: 18 })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setShowWebSearchInfo(false),
                  className: "px-4 py-2 rounded-lg bg-[#2dd4bf] text-black font-medium hover:bg-[#25b5a3] transition-colors text-sm",
                  children: t("webSearchInfoOk")
                }
              ) })
            ]
          }
        ) })
      ]
    }
  );
};

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "PerplexRouter" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "App", App, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/VSCode/PerplexRouter/src/components/App", "client:component-export": "default" })} ` })}`;
}, "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/VSCode/PerplexRouter/src/pages/index.astro", void 0);

const $$file = "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/VSCode/PerplexRouter/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
