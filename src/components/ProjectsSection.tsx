import { Plus, Lock, Shield } from 'lucide-react';
import type { Project, Theme } from '../types/chat';
import type { Translator } from '../constants/translations';

interface ProjectsSectionProps {
  projects: Project[];
  theme: Theme;
  t: Translator;
  onAdd: () => void;
  onOpen: (projectId: number) => void;
}

const ProjectsSection = ({ projects, theme, t, onAdd, onOpen }: ProjectsSectionProps) => {
  const cardBase =
    theme === 'dark'
      ? 'bg-white/5 border border-white/10 hover:border-[#2dd4bf]/40'
      : 'bg-white border border-gray-200 hover:border-[#0f766e]/30 hover:shadow-md';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t('projectListTitle')}</h1>
        <button
          onClick={onAdd}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-[#2dd4bf]/15 text-[#2dd4bf] hover:bg-[#2dd4bf]/25'
              : 'bg-[#0f766e]/10 text-[#0f766e] hover:bg-[#0f766e]/20'
          }`}
        >
          <Plus size={16} />
          {t('addProject')}
        </button>
      </div>

      {projects.length === 0 ? (
        <div
          className={`w-full rounded-xl border p-6 text-sm ${
            theme === 'dark'
              ? 'border-white/10 bg-white/5 text-gray-300'
              : 'border-dashed border-gray-300 text-gray-600 bg-white'
          }`}
        >
          {t('projectEmpty')}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onOpen(project.id)}
              className={`rounded-xl p-4 text-left transition-transform hover:-translate-y-0.5 ${cardBase}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{project.icon || '📁'}</span>
                <Shield size={14} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              <div className="mt-3 font-semibold text-base truncate">{project.title}</div>
              <div className="mt-2 text-xs flex items-center gap-2 text-gray-500">
                <Lock size={12} />
                <span>{project.chats.length || 0} chats</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
