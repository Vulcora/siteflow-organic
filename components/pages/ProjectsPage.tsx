import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import { useProjects, useMilestonesByProject } from '../../src/hooks/useApi';
import Modal from '../shared/Modal';
import CreateProjectForm from '../forms/CreateProjectForm';
import ProjectOverview from '../ProjectOverview';
import ProjectStatus from '../shared/ProjectStatus';
import { isAdmin, isKAM, isProjectLeader } from '../../utils/roleHelpers';

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');

  // Determine if user can create projects
  const canCreateProject = user && (isAdmin(user.role) || isKAM(user.role) || isProjectLeader(user.role));
  const canEdit = user && (isAdmin(user.role) || isKAM(user.role) || isProjectLeader(user.role));

  // Fetch projects based on role
  const { data: projects = [], isLoading, error, refetch } = useProjects(
    user?.companyId && !isAdmin(user.role) && !isKAM(user.role) && !isProjectLeader(user.role)
      ? { companyId: user.companyId }
      : undefined
  );

  // Fetch milestones for selected project
  const { data: milestones = [] } = useMilestonesByProject(
    selectedProjectId || ''
  );

  // Get selected project details
  const selectedProject = projects.find((p: any) => p.id === selectedProjectId);

  // Filter projects
  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'all' || project.state === stateFilter;
    return matchesSearch && matchesState;
  });

  const getStateColor = (state: string) => {
    switch (state) {
      case 'planning': return 'bg-slate-100 text-slate-700';
      case 'in_progress': return 'bg-green-100 text-green-700';
      case 'on_hold': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStateLabel = (state: string) => {
    const labels: Record<string, string> = {
      planning: t('project.states.planning', 'Planering'),
      in_progress: t('project.states.in_progress', 'Pågående'),
      on_hold: t('project.states.on_hold', 'Pausad'),
      completed: t('project.states.completed', 'Slutförd'),
      cancelled: t('project.states.cancelled', 'Avbruten'),
    };
    return labels[state] || state;
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('pages.projects.title', 'Projekt')}</h1>
          <p className="text-slate-600 mt-1">{t('pages.projects.subtitle', 'Hantera och följ upp dina projekt')}</p>
        </div>
        {canCreateProject && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('pages.projects.create', 'Nytt projekt')}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('pages.projects.searchPlaceholder', 'Sök projekt...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('pages.projects.allStates', 'Alla statusar')}</option>
              <option value="planning">{t('project.states.planning', 'Planering')}</option>
              <option value="in_progress">{t('project.states.in_progress', 'Pågående')}</option>
              <option value="on_hold">{t('project.states.on_hold', 'Pausad')}</option>
              <option value="completed">{t('project.states.completed', 'Slutförd')}</option>
              <option value="cancelled">{t('project.states.cancelled', 'Avbruten')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
            <FolderKanban className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchQuery || stateFilter !== 'all'
                ? t('pages.projects.noResults', 'Inga projekt matchar filtret')
                : t('pages.projects.noProjects', 'Inga projekt än')}
            </h3>
            {canCreateProject && !searchQuery && stateFilter === 'all' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('pages.projects.createFirst', 'Skapa ditt första projekt')}
              </button>
            )}
          </div>
        ) : (
          filteredProjects.map((project: any) => (
            <div
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              className={`bg-white rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                selectedProjectId === project.id
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                      {project.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStateColor(project.state)}`}>
                        {getStateLabel(project.state)}
                      </span>
                    </div>
                  </div>
                  {project.state === 'in_progress' && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>

                {project.description && (
                  <p className="text-sm text-slate-600 mt-3 line-clamp-2">{project.description}</p>
                )}

                <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                  {project.startDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(project.startDate).toLocaleDateString('sv-SE')}</span>
                    </div>
                  )}
                  {project.estimatedEndDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(project.estimatedEndDate).toLocaleDateString('sv-SE')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Project Details */}
      {selectedProjectId && selectedProject && (
        <div className="space-y-6">
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {t('pages.projects.details', 'Projektdetaljer')}: {selectedProject.name}
            </h2>
          </div>

          {/* Project Status Overview */}
          <ProjectStatus
            project={selectedProject}
            milestones={milestones}
          />

          {/* Project Overview with Timeline and Meetings */}
          <ProjectOverview
            projectId={selectedProjectId}
            canEdit={canEdit}
          />
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.projects.createTitle', 'Skapa nytt projekt')}
        size="lg"
      >
        <CreateProjectForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
