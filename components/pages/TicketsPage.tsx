import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Clock,
  User,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import { useTickets, useProjects } from '../../src/hooks/useApi';
import Modal from '../shared/Modal';
import CreateTicketForm from '../forms/CreateTicketForm';
import { isAdmin, isKAM, isProjectLeader, isDeveloper } from '../../utils/roleHelpers';

const TicketsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Fetch data
  const { data: tickets = [], isLoading: ticketsLoading, error: ticketsError, refetch } = useTickets();
  const { data: projects = [], isLoading: projectsLoading } = useProjects(
    user?.companyId && !isAdmin(user.role) && !isKAM(user.role) && !isProjectLeader(user.role)
      ? { companyId: user.companyId }
      : undefined
  );

  const isLoading = ticketsLoading || projectsLoading;

  // Filter tickets based on user role and company
  const projectIds = projects.map((p: any) => p.id);
  const filteredByRole = isAdmin(user?.role) || isKAM(user?.role) || isProjectLeader(user?.role)
    ? tickets
    : tickets.filter((t: any) => projectIds.includes(t.projectId));

  // Apply search and filters
  const filteredTickets = filteredByRole.filter((ticket: any) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'all' || ticket.state === stateFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || ticket.projectId === projectFilter;
    return matchesSearch && matchesState && matchesPriority && matchesProject;
  });

  const selectedTicket = tickets.find((t: any) => t.id === selectedTicketId);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      case 'in_review': return 'bg-purple-100 text-purple-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStateLabel = (state: string) => {
    const labels: Record<string, string> = {
      open: t('ticket.states.open', 'Öppen'),
      in_progress: t('ticket.states.in_progress', 'Pågående'),
      in_review: t('ticket.states.in_review', 'Granskning'),
      resolved: t('ticket.states.resolved', 'Löst'),
      closed: t('ticket.states.closed', 'Stängd'),
    };
    return labels[state] || state;
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-slate-500 bg-slate-50 border-slate-200';
      default: return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  const getPriorityLabel = (priority: string | null) => {
    if (!priority) return t('ticket.priority.none', 'Ingen');
    const labels: Record<string, string> = {
      critical: t('ticket.priority.critical', 'Kritisk'),
      high: t('ticket.priority.high', 'Hög'),
      medium: t('ticket.priority.medium', 'Medium'),
      low: t('ticket.priority.low', 'Låg'),
    };
    return labels[priority] || priority;
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find((p: any) => p.id === projectId);
    return project?.name || t('ticket.unknownProject', 'Okänt projekt');
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

  if (ticketsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{ticketsError instanceof Error ? ticketsError.message : t('errors.loadFailed', 'Kunde inte ladda data')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('pages.tickets.title', 'Ärenden')}</h1>
          <p className="text-slate-600 mt-1">{t('pages.tickets.subtitle', 'Hantera supportärenden och buggar')}</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('pages.tickets.create', 'Nytt ärende')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('pages.tickets.searchPlaceholder', 'Sök ärenden...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />

            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">{t('pages.tickets.allProjects', 'Alla projekt')}</option>
              {projects.map((project: any) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>

            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">{t('pages.tickets.allStates', 'Alla statusar')}</option>
              <option value="open">{t('ticket.states.open', 'Öppen')}</option>
              <option value="in_progress">{t('ticket.states.in_progress', 'Pågående')}</option>
              <option value="in_review">{t('ticket.states.in_review', 'Granskning')}</option>
              <option value="resolved">{t('ticket.states.resolved', 'Löst')}</option>
              <option value="closed">{t('ticket.states.closed', 'Stängd')}</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">{t('pages.tickets.allPriorities', 'Alla prioriteter')}</option>
              <option value="critical">{t('ticket.priority.critical', 'Kritisk')}</option>
              <option value="high">{t('ticket.priority.high', 'Hög')}</option>
              <option value="medium">{t('ticket.priority.medium', 'Medium')}</option>
              <option value="low">{t('ticket.priority.low', 'Låg')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl border border-slate-200">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <Ticket className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchQuery || stateFilter !== 'all' || priorityFilter !== 'all' || projectFilter !== 'all'
                ? t('pages.tickets.noResults', 'Inga ärenden matchar filtret')
                : t('pages.tickets.noTickets', 'Inga ärenden än')}
            </h3>
            {!searchQuery && stateFilter === 'all' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('pages.tickets.createFirst', 'Skapa ditt första ärende')}
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTickets.map((ticket: any) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicketId(selectedTicketId === ticket.id ? null : ticket.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedTicketId === ticket.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-slate-900 truncate">{ticket.title}</h3>
                      {ticket.priority && (
                        <span className={`px-2 py-0.5 rounded border text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityLabel(ticket.priority)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-1">{ticket.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="text-blue-600">{getProjectName(ticket.projectId)}</span>
                      <span className={`px-2 py-0.5 rounded-full ${getStateColor(ticket.state)}`}>
                        {getStateLabel(ticket.state)}
                      </span>
                      {ticket.createdAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString('sv-SE')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedTicketId === ticket.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">{t('pages.tickets.description', 'Beskrivning')}</h4>
                        <p className="text-sm text-slate-600">{ticket.description || t('pages.tickets.noDescription', 'Ingen beskrivning')}</p>
                      </div>
                      <div className="space-y-2">
                        {ticket.assigneeId && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{t('pages.tickets.assignee', 'Tilldelad')}: {ticket.assigneeId}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{t('pages.tickets.comments', 'Kommentarer')}: 0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.tickets.createTitle', 'Skapa nytt ärende')}
        size="lg"
      >
        <CreateTicketForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TicketsPage;
