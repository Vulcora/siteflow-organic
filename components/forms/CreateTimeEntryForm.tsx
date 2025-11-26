import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Clock } from 'lucide-react';
import { useCreateTimeEntry, useProjects, useTickets } from '../../src/hooks/useApi';

interface CreateTimeEntryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultProjectId?: string;
  defaultTicketId?: string;
}

const CreateTimeEntryForm: React.FC<CreateTimeEntryFormProps> = ({
  onSuccess,
  onCancel,
  defaultProjectId,
  defaultTicketId,
}) => {
  const { t } = useTranslation();
  const createTimeEntry = useCreateTimeEntry();
  const { data: projects = [] } = useProjects();

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    hours: '',
    date: getTodayDate(),
    projectId: defaultProjectId || '',
    ticketId: defaultTicketId || '',
    description: '',
  });

  // Load tickets for selected project
  const { data: tickets = [] } = useTickets(
    formData.projectId ? { projectId: formData.projectId } : undefined
  );

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const hours = parseFloat(formData.hours);
    if (!formData.hours || isNaN(hours) || hours <= 0 || hours > 24) {
      setError('Timmar måste vara mellan 0 och 24');
      return;
    }

    if (!formData.date) {
      setError('Datum krävs');
      return;
    }

    if (!formData.projectId) {
      setError('Projekt måste väljas');
      return;
    }

    try {
      await createTimeEntry.mutateAsync({
        hours,
        date: formData.date,
        projectId: formData.projectId,
        description: formData.description || undefined,
        ticketId: formData.ticketId || undefined,
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skapa tidrapport');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // If project changes, clear ticket selection
    if (name === 'projectId') {
      setFormData((prev) => ({
        ...prev,
        projectId: value,
        ticketId: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Hours and Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hours */}
        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-slate-700 mb-2">
            Timmar <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="hours"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="8.0"
            min="0"
            max="24"
            step="0.25"
            required
          />
          <p className="text-xs text-slate-500 mt-1">Ange timmar (t.ex. 1.5 för 1 timme 30 minuter)</p>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
            Datum <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
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
          disabled={!!defaultProjectId}
        >
          <option value="">Välj projekt</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ticket Selection (Optional) */}
      {formData.projectId && (
        <div>
          <label htmlFor="ticketId" className="block text-sm font-medium text-slate-700 mb-2">
            Ärende (valfritt)
          </label>
          <select
            id="ticketId"
            name="ticketId"
            value={formData.ticketId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!!defaultTicketId}
          >
            <option value="">Inget ärende</option>
            {tickets.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">Koppla tiden till ett specifikt ärende</p>
        </div>
      )}

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
          Beskrivning (valfritt)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Beskriv vad du arbetade med..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            disabled={createTimeEntry.isPending}
          >
            Avbryt
          </button>
        )}
        <button
          type="submit"
          disabled={createTimeEntry.isPending}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTimeEntry.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sparar...
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              Spara tid
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateTimeEntryForm;
