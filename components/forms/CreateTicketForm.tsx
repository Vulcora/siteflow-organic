import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Ticket } from 'lucide-react';
import { useCreateTicket, useProjects } from '../../src/hooks/useApi';

interface CreateTicketFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultProjectId?: string;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onSuccess, onCancel, defaultProjectId }) => {
  const { t } = useTranslation();
  const createTicket = useCreateTicket();
  const { data: projects = [] } = useProjects();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: defaultProjectId || '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    category: 'task' as 'bug' | 'feature' | 'support' | 'question' | 'task',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Ärendetitel krävs');
      return;
    }

    if (!formData.projectId) {
      setError('Projekt måste väljas');
      return;
    }

    try {
      await createTicket.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        projectId: formData.projectId,
        priority: formData.priority,
        category: formData.category,
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skapa ärende');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const priorityOptions = [
    { value: 'low', label: 'Låg', color: 'text-slate-600' },
    { value: 'medium', label: 'Medel', color: 'text-blue-600' },
    { value: 'high', label: 'Hög', color: 'text-amber-600' },
    { value: 'critical', label: 'Kritisk', color: 'text-red-600' },
  ];

  const categoryOptions = [
    { value: 'task', label: 'Uppgift', icon: '📋' },
    { value: 'bug', label: 'Bugg', icon: '🐛' },
    { value: 'feature', label: 'Funktion', icon: '✨' },
    { value: 'support', label: 'Support', icon: '💬' },
    { value: 'question', label: 'Fråga', icon: '❓' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Ticket Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
          Titel <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="T.ex. Fixa login-bugg"
          required
        />
      </div>

      {/* Project Selection */}
      <div>
        <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 mb-2">
          Projekt <span className="text-red-500">*</span>
        </label>
        <select
          id="projectId"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Välj projekt</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
          Beskrivning
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Beskriv ärendet..."
        />
      </div>

      {/* Priority and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
            Prioritet
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            disabled={createTicket.isPending}
          >
            Avbryt
          </button>
        )}
        <button
          type="submit"
          disabled={createTicket.isPending}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTicket.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Skapar...
            </>
          ) : (
            <>
              <Ticket className="w-4 h-4" />
              Skapa ärende
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateTicketForm;
