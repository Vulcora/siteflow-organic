import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Loader2,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import { useProjects } from '../../src/hooks/useApi';
import ProjectSelector from '../shared/ProjectSelector';
import ProjectTeam from '../shared/ProjectTeam';
import Modal from '../shared/Modal';
import InviteUserForm from '../forms/InviteUserForm';
import { isAdmin, isKAM, isProjectLeader } from '../../utils/roleHelpers';

const TeamPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Determine if user can invite team members
  const canInvite = user && (isAdmin(user.role) || isKAM(user.role) || isProjectLeader(user.role));

  // Fetch projects based on role
  const { data: projects = [], isLoading, error } = useProjects(
    user?.companyId && !isAdmin(user.role) && !isKAM(user.role) && !isProjectLeader(user.role)
      ? { companyId: user.companyId }
      : undefined
  );

  // Get team members for selected project
  // TODO: When userRead RPC is available, fetch team members assigned to the project
  // For now, we'll show the current user as the only team member
  const teamMembers = selectedProjectId && user ? [user] : [];

  const handleInviteSuccess = () => {
    setIsInviteModalOpen(false);
    // Refetch would happen here
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
          <h1 className="text-2xl font-bold text-slate-900">{t('pages.team.title', 'Team')}</h1>
          <p className="text-slate-600 mt-1">{t('pages.team.subtitle', 'Hantera teammedlemmar och roller')}</p>
        </div>
        {canInvite && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {t('pages.team.invite', 'Bjud in medlem')}
          </button>
        )}
      </div>

      {/* Project Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t('pages.team.selectProject', 'Välj projekt')}
        </label>
        <ProjectSelector
          value={selectedProjectId}
          onChange={setSelectedProjectId}
          className="max-w-md"
        />
      </div>

      {/* Team */}
      {selectedProjectId ? (
        <ProjectTeam teamMembers={teamMembers} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            {t('pages.team.noProjectSelected', 'Välj ett projekt')}
          </h3>
          <p className="text-slate-500">
            {t('pages.team.selectProjectHint', 'Välj ett projekt ovan för att se dess teammedlemmar')}
          </p>
        </div>
      )}

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={t('pages.team.inviteTitle', 'Bjud in teammedlem')}
        size="md"
      >
        <InviteUserForm
          onSuccess={handleInviteSuccess}
          onCancel={() => setIsInviteModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default TeamPage;
