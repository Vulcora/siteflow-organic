import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import ProjectSelector from '../shared/ProjectSelector';
import GeneratedDocuments from '../rag/GeneratedDocuments';

const AIDocsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.nav.aiDocs')}</h1>
          <p className="text-slate-600 mt-1">
            AI-genererade dokument för projektet
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
        <GeneratedDocuments projectId={selectedProjectId} />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Välj ett projekt
          </h3>
          <p className="text-slate-500">
            Välj ett projekt ovan för att se AI-genererade dokument
          </p>
        </div>
      )}
    </div>
  );
};

export default AIDocsPage;
