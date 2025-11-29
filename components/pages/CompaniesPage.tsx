import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Plus,
  Search,
  Loader2,
  AlertCircle,
  FolderKanban,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';
import { useCompanies, useProjects } from '../../src/hooks/useApi';
import Modal from '../shared/Modal';
import { isAdmin, isKAM } from '../../utils/roleHelpers';

const CompaniesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Check permissions
  const canCreate = user && (isAdmin(user.role) || isKAM(user.role));

  // Fetch data
  const { data: companies = [], isLoading, error: companiesError } = useCompanies();
  const { data: projects = [] } = useProjects();

  // Filter companies
  const filteredCompanies = companies.filter((company: any) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.orgNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCompany = companies.find((c: any) => c.id === selectedCompanyId);

  // Get stats for a company
  const getCompanyStats = (companyId: string) => {
    const companyProjects = projects.filter((p: any) => p.companyId === companyId);
    const activeProjects = companyProjects.filter((p: any) => p.state === 'in_progress').length;

    return {
      totalProjects: companyProjects.length,
      activeProjects,
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (companiesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{companiesError instanceof Error ? companiesError.message : t('errors.loadFailed', 'Kunde inte ladda data')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('pages.companies.title', 'Företag')}</h1>
          <p className="text-slate-600 mt-1">{t('pages.companies.subtitle', 'Hantera kundföretag')}</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('pages.companies.create', 'Nytt företag')}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('pages.companies.searchPlaceholder', 'Sök företag...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              {searchQuery
                ? t('pages.companies.noResults', 'Inga företag matchar sökningen')
                : t('pages.companies.noCompanies', 'Inga företag än')}
            </h3>
            {canCreate && !searchQuery && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t('pages.companies.createFirst', 'Lägg till första företaget')}
              </button>
            )}
          </div>
        ) : (
          filteredCompanies.map((company: any) => {
            const stats = getCompanyStats(company.id);
            const isSelected = selectedCompanyId === company.id;

            return (
              <div
                key={company.id}
                onClick={() => setSelectedCompanyId(isSelected ? null : company.id)}
                className={`bg-white rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-bold text-lg">
                      {company.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900">{company.name}</h3>
                      {company.orgNumber && (
                        <p className="text-sm text-slate-500">Org.nr: {company.orgNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <FolderKanban className="w-4 h-4 text-blue-500" />
                      <span>{stats.totalProjects} {t('pages.companies.projects', 'projekt')}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                      {company.contactEmail && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <a href={`mailto:${company.contactEmail}`} className="text-blue-600 hover:underline">
                            {company.contactEmail}
                          </a>
                        </div>
                      )}
                      {company.contactPhone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <a href={`tel:${company.contactPhone}`} className="text-slate-600 hover:text-blue-600">
                            {company.contactPhone}
                          </a>
                        </div>
                      )}
                      {company.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {company.website}
                          </a>
                        </div>
                      )}

                      {/* Active Projects */}
                      {stats.activeProjects > 0 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-700">
                            <span className="font-semibold">{stats.activeProjects}</span> {t('pages.companies.activeProjects', 'aktiva projekt')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Company Modal - Placeholder */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={t('pages.companies.createTitle', 'Lägg till nytt företag')}
        size="md"
      >
        <div className="p-4 text-center text-slate-500">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p>{t('pages.companies.createFormPlaceholder', 'Formulär för att skapa företag kommer snart.')}</p>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="mt-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            {t('common.close', 'Stäng')}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CompaniesPage;
