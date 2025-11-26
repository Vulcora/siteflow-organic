import React, { useState } from 'react';
import {
  Code,
  FolderKanban,
  Ticket,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  GitBranch,
  Play
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatsCard from './StatsCard';
import { useAuth } from '../../src/context/AuthContext';
import {
  useProjects,
  useTickets,
  useTimeEntries,
  useStartWorkOnTicket,
  useSubmitTicketForReview
} from '../../src/hooks/useApi';
import Modal from '../shared/Modal';
import CreateTicketForm from '../forms/CreateTicketForm';

const DeveloperDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);

  // Use RPC hooks for data fetching
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: tickets = [], isLoading: ticketsLoading, error: ticketsError } = useTickets();
  const { data: timeEntries = [], isLoading: timeEntriesLoading, error: timeEntriesError } = useTimeEntries();

  // Use mutation hooks for state transitions
  const startWorkOnTicket = useStartWorkOnTicket();
  const submitTicketForReview = useSubmitTicketForReview();

  const loading = projectsLoading || ticketsLoading || timeEntriesLoading;
  const error = projectsError || ticketsError || timeEntriesError;

  // Filter tickets assigned to current user
  const myTickets = tickets.filter((t: any) => t.assigneeId === currentUser?.id);
  const inProgressTickets = myTickets.filter((t: any) => t.state === 'in_progress').length;
  const inReviewTickets = myTickets.filter((t: any) => t.state === 'in_review').length;

  // Calculate hours this week
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const hoursThisWeek = timeEntries
    .filter((te: any) => new Date(te.date) >= weekStart)
    .reduce((sum: number, te: any) => sum + (te.hours || 0), 0);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      case 'in_review': return 'bg-purple-100 text-purple-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
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
          <span>{error instanceof Error ? error.message : 'Failed to load dashboard data'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Developer Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Developer Dashboard</h2>
            <p className="text-violet-100 mt-1">
              {currentUser?.specialization || 'Fullstack Development'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsCreateTicketModalOpen(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Ticket className="w-4 h-4" />
              Nytt ärende
            </button>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Clock className="w-4 h-4" />
              Logga tid
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Mina ärenden"
          value={myTickets.length}
          icon={<Ticket className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          title="Pågående"
          value={inProgressTickets}
          icon={<Play className="w-5 h-5" />}
          color="amber"
        />
        <StatsCard
          title="Under granskning"
          value={inReviewTickets}
          icon={<GitBranch className="w-5 h-5" />}
          color="purple"
        />
        <StatsCard
          title="Timmar denna vecka"
          value={`${hoursThisWeek.toFixed(1)}h`}
          icon={<Clock className="w-5 h-5" />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Active Tickets */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Mina aktiva ärenden</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Visa alla
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {myTickets.filter(t => t.state !== 'resolved' && t.state !== 'closed').length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p>Inga aktiva ärenden!</p>
              </div>
            ) : (
              myTickets
                .filter(t => t.state !== 'resolved' && t.state !== 'closed')
                .slice(0, 5)
                .map((ticket) => (
                  <div key={ticket.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{ticket.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStateColor(ticket.state)}`}>
                            {ticket.state.replace('_', ' ')}
                          </span>
                          {ticket.priority && (
                            <span className={`text-xs font-medium ${
                              ticket.priority === 'critical' ? 'text-red-600' :
                              ticket.priority === 'high' ? 'text-amber-600' :
                              'text-slate-500'
                            }`}>
                              {ticket.priority}
                            </span>
                          )}
                        </div>
                      </div>
                      {ticket.state === 'open' && (
                        <button
                          onClick={() => startWorkOnTicket.mutate(ticket.id)}
                          disabled={startWorkOnTicket.isPending}
                          className="ml-4 px-3 py-1 text-sm bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors disabled:opacity-50"
                        >
                          {startWorkOnTicket.isPending ? 'Startar...' : 'Starta arbete'}
                        </button>
                      )}
                      {ticket.state === 'in_progress' && (
                        <button
                          onClick={() => submitTicketForReview.mutate(ticket.id)}
                          disabled={submitTicketForReview.isPending}
                          className="ml-4 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          {submitTicketForReview.isPending ? 'Skickar...' : 'Skicka för granskning'}
                        </button>
                      )}
                      {ticket.state === 'in_review' && (
                        <span className="ml-4 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg">
                          Under granskning
                        </span>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Aktiva projekt</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {projects.filter(p => p.state === 'in_progress').length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <FolderKanban className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>Inga aktiva projekt</p>
              </div>
            ) : (
              projects
                .filter(p => p.state === 'in_progress')
                .slice(0, 5)
                .map((project) => (
                  <div key={project.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white font-medium">
                          {project.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{project.name}</p>
                          <p className="text-sm text-slate-500">
                            {tickets.filter((t: any) => t.assigneeId === currentUser?.id).length} ärenden tilldelade
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Time Entries */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Senaste tidrapporter</h3>
          <button className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Ny tidrapport
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {timeEntries.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>Inga tidrapporter ännu</p>
            </div>
          ) : (
            timeEntries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{entry.description || 'Ingen beskrivning'}</p>
                    <p className="text-sm text-slate-500">{entry.date}</p>
                  </div>
                  <span className="text-lg font-semibold text-violet-600">{entry.hours}h</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        title="Skapa nytt ärende"
        size="lg"
      >
        <CreateTicketForm
          onSuccess={() => setIsCreateTicketModalOpen(false)}
          onCancel={() => setIsCreateTicketModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default DeveloperDashboard;
