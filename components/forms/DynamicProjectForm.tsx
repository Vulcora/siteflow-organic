import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Check,
  Globe,
  Server,
  Layers,
} from 'lucide-react';
import {
  FormType,
  FormSchema,
  FormSection,
  FormField,
  getFormSchema,
  websiteFormSchema,
  systemFormSchema,
} from '../../src/config/formSchema';

interface FormValues {
  [key: string]: string | string[];
}

interface DynamicProjectFormProps {
  projectId: string;
  initialFormType?: FormType;
  initialValues?: FormValues;
  onSave?: (formType: FormType, values: FormValues) => Promise<void>;
  onSubmit?: (formType: FormType, values: FormValues) => Promise<void>;
  onCancel?: () => void;
}

const DynamicProjectForm: React.FC<DynamicProjectFormProps> = ({
  projectId,
  initialFormType,
  initialValues = {},
  onSave,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  // State
  const [formType, setFormType] = useState<FormType | null>(initialFormType || null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get the active schema based on form type
  const schema = useMemo(() => {
    if (!formType) return null;
    return getFormSchema(formType);
  }, [formType]);

  const sections = schema?.sections || [];
  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;
  const progress = totalSections > 0 ? ((currentSectionIndex + 1) / totalSections) * 100 : 0;

  // Get translation path for current form type
  const getTranslationPath = useCallback(
    (sectionKey: string, fieldKey: string, subKey?: string) => {
      const formTypeKey = formType === 'system' ? 'system' : 'website';
      const base = `projectForm.${formTypeKey}.${sectionKey}.${fieldKey}`;
      return subKey ? `${base}.${subKey}` : base;
    },
    [formType]
  );

  // Check if a field should be visible based on dependencies
  const isFieldVisible = useCallback(
    (field: FormField): boolean => {
      if (!field.dependsOn) return true;
      const dependentValue = values[field.dependsOn.field];
      if (Array.isArray(field.dependsOn.value)) {
        return field.dependsOn.value.includes(dependentValue as string);
      }
      return dependentValue === field.dependsOn.value;
    },
    [values]
  );

  // Handle value changes
  const handleChange = useCallback(
    (fieldKey: string, value: string | string[]) => {
      setValues((prev) => ({ ...prev, [fieldKey]: value }));
      // Clear error when user starts typing
      if (errors[fieldKey]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldKey];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Validate current section
  const validateSection = useCallback((): boolean => {
    if (!currentSection) return true;

    const newErrors: Record<string, string> = {};

    currentSection.fields.forEach((field) => {
      if (!isFieldVisible(field)) return;

      if (field.required) {
        const value = values[field.key];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.key] = t('projectForm.validation.required');
        }
      }

      // Email validation
      if (field.type === 'email' && values[field.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values[field.key] as string)) {
          newErrors[field.key] = t('projectForm.validation.email');
        }
      }

      // URL validation
      if (field.type === 'url' && values[field.key]) {
        try {
          new URL(values[field.key] as string);
        } catch {
          newErrors[field.key] = t('projectForm.validation.url');
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentSection, values, isFieldVisible, t]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!validateSection()) return;

    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    } else {
      setShowReview(true);
    }
  }, [currentSectionIndex, totalSections, validateSection]);

  const handlePrevious = useCallback(() => {
    if (showReview) {
      setShowReview(false);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  }, [currentSectionIndex, showReview]);

  const handleGoToSection = useCallback((index: number) => {
    setShowReview(false);
    setCurrentSectionIndex(index);
  }, []);

  // Save draft
  const handleSave = useCallback(async () => {
    if (!formType || !onSave) return;

    setIsSaving(true);
    try {
      await onSave(formType, values);
    } finally {
      setIsSaving(false);
    }
  }, [formType, values, onSave]);

  // Submit form
  const handleSubmit = useCallback(async () => {
    if (!formType || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formType, values);
      setIsSubmitted(true);
    } catch (error) {
      // Error will be handled by parent component
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formType, values, onSubmit]);

  // Render success/confirmation screen
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t('projectForm.confirmation.title')}
        </h2>
        <p className="text-slate-600 mb-6">
          {t('projectForm.confirmation.message')}
        </p>
        <div className="bg-slate-50 rounded-xl p-6 mb-6 text-left">
          <h3 className="font-semibold text-slate-900 mb-4">
            {t('projectForm.confirmation.nextSteps')}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                1
              </span>
              <span className="text-slate-600">{t('projectForm.confirmation.step1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                2
              </span>
              <span className="text-slate-600">{t('projectForm.confirmation.step2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                3
              </span>
              <span className="text-slate-600">{t('projectForm.confirmation.step3')}</span>
            </li>
          </ul>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          {t('projectForm.confirmation.referenceId')}: <span className="font-mono font-medium">{projectId}</span>
        </p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('projectForm.confirmation.backToDashboard')}
          </button>
        )}
      </div>
    );
  }

  // Render form type selection
  if (!formType) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t('projectForm.title')}
        </h2>
        <p className="text-slate-600 mb-8">
          {t('projectForm.subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setFormType('website')}
            className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <Globe className="w-10 h-10 text-blue-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-slate-900 mb-2">
              {t('projectForm.formTypes.website')}
            </h3>
            <p className="text-sm text-slate-500">
              {websiteFormSchema.sections.length} {t('projectForm.progress.step').toLowerCase()}
            </p>
          </button>

          <button
            onClick={() => setFormType('system')}
            className="p-6 border-2 border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
          >
            <Server className="w-10 h-10 text-emerald-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-slate-900 mb-2">
              {t('projectForm.formTypes.system')}
            </h3>
            <p className="text-sm text-slate-500">
              {systemFormSchema.sections.length} {t('projectForm.progress.step').toLowerCase()}
            </p>
          </button>

          <button
            onClick={() => setFormType('both')}
            className="p-6 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <Layers className="w-10 h-10 text-purple-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-slate-900 mb-2">
              {t('projectForm.formTypes.both')}
            </h3>
            <p className="text-sm text-slate-500">
              {websiteFormSchema.sections.length + systemFormSchema.sections.length}{' '}
              {t('projectForm.progress.step').toLowerCase()}
            </p>
          </button>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-6 text-slate-500 hover:text-slate-700 text-sm"
          >
            {t('projectForm.actions.previous')}
          </button>
        )}
      </div>
    );
  }

  // Render review screen
  if (showReview) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {t('projectForm.review.title')}
        </h2>
        <p className="text-slate-600 mb-8">
          {t('projectForm.review.subtitle')}
        </p>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.key} className="bg-slate-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900">
                  {t(
                    formType === 'system'
                      ? `projectForm.system.sections.${section.key}`
                      : `projectForm.sections.${section.key}`
                  )}
                </h3>
                <button
                  onClick={() => handleGoToSection(index)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {t('projectForm.review.edit')}
                </button>
              </div>

              <div className="space-y-3">
                {section.fields
                  .filter((field) => isFieldVisible(field))
                  .map((field) => {
                    const value = values[field.key];
                    const displayValue = Array.isArray(value)
                      ? value
                          .map((v) =>
                            t(getTranslationPath(section.key, field.key, `options.${v}`))
                          )
                          .join(', ')
                      : field.options
                      ? t(getTranslationPath(section.key, field.key, `options.${value}`))
                      : value;

                    return (
                      <div key={field.key} className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                        <span className="text-slate-600">
                          {t(getTranslationPath(section.key, field.key, 'label'))}
                        </span>
                        <span className="text-slate-900 font-medium text-right max-w-[60%]">
                          {displayValue || t('projectForm.review.noAnswer')}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('projectForm.actions.previous')}
          </button>

          {onSave && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {t('projectForm.actions.save')}
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('projectForm.actions.submitting')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t('projectForm.actions.submit')}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Render form
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-500">
            {t('projectForm.progress.step')} {currentSectionIndex + 1} {t('projectForm.progress.of')} {totalSections}
          </span>
          <span className="text-sm text-slate-500">
            {Math.round(progress)}{t('projectForm.progress.complete')}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {sections.map((section, index) => (
          <button
            key={section.key}
            onClick={() => {
              if (index < currentSectionIndex) {
                setCurrentSectionIndex(index);
              }
            }}
            disabled={index > currentSectionIndex}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${
                index === currentSectionIndex
                  ? 'bg-blue-600 text-white'
                  : index < currentSectionIndex
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            {index < currentSectionIndex && <Check className="w-3 h-3 inline-block mr-1" />}
            {t(
              formType === 'system'
                ? `projectForm.system.sections.${section.key}`
                : `projectForm.sections.${section.key}`
            )}
          </button>
        ))}
      </div>

      {/* Section title */}
      {currentSection && (
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {t(
            formType === 'system'
              ? `projectForm.system.sections.${currentSection.key}`
              : `projectForm.sections.${currentSection.key}`
          )}
        </h2>
      )}

      {/* Fields */}
      <div className="space-y-6">
        {currentSection?.fields.filter(isFieldVisible).map((field) => (
          <FormFieldRenderer
            key={field.key}
            field={field}
            value={values[field.key]}
            error={errors[field.key]}
            onChange={(value) => handleChange(field.key, value)}
            translationPath={getTranslationPath(currentSection.key, field.key)}
            t={t}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('projectForm.actions.previous')}
        </button>

        {onSave && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {t('projectForm.actions.save')}
          </button>
        )}

        <button
          onClick={handleNext}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          {currentSectionIndex === totalSections - 1 ? (
            t('projectForm.review.title')
          ) : (
            <>
              {t('projectForm.actions.next')}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Field renderer component
interface FormFieldRendererProps {
  field: FormField;
  value: string | string[] | undefined;
  error?: string;
  onChange: (value: string | string[]) => void;
  translationPath: string;
  t: (key: string) => string;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  error,
  onChange,
  translationPath,
  t,
}) => {
  const label = t(`${translationPath}.label`);
  const placeholder = t(`${translationPath}.placeholder`);
  const help = t(`${translationPath}.help`);

  const baseInputClass =
    'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
  const errorClass = error ? 'border-red-300 bg-red-50' : 'border-slate-300';

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type === 'phone' ? 'tel' : field.type}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder !== `${translationPath}.placeholder` ? placeholder : ''}
            className={`${baseInputClass} ${errorClass}`}
          />
          {help && help !== `${translationPath}.help` && (
            <p className="mt-1 text-sm text-slate-500">{help}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    case 'textarea':
      return (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder !== `${translationPath}.placeholder` ? placeholder : ''}
            rows={4}
            className={`${baseInputClass} ${errorClass} resize-none`}
          />
          {help && help !== `${translationPath}.help` && (
            <p className="mt-1 text-sm text-slate-500">{help}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    case 'select':
      return (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClass} ${errorClass}`}
          >
            <option value="">{t('projectForm.review.noAnswer')}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`${translationPath}.options.${option.translationKey}`)}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    case 'radio':
      return (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${
                    value === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }
                  ${error ? 'border-red-300' : ''}
                `}
              >
                <input
                  type="radio"
                  name={field.key}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-slate-700">
                  {t(`${translationPath}.options.${option.translationKey}`)}
                </span>
              </label>
            ))}
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    case 'checkbox':
    case 'multiselect':
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            {label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {field.options?.map((option) => {
              const isChecked = selectedValues.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                    ${
                      isChecked
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }
                    ${error ? 'border-red-300' : ''}
                  `}
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange([...selectedValues, option.value]);
                      } else {
                        onChange(selectedValues.filter((v) => v !== option.value));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-slate-700">
                    {t(`${translationPath}.options.${option.translationKey}`)}
                  </span>
                </label>
              );
            })}
          </div>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      );

    default:
      return null;
  }
};

export default DynamicProjectForm;
