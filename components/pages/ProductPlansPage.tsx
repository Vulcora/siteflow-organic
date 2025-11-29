import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileCheck } from 'lucide-react';
import ProjectSelector from '../shared/ProjectSelector';
import ProductPlanManagement from '../productplan/ProductPlanManagement';
import ProductPlanCustomerView from '../productplan/ProductPlanCustomerView';
import { isSiteflowStaff, UserRole } from '../../utils/roleHelpers';
import { useAuth } from '../../src/context/AuthContext';

const ProductPlansPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const userRole: UserRole = user?.role || 'customer';
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const isStaff = isSiteflowStaff(userRole);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.nav.productPlans')}</h1>
          <p className="text-slate-600 mt-1">
            {isStaff ? 'Hantera produktplaner för projekt' : 'Se produktplaner för dina projekt'}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <ProjectSelector
            value={selectedProjectId}
            onChange={setSelectedProjectId}
          />
        </div>
      </div>

      {selectedProjectId ? (
        isStaff ? (
          <ProductPlanManagement projectId={selectedProjectId} />
        ) : (
          <ProductPlanCustomerView projectId={selectedProjectId} />
        )
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Välj ett projekt
          </h3>
          <p className="text-slate-500">
            Välj ett projekt ovan för att se produktplaner
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductPlansPage;
