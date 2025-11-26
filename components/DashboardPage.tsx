import React from 'react';
import DashboardLayout from './DashboardLayout';
import { Page } from '../types';
import { UserRole, isAdmin, isKAM, isProjectLeader, isDeveloper } from '../utils/roleHelpers';
import { useAuth } from '../src/context/AuthContext';
import {
  CustomerDashboard,
  AdminDashboard,
  KAMDashboard,
  DeveloperDashboard,
  ProjectLeaderDashboard
} from './dashboards';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onLogout }) => {
  const { user } = useAuth();
  const userRole: UserRole = user?.role || 'customer';

  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    if (isAdmin(userRole)) {
      return <AdminDashboard />;
    }
    if (isKAM(userRole)) {
      return <KAMDashboard />;
    }
    if (isProjectLeader(userRole)) {
      return <ProjectLeaderDashboard />;
    }
    if (isDeveloper(userRole)) {
      return <DeveloperDashboard />;
    }
    // Default to customer dashboard
    return <CustomerDashboard />;
  };

  return (
    <DashboardLayout currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout}>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default DashboardPage;
