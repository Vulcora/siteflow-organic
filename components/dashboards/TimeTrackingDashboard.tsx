import React, { useState, useMemo } from 'react';
import {
  Clock,
  Calendar,
  TrendingUp,
  Loader2,
  AlertCircle,
  Plus,
  FolderKanban,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatsCard from './StatsCard';
import { useTimeEntries, useProjects } from '../../src/hooks/useApi';
import Modal from '../shared/Modal';
import CreateTimeEntryForm from '../forms/CreateTimeEntryForm';

type ViewMode = 'week' | 'month';

const TimeTrackingDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [isCreateTimeEntryModalOpen, setIsCreateTimeEntryModalOpen] = useState(false);

  // Fetch time entries and projects
  const { data: timeEntries = [], isLoading: entriesLoading, error: entriesError } = useTimeEntries();
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const loading = entriesLoading || projectsLoading;
  const error = entriesError;

  // Helper functions for date calculations
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const getStartOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const isToday = (date: string) => {
    const today = new Date();
    const entryDate = new Date(date);
    return (
      entryDate.getDate() === today.getDate() &&
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (date: string) => {
    const entryDate = new Date(date);
    const startOfWeek = getStartOfWeek(new Date());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return entryDate >= startOfWeek && entryDate <= endOfWeek;
  };

  const isThisMonth = (date: string) => {
    const entryDate = new Date(date);
    const today = new Date();
    return (
      entryDate.getMonth() === today.getMonth() &&
      entryDate.getFullYear() === today.getFullYear()
    );
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const todayHours = timeEntries
      .filter((entry: any) => isToday(entry.date))
      .reduce((sum: number, entry: any) => sum + parseFloat(entry.hours), 0);

    const weekHours = timeEntries
      .filter((entry: any) => isThisWeek(entry.date))
      .reduce((sum: number, entry: any) => sum + parseFloat(entry.hours), 0);

    const monthHours = timeEntries
      .filter((entry: any) => isThisMonth(entry.date))
      .reduce((sum: number, entry: any) => sum + parseFloat(entry.hours), 0);

    return { todayHours, weekHours, monthHours };
  }, [timeEntries]);

  // Filter time entries based on view mode
  const filteredEntries = useMemo(() => {
    const filtered = timeEntries.filter((entry: any) => {
      if (viewMode === 'week') {
        return isThisWeek(entry.date);
      } else {
        return isThisMonth(entry.date);
      }
    });

    // Sort by date descending
    return filtered.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [timeEntries, viewMode]);

  // Group entries by project
  const entriesByProject = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    filteredEntries.forEach((entry: any) => {
      const projectId = entry.projectId;
      if (!grouped[projectId]) {
        grouped[projectId] = [];
      }
      grouped[projectId].push(entry);
    });

    return grouped;
  }, [filteredEntries]);

  // Get project name by ID
  const getProjectName = (projectId: string) => {
    const project = projects.find((p: any) => p.id === projectId);
    return project?.name || 'Okänt projekt';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
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
          <span>{error instanceof Error ? error.message : 'Failed to load time entries'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tidrapportering</h2>
            <p className="text-emerald-100 mt-1">Hantera och översikt över din arbetad tid</p>
          </div>
          <button
            onClick={() => setIsCreateTimeEntryModalOpen(true)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Lägg till tid
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Idag"
          value={`${stats.todayHours.toFixed(1)}h`}
          icon={<Clock className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          title="Denna vecka"
          value={`${stats.weekHours.toFixed(1)}h`}
          icon={<Calendar className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          title="Denna månad"
          value={`${stats.monthHours.toFixed(1)}h`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Tidsposter</h3>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'week'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vecka
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'month'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Månad
          </button>
        </div>
      </div>

      {/* Time Entries by Project */}
      <div className="space-y-4">
        {Object.keys(entriesByProject).length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Inga tidsposter ännu
            </h3>
            <p className="text-slate-500 mb-6">
              Börja logga din tid för att se översikt här
            </p>
            <button
              onClick={() => setIsCreateTimeEntryModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Lägg till första tidposten
            </button>
          </div>
        ) : (
          Object.entries(entriesByProject).map(([projectId, entries]) => {
            const projectHours = entries.reduce(
              (sum, entry: any) => sum + parseFloat(entry.hours),
              0
            );

            return (
              <div key={projectId} className="bg-white rounded-xl border border-slate-200">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white">
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{getProjectName(projectId)}</h4>
                        <p className="text-sm text-slate-500">
                          {entries.length} {entries.length === 1 ? 'tidpost' : 'tidsposter'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">{projectHours.toFixed(1)}h</p>
                      <p className="text-xs text-slate-500">Totalt</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {entries.map((entry: any) => (
                    <div key={entry.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-slate-600">
                              {formatDate(entry.date)}
                            </span>
                            <span className="text-lg font-bold text-slate-900">
                              {parseFloat(entry.hours).toFixed(1)}h
                            </span>
                          </div>
                          {entry.description && (
                            <p className="text-sm text-slate-600">{entry.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Time Entry Modal */}
      <Modal
        isOpen={isCreateTimeEntryModalOpen}
        onClose={() => setIsCreateTimeEntryModalOpen(false)}
        title="Lägg till tidpost"
        size="md"
      >
        <CreateTimeEntryForm
          onSuccess={() => setIsCreateTimeEntryModalOpen(false)}
          onCancel={() => setIsCreateTimeEntryModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TimeTrackingDashboard;
