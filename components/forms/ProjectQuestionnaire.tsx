/**
 * ProjectQuestionnaire
 *
 * A wrapper component that integrates DynamicProjectForm with the project workflow.
 * Handles loading existing form responses, saving drafts, and submitting the form.
 */

import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, CheckCircle } from 'lucide-react';
import DynamicProjectForm from './DynamicProjectForm';
import { useProjectFormResponses, useSubmitProject } from '../../src/hooks/useApi';
import { FormType } from '../../src/config/formSchema';

interface ProjectQuestionnaireProps {
  projectId: string;
  projectState: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

const ProjectQuestionnaire: React.FC<ProjectQuestionnaireProps> = ({
  projectId,
  projectState,
  onComplete,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { formValues, responses, isLoading, saveAnswer, isSaving } = useProjectFormResponses(projectId);
  const submitProject = useSubmitProject();

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Determine the form type from existing responses
  const existingFormType = useMemo(() => {
    if (!responses || responses.length === 0) return undefined;
    const firstResponse = responses[0];
    return firstResponse?.formType as FormType | undefined;
  }, [responses]);

  // Handle saving form as draft
  const handleSave = useCallback(
    async (formType: FormType, values: Record<string, string | string[]>) => {
      const answers = Object.entries(values).map(([key, value]) => {
        // Find the section for this key from responses or schema
        const existingResponse = responses?.find((r) => r.questionKey === key);
        const section = existingResponse?.section || 'unknown';
        return { section, questionKey: key, value };
      });

      // Save each answer
      for (const answer of answers) {
        if (answer.value !== undefined && answer.value !== '' &&
            (typeof answer.value !== 'object' || (answer.value as string[]).length > 0)) {
          await saveAnswer(formType, answer.section, answer.questionKey, answer.value);
        }
      }
    },
    [responses, saveAnswer]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (formType: FormType, values: Record<string, string | string[]>) => {
      // First save all values
      await handleSave(formType, values);

      // Then submit the project for review (transition from draft to pending_approval)
      if (projectState === 'draft') {
        await submitProject.mutateAsync(projectId);
      }

      setIsSubmitted(true);

      // Call onComplete after a delay to show success message
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    },
    [handleSave, projectState, projectId, submitProject, onComplete]
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">{t('dashboard.nav.overview')}...</p>
        </div>
      </div>
    );
  }

  // Show success message after submission
  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {t('projectForm.confirmation.title')}
          </h2>
          <p className="text-slate-600 mb-6">
            {t('projectForm.confirmation.message')}
          </p>
          <button
            onClick={onComplete}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('projectForm.confirmation.backToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  // Check if project is still in a state where form can be edited
  const isEditable = projectState === 'draft';

  if (!isEditable) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Formuläret kan inte redigeras
          </h3>
          <p className="text-amber-700">
            Projektet har redan skickats in och formuläret kan inte längre ändras.
          </p>
          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
            >
              Tillbaka
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <DynamicProjectForm
      projectId={projectId}
      initialFormType={existingFormType}
      initialValues={formValues}
      onSave={handleSave}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};

export default ProjectQuestionnaire;
