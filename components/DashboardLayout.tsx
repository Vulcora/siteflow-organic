import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Ticket,
  Clock,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Building,
  MessageSquare,
  Brain,
  Sparkles,
  FileCheck,
  ClipboardList,
  FolderOpen,
  PenSquare,
  BarChart3,
  Briefcase,
  Bot,
  MousePointer2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Page } from '../types';
import { User, UserRole, isSiteflowStaff, canLogTime, canViewAllCustomers, canManageCompanies, getRoleDisplayName, isSEOPartner } from '../utils/roleHelpers';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

interface NavItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  page?: Page;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  onLogout
}) => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Get user from localStorage
  const userStr = localStorage.getItem('user');
  const user: User | null = userStr ? JSON.parse(userStr) : null;
  const userRole: UserRole = user?.role || 'customer';

  // Define all possible navigation items
  const allNavItems: NavItemType[] = [
    { id: 'dashboard', label: t('dashboard.nav.overview'), icon: <LayoutDashboard className="w-5 h-5" />, page: 'dashboard' },
    { id: 'projects', label: t('dashboard.nav.projects'), icon: <FolderKanban className="w-5 h-5" />, page: 'dashboardProjects' },
    { id: 'tickets', label: t('dashboard.nav.tickets'), icon: <Ticket className="w-5 h-5" />, page: 'dashboardTickets' },
    { id: 'timeEntries', label: t('dashboard.nav.timeEntries'), icon: <Clock className="w-5 h-5" />, page: 'dashboardTimeEntries' },
    { id: 'documents', label: t('dashboard.nav.documents'), icon: <FileText className="w-5 h-5" />, page: 'dashboardDocuments' },
    { id: 'team', label: t('dashboard.nav.team'), icon: <Users className="w-5 h-5" />, page: 'dashboardTeam' },
    { id: 'companies', label: t('dashboard.nav.companies'), icon: <Building className="w-5 h-5" />, page: 'dashboardCompanies' },
    { id: 'aiChat', label: t('dashboard.nav.aiChat'), icon: <MessageSquare className="w-5 h-5" />, page: 'dashboardAIChat' },
    { id: 'knowledge', label: t('dashboard.nav.knowledge'), icon: <Brain className="w-5 h-5" />, page: 'dashboardKnowledge' },
    { id: 'aiDocs', label: t('dashboard.nav.aiDocs'), icon: <Sparkles className="w-5 h-5" />, page: 'dashboardAIDocs' },
    { id: 'productPlans', label: t('dashboard.nav.productPlans'), icon: <FileCheck className="w-5 h-5" />, page: 'dashboardProductPlans' },
    { id: 'formResponses', label: t('dashboard.nav.formResponses'), icon: <ClipboardList className="w-5 h-5" />, page: 'dashboardFormResponses' },
    { id: 'fileBrowser', label: t('dashboard.nav.fileBrowser'), icon: <FolderOpen className="w-5 h-5" />, page: 'dashboardFileBrowser' },
    { id: 'seoAIAssistant', label: t('seoPartner.nav.aiAssistant'), icon: <Bot className="w-5 h-5" />, page: 'dashboardSEOAIAssistant' },
    { id: 'blogManager', label: t('seoPartner.nav.blogManager'), icon: <PenSquare className="w-5 h-5" />, page: 'dashboardBlogManager' },
    { id: 'analytics', label: t('seoPartner.nav.analytics'), icon: <BarChart3 className="w-5 h-5" />, page: 'dashboardAnalytics' },
    { id: 'heatmaps', label: t('seoPartner.nav.heatmaps'), icon: <MousePointer2 className="w-5 h-5" />, page: 'dashboardHeatmaps' },
    { id: 'caseStudies', label: t('seoPartner.nav.caseStudies'), icon: <Briefcase className="w-5 h-5" />, page: 'dashboardCaseStudies' },
  ];

  // Filter navigation items based on user role
  const navItems: NavItemType[] = allNavItems.filter((item) => {
    // Everyone sees overview, projects, tickets, and documents
    if (['dashboard', 'projects', 'tickets', 'documents'].includes(item.id)) {
      return true;
    }

    // Time entries only for Siteflow staff (developers, PLs, KAMs, admins)
    if (item.id === 'timeEntries') {
      return canLogTime(userRole);
    }

    // Team management for admins, KAMs (to see their customers), and PLs
    if (item.id === 'team') {
      return isSiteflowStaff(userRole);
    }

    // Companies only for admins
    if (item.id === 'companies') {
      return canManageCompanies(userRole);
    }

    // AI Chat available for everyone (project context)
    if (item.id === 'aiChat') {
      return true;
    }

    // Knowledge management for Siteflow staff
    if (item.id === 'knowledge') {
      return isSiteflowStaff(userRole);
    }

    // AI Generated Docs for Siteflow staff
    if (item.id === 'aiDocs') {
      return isSiteflowStaff(userRole);
    }

    // Product Plans - everyone can see their plans
    if (item.id === 'productPlans') {
      return true;
    }

    // Form Responses - admin only
    if (item.id === 'formResponses') {
      return canManageCompanies(userRole);
    }

    // File Browser - admin only
    if (item.id === 'fileBrowser') {
      return canManageCompanies(userRole);
    }

    // SEO Partner specific items
    if (['seoAIAssistant', 'blogManager', 'analytics', 'heatmaps', 'caseStudies'].includes(item.id)) {
      return isSEOPartner(userRole) || canManageCompanies(userRole);
    }

    return false;
  });

  const handleNavClick = (item: NavItemType) => {
    if (item.page) {
      onNavigate(item.page);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 group focus:outline-none"
          >
            <img
              src="/logos/siteflow-logo/site flow.svg"
              alt="Siteflow logo"
              width="32"
              height="32"
              className="h-8 w-auto"
            />
            <span className="text-xl font-serif font-semibold text-white">
              Siteflow
            </span>
          </button>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${currentPage === item.page
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button
            onClick={() => onNavigate('dashboardSettings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'dashboardSettings'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            {t('dashboard.nav.settings')}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('dashboard.nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-slate-600 hover:text-slate-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Page title - hidden on mobile */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-slate-900">
              {t('dashboard.title')}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-medium text-sm">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{user?.role ? getRoleDisplayName(user.role) : ''}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {t('dashboard.nav.profile')}
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('dashboardSettings');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {t('dashboard.nav.settings')}
                    </button>
                    <hr className="my-1 border-slate-200" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      {t('dashboard.nav.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
