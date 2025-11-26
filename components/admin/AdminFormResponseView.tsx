import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Globe,
  Server,
  Layers,
  ChevronRight,
  ChevronDown,
  Calendar,
  Building2,
  Eye,
  X,
  Check,
  Star,
  StickyNote,
  Plus,
  Trash2,
  Loader2,
  Send,
} from 'lucide-react';
import {
  useAllFormResponses,
  useProjects,
  useCompanies,
  useToggleProjectPriority,
  useInternalNotes,
  useCreateInternalNote,
  useDeleteInternalNote,
} from '../../src/hooks/useApi';
import { getFormSchema, websiteFormSchema, systemFormSchema } from '../../src/config/formSchema';

interface FormResponseGroup {
  projectId: string;
  projectName: string;
  companyName: string;
  formType: 'website' | 'system' | 'both';
  isPriority: boolean;
  responses: Array<{
    id: string;
    section: string;
    questionKey: string;
    answerValue: Record<string, unknown>;
    answerMetadata?: Record<string, unknown>;
    insertedAt?: string;
    updatedAt?: string;
  }>;
  lastUpdated: string;
  totalQuestions: number;
  answeredQuestions: number;
}

const AdminFormResponseView: React.FC = () => {
  const { t } = useTranslation();
  const { data: formResponses = [], isLoading: loadingResponses } = useAllFormResponses();
  const { data: projects = [], isLoading: loadingProjects } = useProjects();
  const { data: companies = [], isLoading: loadingCompanies } = useCompanies();
  const togglePriority = useToggleProjectPriority();

  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<FormResponseGroup | null>(null);

  // Group responses by project
  const groupedResponses = useMemo(() => {
    const groups: Record<string, FormResponseGroup> = {};

    formResponses.forEach((response: any) => {
      const projectId = response.projectId;
      if (!projectId) return;

      if (!groups[projectId]) {
        const project = projects.find((p: any) => p.id === projectId);
        const company = companies.find((c: any) => c.id === project?.companyId);

        groups[projectId] = {
          projectId,
          projectName: project?.name || 'Okänt projekt',
          companyName: company?.name || 'Okänt företag',
          formType: response.formType || 'website',
          isPriority: project?.isPriority || false,
          responses: [],
          lastUpdated: response.updatedAt || response.insertedAt || '',
          totalQuestions: 0,
          answeredQuestions: 0,
        };
      }

      groups[projectId].responses.push({
        id: response.id,
        section: response.section,
        questionKey: response.questionKey,
        answerValue: response.answerValue,
        answerMetadata: response.answerMetadata,
        insertedAt: response.insertedAt,
        updatedAt: response.updatedAt,
      });

      // Update last updated
      const responseDate = response.updatedAt || response.insertedAt;
      if (responseDate && responseDate > groups[projectId].lastUpdated) {
        groups[projectId].lastUpdated = responseDate;
      }
    });

    // Calculate total and answered questions for each group
    Object.values(groups).forEach((group) => {
      const schema = getFormSchema(group.formType);
      if (schema) {
        group.totalQuestions = schema.sections.reduce(
          (acc, section) => acc + section.fields.length,
          0
        );
        group.answeredQuestions = group.responses.filter(
          (r) => r.answerValue && Object.keys(r.answerValue).length > 0
        ).length;
      }
    });

    // Sort: priority first, then by last updated
    return Object.values(groups).sort((a, b) => {
      // Priority items first
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      // Then by date
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
  }, [formResponses, projects, companies]);

  const isLoading = loadingResponses || loadingProjects || loadingCompanies;

  const getFormTypeIcon = (formType: string) => {
    switch (formType) {
      case 'website':
        return <Globe className="w-5 h-5 text-blue-500" />;
      case 'system':
        return <Server className="w-5 h-5 text-emerald-500" />;
      case 'both':
        return <Layers className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const getFormTypeLabel = (formType: string) => {
    switch (formType) {
      case 'website':
        return t('admin.formResponses.types.website');
      case 'system':
        return t('admin.formResponses.types.system');
      case 'both':
        return t('admin.formResponses.types.both');
      default:
        return formType;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProgressColor = (answered: number, total: number) => {
    const percentage = total > 0 ? (answered / total) * 100 : 0;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-slate-300';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="ml-3 text-slate-600">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (groupedResponses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          {t('admin.formResponses.empty.title')}
        </h3>
        <p className="text-slate-500">
          {t('admin.formResponses.empty.message')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('admin.formResponses.title')}
            </h2>
            <p className="text-slate-500 mt-1">
              {t('admin.formResponses.subtitle', { count: groupedResponses.length })}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              {t('admin.formResponses.types.website')}
            </span>
            <span className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-500" />
              {t('admin.formResponses.types.system')}
            </span>
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              {t('admin.formResponses.types.both')}
            </span>
          </div>
        </div>
      </div>

      {/* Response list */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-200">
        {groupedResponses.map((group) => (
          <div key={group.projectId} className="hover:bg-slate-50 transition-colors">
            {/* Main row */}
            <div
              className="p-4 cursor-pointer"
              onClick={() =>
                setExpandedProject(
                  expandedProject === group.projectId ? null : group.projectId
                )
              }
            >
              <div className="flex items-center gap-4">
                {/* Expand icon */}
                <div className="text-slate-400">
                  {expandedProject === group.projectId ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </div>

                {/* Form type icon */}
                {getFormTypeIcon(group.formType)}

                {/* Project info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate flex items-center gap-2">
                    {group.projectName}
                    {group.isPriority && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {t('admin.formResponses.priority.isPriority')}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {group.companyName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(group.lastUpdated)}
                    </span>
                  </div>
                </div>

                {/* Form type badge */}
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                  {getFormTypeLabel(group.formType)}
                </span>

                {/* Progress */}
                <div className="w-32">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{group.answeredQuestions}/{group.totalQuestions}</span>
                    <span>
                      {group.totalQuestions > 0
                        ? Math.round((group.answeredQuestions / group.totalQuestions) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${getProgressColor(
                        group.answeredQuestions,
                        group.totalQuestions
                      )}`}
                      style={{
                        width: `${
                          group.totalQuestions > 0
                            ? (group.answeredQuestions / group.totalQuestions) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Priority toggle button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePriority.mutate(group.projectId);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    group.isPriority
                      ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                      : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                  }`}
                  title={
                    group.isPriority
                      ? t('admin.formResponses.priority.removePriority')
                      : t('admin.formResponses.priority.markAsPriority')
                  }
                  disabled={togglePriority.isPending}
                >
                  {togglePriority.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Star className={`w-5 h-5 ${group.isPriority ? 'fill-current' : ''}`} />
                  )}
                </button>

                {/* View button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedResponse(group);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={t('admin.formResponses.viewDetails')}
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expanded section preview */}
            {expandedProject === group.projectId && (
              <div className="px-4 pb-4">
                <div className="ml-14 bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-700 mb-3">
                    {t('admin.formResponses.sectionOverview')}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {getSectionSummary(group).map((section) => (
                      <div
                        key={section.key}
                        className="bg-white rounded-lg p-3 border border-slate-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-700 truncate">
                            {section.name}
                          </span>
                          {section.complete ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <span className="text-xs text-slate-400">
                              {section.answered}/{section.total}
                            </span>
                          )}
                        </div>
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              section.complete ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{
                              width: `${
                                section.total > 0
                                  ? (section.answered / section.total) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedResponse && (
        <FormResponseDetailModal
          group={selectedResponse}
          onClose={() => setSelectedResponse(null)}
          t={t}
        />
      )}
    </div>
  );
};

// Helper function to get section summary
function getSectionSummary(group: FormResponseGroup) {
  const schema = getFormSchema(group.formType);
  if (!schema) return [];

  return schema.sections.map((section) => {
    const sectionResponses = group.responses.filter((r) => r.section === section.key);
    const answeredCount = sectionResponses.filter(
      (r) => r.answerValue && Object.keys(r.answerValue).length > 0
    ).length;

    return {
      key: section.key,
      name: section.key, // Will be translated in the component
      total: section.fields.length,
      answered: answeredCount,
      complete: answeredCount >= section.fields.length,
    };
  });
}

// Detail Modal Component
interface FormResponseDetailModalProps {
  group: FormResponseGroup;
  onClose: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
}

const FormResponseDetailModal: React.FC<FormResponseDetailModalProps> = ({
  group,
  onClose,
  t,
}) => {
  const schema = getFormSchema(group.formType);
  const { data: internalNotes = [], isLoading: loadingNotes } = useInternalNotes({ projectId: group.projectId });
  const createNote = useCreateInternalNote();
  const deleteNote = useDeleteInternalNote();
  const [newNote, setNewNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  const getTranslationPath = (sectionKey: string, fieldKey: string, subKey?: string) => {
    const formTypeKey = group.formType === 'system' ? 'system' : 'website';
    const base = `projectForm.${formTypeKey}.${sectionKey}.${fieldKey}`;
    return subKey ? `${base}.${subKey}` : base;
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;
    await createNote.mutateAsync({
      content: newNote.trim(),
      projectId: group.projectId,
    });
    setNewNote('');
    setShowNoteForm(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm(t('admin.formResponses.internalNotes.confirmDelete'))) {
      await deleteNote.mutateAsync({
        id: noteId,
        projectId: group.projectId,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {group.projectName}
                {group.isPriority && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {t('admin.formResponses.priority.isPriority')}
                  </span>
                )}
              </h2>
              <p className="text-slate-500">{group.companyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {schema?.sections.map((section) => {
            const sectionResponses = group.responses.filter((r) => r.section === section.key);

            return (
              <div key={section.key} className="mb-8 last:mb-0">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  {t(
                    group.formType === 'system'
                      ? `projectForm.system.sections.${section.key}`
                      : `projectForm.sections.${section.key}`
                  )}
                </h3>

                <div className="bg-slate-50 rounded-lg divide-y divide-slate-200">
                  {section.fields.map((field) => {
                    const response = sectionResponses.find(
                      (r) => r.questionKey === field.key
                    );
                    const value = response?.answerValue;
                    const displayValue = formatAnswerValue(value, field, t, getTranslationPath(section.key, field.key));

                    return (
                      <div key={field.key} className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-slate-700">
                              {t(getTranslationPath(section.key, field.key, 'label'))}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </span>
                          </div>
                          <div className="flex-1 text-right">
                            {displayValue ? (
                              <span className="text-slate-900">{displayValue}</span>
                            ) : (
                              <span className="text-slate-400 italic">
                                {t('admin.formResponses.noAnswer')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Internal Notes Section */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-amber-500" />
                {t('admin.formResponses.internalNotes.title')}
              </h3>
              {!showNoteForm && (
                <button
                  onClick={() => setShowNoteForm(true)}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  {t('admin.formResponses.internalNotes.add')}
                </button>
              )}
            </div>

            {/* Note Form */}
            {showNoteForm && (
              <div className="mb-4 bg-amber-50 rounded-lg p-4 border border-amber-200">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={t('admin.formResponses.internalNotes.placeholder')}
                  className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => {
                      setShowNoteForm(false);
                      setNewNote('');
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {t('admin.formResponses.internalNotes.cancel')}
                  </button>
                  <button
                    onClick={handleCreateNote}
                    disabled={!newNote.trim() || createNote.isPending}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {createNote.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {t('admin.formResponses.internalNotes.save')}
                  </button>
                </div>
              </div>
            )}

            {/* Notes List */}
            {loadingNotes ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
            ) : internalNotes.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <StickyNote className="w-8 h-8 mx-auto mb-2" />
                <p>{t('admin.formResponses.internalNotes.empty')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {internalNotes.map((note: any) => (
                  <div
                    key={note.id}
                    className="bg-amber-50 rounded-lg p-4 border border-amber-200"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-slate-700 flex-1 whitespace-pre-wrap">{note.content}</p>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title={t('admin.formResponses.internalNotes.delete')}
                        disabled={deleteNote.isPending}
                      >
                        {deleteNote.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {formatDateFull(note.insertedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-500">
              {t('admin.formResponses.lastUpdated')}: {formatDateFull(group.lastUpdated)}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to format answer value for display
function formatAnswerValue(
  value: Record<string, unknown> | undefined,
  field: any,
  t: (key: string) => string,
  translationPath: string
): string {
  if (!value || Object.keys(value).length === 0) return '';

  const answer = Object.values(value)[0];

  if (Array.isArray(answer)) {
    return answer
      .map((v) => {
        const optionKey = `${translationPath}.options.${v}`;
        const translated = t(optionKey);
        return translated !== optionKey ? translated : v;
      })
      .join(', ');
  }

  if (field.options && typeof answer === 'string') {
    const optionKey = `${translationPath}.options.${answer}`;
    const translated = t(optionKey);
    return translated !== optionKey ? translated : answer;
  }

  return String(answer);
}

function formatDateFull(dateString: string) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default AdminFormResponseView;
