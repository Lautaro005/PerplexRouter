import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Project, Theme } from '../types/chat';
import type { Translator } from '../constants/translations';

interface ProjectModalProps {
  theme: Theme;
  t: Translator;
  onClose: () => void;
  onSubmit: (data: { title: string; icon: string; aiPrompt: string }) => void;
  initial?: Project | null;
}

const ProjectModal = ({ theme, t, onClose, onSubmit, initial }: ProjectModalProps) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [icon, setIcon] = useState(initial?.icon || '');
  const [aiPrompt, setAiPrompt] = useState(initial?.aiPrompt || '');

  useEffect(() => {
    setTitle(initial?.title || '');
    setIcon(initial?.icon || '');
    setAiPrompt(initial?.aiPrompt || '');
  }, [initial]);

  const emojiOptions = [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '🥰',
    '😍',
    '🤩',
    '😘',
    '😗',
    '😙',
    '😚',
    '😋',
    '😛',
    '😜',
    '🤪',
    '😝',
    '🤑',
    '🤗',
    '🤭',
    '🫢',
    '🤫',
    '🤔',
    '🤐',
    '🤨',
    '😐',
    '😑',
    '😶',
    '🫥',
    '😶‍🌫️',
    '😏',
    '😒',
    '🙄',
    '😬',
    '😮‍💨',
    '🤥',
    '😌',
    '😔',
    '😪',
    '🤤',
    '😴',
    '🥱',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤮',
    '🤧',
    '🥵',
    '🥶',
    '😵',
    '🤯',
    '🤠',
    '🥳',
    '😎',
    '🤓',
    '🧐',
    '😕',
    '🫤',
    '😟',
    '🙁',
    '☹️',
    '😮',
    '😯',
    '😲',
    '🥺',
    '😳',
    '😦',
    '😧',
    '😨',
    '😰',
    '😥',
    '😢',
    '😭',
    '😱',
    '😖',
    '😣',
    '😞',
    '😓',
    '😩',
    '😫',
    '🫠',
    '🤡',
    '💩',
    '👻',
    '👾',
    '🤖',
    '🎯',
    '📌',
    '🚀',
    '💡',
    '🧠',
    '📚'
  ];
  const [emojiOpen, setEmojiOpen] = useState(false);

  const labelClass = `text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;
  const inputBase =
    theme === 'dark'
      ? 'bg-[#1f1f1f] border-[#2d2d2d] text-white placeholder-gray-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border p-6 space-y-5 ${
          theme === 'dark'
            ? 'bg-[#1f1f1f] border-[#2d2d2d] text-white'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {initial ? t('editProject') : t('addProject')}
          </h3>
          <button
            onClick={onClose}
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

        <div className="space-y-4">
          <div className="space-y-2">
            <label className={labelClass}>{t('projectTitle')}</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('projectTitle')}
              className={`w-full rounded-lg border px-3 py-2 outline-none ${inputBase}`}
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('projectIcon')}</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setEmojiOpen(true)}
                className={`w-14 h-14 rounded-full border flex items-center justify-center text-2xl transition-all ${
                  theme === 'dark'
                    ? 'border-[#2d2d2d] bg-white/5 text-white hover:border-[#2dd4bf]/60 hover:bg-white/10'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-[#0f766e]/30 hover:bg-[#0f766e]/5'
                }`}
                aria-label={t('selectIcon')}
              >
                {icon ? (
                  <span role="img" aria-label="project-icon">
                    {icon}
                  </span>
                ) : (
                  <Plus size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('projectPrompt')}</label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={4}
              placeholder={t('projectPrompt')}
              className={`w-full rounded-lg border px-3 py-2 outline-none resize-none ${inputBase}`}
            />
          </div>
        </div>

        {emojiOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20" onClick={() => setEmojiOpen(false)} />
            <div
              className={`relative w-[340px] sm:w-[420px] max-h-[480px] rounded-3xl border shadow-2xl overflow-hidden ${
                theme === 'dark'
                  ? 'bg-[#1f1f1f] border-[#2d2d2d] text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div
                className={`flex items-center justify-between px-5 py-4 border-b ${
                  theme === 'dark' ? 'border-[#2d2d2d]' : 'border-gray-100'
                }`}
              >
                <h4 className="text-lg font-semibold">{t('selectIcon')}</h4>
                <button
                  onClick={() => setEmojiOpen(false)}
                  className={`p-2 rounded-full ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-500 hover:text-black hover:bg-gray-100'
                  }`}
                  aria-label={t('cancel')}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[420px] grid grid-cols-7 gap-3">
                {emojiOptions.map((emo) => (
                  <button
                    key={emo}
                    type="button"
                    className={`flex items-center justify-center w-10 h-10 rounded-lg text-2xl transition hover:scale-105 ${
                      theme === 'dark'
                        ? 'hover:bg-white/5 focus-visible:bg-white/10'
                        : 'hover:bg-gray-100 focus-visible:bg-gray-100'
                    }`}
                    onClick={() => {
                      setIcon(emo);
                      setEmojiOpen(false);
                    }}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-white/5'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => onSubmit({ title, icon, aiPrompt })}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2dd4bf] text-black hover:bg-[#25b5a3]"
          >
            {initial ? t('save') : t('create')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
