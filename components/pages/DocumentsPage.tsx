import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import { useProjects } from '../../src/hooks/useApi';
import ProjectSelector from '../shared/ProjectSelector';
import DocumentList from '../shared/DocumentList';
import { isAdmin, isKAM, isProjectLeader } from '../../utils/roleHelpers';

const DocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Fetch projects based on role
  const { data: projects = [], isLoading, error } = useProjects(
    user?.companyId && !isAdmin(user.role) && !isKAM(user.role) && !isProjectLeader(user.role)
      ? { companyId: user.companyId }
      : undefined
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error instanceof Error ? error.message : t('errors.loadFailed', 'Kunde inte ladda data')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('pages.documents.title', 'Dokument')}</h1>
        <p className="text-slate-600 mt-1">{t('pages.documents.subtitle', 'Hantera projektdokument och filer')}</p>
      </div>

      {/* Project Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('pages.documents.selectProject', 'Välj projekt')}
        </label>
        <ProjectSelector
          value={selectedProjectId}
          onChange={setSelectedProjectId}
          className="max-w-md"
        />
      </div>

      {/* Documents */}
      {selectedProjectId ? (
        <DocumentList
          projectId={selectedProjectId}
          showUploadButton={true}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {t('pages.documents.noProjectSelected', 'Välj ett projekt')}
          </h3>
          <p className="text-slate-500">
            {t('pages.documents.selectProjectHint', 'Välj ett projekt ovan för att se och hantera dess dokument')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
