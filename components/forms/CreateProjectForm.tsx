import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, FolderKanban } from 'lucide-react';
import { useCreateProject } from '../../src/hooks/useApi';
import { useCompanies } from '../../src/hooks/useApi';

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const createProject = useCreateProject();
  const { data: companies = [] } = useCompanies();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    companyId: '',
    budget: '',
    startDate: '',
    targetEndDate: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Projektnamn krävs');
      return;
    }

    if (!formData.companyId) {
      setError('Företag måste väljas');
      return;
    }

    try {
      await createProject.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        companyId: formData.companyId,
        budget: formData.budget || undefined,
        startDate: formData.startDate || undefined,
        targetEndDate: formData.targetEndDate || undefined,
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skapa projekt');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Project Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
          Projektnamn <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="T.ex. Ny hemsida"
          required
        />
      </div>

      {/* Company Selection */}
      <div>
        <label htmlFor="companyId" className="block text-sm font-medium text-slate-700 mb-2">
          Företag <span className="text-red-500">*</span>
        </label>
        <select
          id="companyId"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Välj företag</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
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
          placeholder="Beskriv projektet..."
        />
      </div>

      {/* Budget and Dates Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Budget */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
            Budget (SEK)
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="100000"
            min="0"
            step="1000"
          />
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-2">
            Startdatum
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Target End Date */}
        <div>
          <label htmlFor="targetEndDate" className="block text-sm font-medium text-slate-700 mb-2">
            Målslutdatum
          </label>
          <input
            type="date"
            id="targetEndDate"
            name="targetEndDate"
            value={formData.targetEndDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            disabled={createProject.isPending}
          >
            Avbryt
          </button>
        )}
        <button
          type="submit"
          disabled={createProject.isPending}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createProject.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Skapar...
            </>
          ) : (
            <>
              <FolderKanban className="w-4 h-4" />
              Skapa projekt
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
