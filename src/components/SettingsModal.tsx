import { useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, Key, Moon, Plus, Sun, Trash2, X } from 'lucide-react';
import type { Language, ModelOption, Theme } from '../types/chat';
import type { Translator } from '../constants/translations';

type TabId = 'general' | 'models' | 'appearance';

interface SettingsModalProps {
  close: () => void;
  apiKey: string;
  setApiKey: (value: string) => void;
  models: ModelOption[];
  addModel: (model: ModelOption) => void;
  deleteModel: (id: string) => void;
  reorderModel: (index: number, direction: 'up' | 'down') => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translator;
}

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
  t
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [newModelId, setNewModelId] = useState('');
  const [newModelName, setNewModelName] = useState('');

  const handleAddModel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newModelId.trim() || !newModelName.trim()) return;
    addModel({ id: newModelId, name: newModelName });
    setNewModelId('');
    setNewModelName('');
  };

  const bgModal =
    theme === 'dark' ? 'bg-[#191919] border-[#333] text-white' : 'bg-white border-gray-200 text-gray-900';
  const sidebarBg =
    theme === 'dark' ? 'bg-[#1f1f1f] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200';
  const inputBg =
    theme === 'dark' ? 'bg-[#111] border-[#333] text-white' : 'bg-white border-gray-300 text-black';

  const TabButton = ({ id, label }: { id: TabId; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors 
        ${activeTab === id ? 'bg-[#2dd4bf]/10 text-[#2dd4bf]' : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh] overflow-hidden ${bgModal}`}>
        <div
          className={`flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'border-[#2d2d2d]' : 'border-gray-200'
          }`}
        >
          <h2 className="text-xl font-semibold">{t('settingsTitle')}</h2>
          <button onClick={close} className="text-gray-400 hover:text-[#2dd4bf] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className={`w-48 border-r p-4 space-y-2 hidden md:block ${sidebarBg}`}>
            <TabButton id="general" label={t('general')} />
            <TabButton id="models" label={t('models')} />
            <TabButton id="appearance" label={t('appearance')} />
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-1">{t('apiKeyTitle')}</h3>
                  <p className="text-sm text-gray-500 mb-4">{t('apiKeyDesc')}</p>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className={`w-full rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-[#2dd4bf] transition-colors font-mono text-sm ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'models' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-1">{t('modelManagement')}</h3>
                  <p className="text-sm text-gray-500 mb-4">{t('modelManagementDesc')}</p>

                  <form
                    onSubmit={handleAddModel}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 p-4 rounded-xl border ${
                      theme === 'dark' ? 'bg-[#111] border-[#2d2d2d]' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs text-gray-500 mb-1">{t('modelId')}</label>
                      <input
                        required
                        value={newModelId}
                        onChange={(e) => setNewModelId(e.target.value)}
                        placeholder="google/gemini-pro"
                        className={`w-full rounded px-3 py-2 text-sm focus:border-[#2dd4bf] outline-none font-mono ${inputBg}`}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs text-gray-500 mb-1">{t('modelName')}</label>
                      <div className="flex gap-2">
                        <input
                          required
                          value={newModelName}
                          onChange={(e) => setNewModelName(e.target.value)}
                          placeholder="Gemini Pro"
                          className={`flex-1 rounded px-3 py-2 text-sm focus:border-[#2dd4bf] outline-none ${inputBg}`}
                        />
                        <button
                          type="submit"
                          className="bg-[#2dd4bf] hover:bg-[#25b5a3] text-black p-2 rounded transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {models.map((model, idx) => (
                      <div
                        key={model.id}
                        className={`flex items-center justify-between p-3 rounded-lg border group ${
                          theme === 'dark'
                            ? 'bg-[#1f1f1f] border-[#2d2d2d] hover:border-[#444]'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium">{model.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{model.id}</div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => reorderModel(idx, 'up')}
                            disabled={idx === 0}
                            className={`p-1.5 rounded hover:bg-gray-700/50 ${
                              idx === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'
                            }`}
                            title="Mover arriba"
                          >
                            <ArrowUp size={16} />
                          </button>

                          <button
                            onClick={() => reorderModel(idx, 'down')}
                            disabled={idx === models.length - 1}
                            className={`p-1.5 rounded hover:bg-gray-700/50 ${
                              idx === models.length - 1
                                ? 'text-gray-600 cursor-not-allowed'
                                : 'text-gray-400 hover:text-white'
                            }`}
                            title="Mover abajo"
                          >
                            <ArrowDown size={16} />
                          </button>

                          <button
                            onClick={() => deleteModel(model.id)}
                            className="text-gray-500 hover:text-red-500 p-2 ml-2 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('themeTitle')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                        theme === 'dark' ? 'border-[#2dd4bf] bg-[#222]' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <Moon
                        size={32}
                        className={`mb-3 ${theme === 'dark' ? 'text-[#2dd4bf]' : 'text-gray-500'}`}
                      />
                      <span
                        className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}
                      >
                        {t('darkMode')}
                      </span>
                    </button>

                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                        theme === 'light'
                          ? 'border-[#2dd4bf] bg-white'
                          : 'border-[#333] bg-[#111] hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <Sun
                        size={32}
                        className={`mb-3 ${theme === 'light' ? 'text-orange-500' : 'text-gray-500'}`}
                      />
                      <span
                        className={`text-sm font-medium ${theme === 'light' ? 'text-black' : 'text-gray-400'}`}
                      >
                        {t('lightMode')}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">{t('languageTitle')}</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setLanguage('es')}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        language === 'es'
                          ? 'bg-[#2dd4bf]/10 border-[#2dd4bf]'
                          : theme === 'dark'
                            ? 'bg-[#111] border-[#333] hover:border-gray-500'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🇪🇸</span>
                        <div className="text-left">
                          <div
                            className={`font-medium ${
                              language === 'es'
                                ? 'text-[#2dd4bf]'
                                : theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-800'
                            }`}
                          >
                            Español
                          </div>
                          <div className="text-xs text-gray-500">{t('defaultLang')}</div>
                        </div>
                      </div>
                      {language === 'es' && <div className="w-3 h-3 bg-[#2dd4bf] rounded-full" />}
                    </button>

                    <button
                      onClick={() => setLanguage('en')}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        language === 'en'
                          ? 'bg-[#2dd4bf]/10 border-[#2dd4bf]'
                          : theme === 'dark'
                            ? 'bg-[#111] border-[#333] hover:border-gray-500'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🇺🇸</span>
                        <div className="text-left">
                          <div
                            className={`font-medium ${
                              language === 'en'
                                ? 'text-[#2dd4bf]'
                                : theme === 'dark'
                                  ? 'text-gray-300'
                                  : 'text-gray-800'
                            }`}
                          >
                            English
                          </div>
                          <div className="text-xs text-gray-500">{t('interfaceLang')}</div>
                        </div>
                      </div>
                      {language === 'en' && <div className="w-3 h-3 bg-[#2dd4bf] rounded-full" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`p-4 border-t flex justify-end ${
            theme === 'dark' ? 'border-[#2d2d2d] bg-[#1f1f1f]' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <button
            onClick={close}
            className="px-4 py-2 bg-[#2dd4bf] hover:bg-[#25b5a3] text-black font-medium rounded-lg transition-colors text-sm"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
