/**
 * ProjectFormPage
 *
 * Dashboard page for filling out the project questionnaire.
 * Accessible to customers when their project is in draft state.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText } from 'lucide-react';
import ProjectQuestionnaire from '../forms/ProjectQuestionnaire';

interface ProjectFormPageProps {
  projectId: string;
  projectName: string;
  projectState: string;
  onBack: () => void;
}

const ProjectFormPage: React.FC<ProjectFormPageProps> = ({
  projectId,
  projectName,
  projectState,
  onBack,
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Tillbaka</span>
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="font-semibold text-slate-900">{projectName}</h1>
                  <p className="text-sm text-slate-500">{t('projectForm.title')}</p>
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${projectState === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}
              `}>
                {projectState === 'draft' ? 'Utkast' : 'Inskickat'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectQuestionnaire
          projectId={projectId}
          projectState={projectState}
          onComplete={onBack}
          onCancel={onBack}
        />
      </div>
    </div>
  );
};

export default ProjectFormPage;
