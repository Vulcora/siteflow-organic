import React from 'react';
import {
  Users,
  FolderKanban,
  Ticket,
  Building,
  AlertCircle,
  TrendingUp,
  Loader2,
  UserPlus,
  Phone,
  Mail
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatsCard from './StatsCard';
import { useCompanies, useProjects, useTickets } from '../../src/hooks/useApi';

const KAMDashboard: React.FC = () => {
  const { t } = useTranslation();

  // Use RPC hooks for data fetching
  const { data: companies = [], isLoading: companiesLoading, error: companiesError } = useCompanies();
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: tickets = [], isLoading: ticketsLoading, error: ticketsError } = useTickets();

  const loading = companiesLoading || projectsLoading || ticketsLoading;
  const error = companiesError || projectsError || ticketsError;

  const activeProjects = projects.filter((p: any) => p.state === 'in_progress').length;
  const pendingApproval = projects.filter((p: any) => p.state === 'pending_approval').length;
  const openTickets = tickets.filter((t: any) => t.state === 'open' || t.state === 'in_progress').length;
  const criticalTickets = tickets.filter((t: any) => t.priority === 'critical' || t.priority === 'high').length;

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
      {/* KAM Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Key Account Manager Dashboard</h2>
            <p className="text-teal-100 mt-1">Hantera dina kunder och deras projekt</p>
          </div>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <UserPlus className="w-4 h-4" />
            Bjud in kund
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Mina kunder"
          value={companies.length}
          icon={<Building className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          title="Aktiva projekt"
          value={activeProjects}
          icon={<FolderKanban className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          title="Väntar på godkännande"
          value={pendingApproval}
          icon={<AlertCircle className="w-5 h-5" />}
          color="amber"
        />
        <StatsCard
          title="Kritiska ärenden"
          value={criticalTickets}
          icon={<Ticket className="w-5 h-5" />}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Customers */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Mina kunder</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Visa alla
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {companies.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>Inga kunder tilldelade</p>
              </div>
            ) : (
              companies.slice(0, 5).map((company) => (
                <div key={company.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white font-medium">
                        {company.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{company.name}</p>
                        <p className="text-sm text-slate-500">
                          {projects.filter((p: any) => p.companyId === company.id).length} projekt
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Projects Needing Attention */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Projekt som behöver uppmärksamhet</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingApproval === 0 && criticalTickets === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p>Alla projekt ser bra ut!</p>
              </div>
            ) : (
              <>
                {projects.filter(p => p.state === 'pending_approval').slice(0, 3).map((project) => (
                  <div key={project.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{project.name}</p>
                        <p className="text-sm text-amber-600">Väntar på godkännande</p>
                      </div>
                      <button className="px-3 py-1 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                        Granska
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Senaste ärendena</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {tickets.slice(0, 5).map((ticket) => (
            <div key={ticket.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{ticket.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      ticket.state === 'open' ? 'bg-blue-100 text-blue-700' :
                      ticket.state === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KAMDashboard;
