import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';
import ProjectSelector from '../shared/ProjectSelector';
import RAGChatPanel from '../rag/RAGChatPanel';
import { useProjects } from '../../src/hooks/useApi';

const AIChatPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { data: projects } = useProjects();

  const selectedProject = projects?.find(p => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.nav.aiChat')}</h1>
          <p className="text-slate-600 mt-1">
            Ställ frågor om ditt projekt och få hjälp av vår AI-assistent
          </p>
        </div>
        <div className="w-full sm:w-64">
          <ProjectSelector
            value={selectedProjectId}
            onChange={setSelectedProjectId}
          />
        </div>
      </div>

      {selectedProjectId ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[600px]">
          <RAGChatPanel
            projectId={selectedProjectId}
            projectName={selectedProject?.name}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Välj ett projekt
          </h3>
          <p className="text-slate-500">
            Välj ett projekt ovan för att börja chatta med AI-assistenten
          </p>
        </div>
      )}
    </div>
  );
};

export default AIChatPage;
