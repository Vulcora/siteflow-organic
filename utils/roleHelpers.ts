// Role type definitions matching backend
export type UserRole =
  | 'siteflow_admin'
  | 'siteflow_kam'
  | 'siteflow_pl'
  | 'siteflow_dev_frontend'
  | 'siteflow_dev_backend'
  | 'siteflow_dev_fullstack'
  | 'customer'
  | 'partner'
  | 'seo_partner';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  specialization?: string;
  company_id?: string;
  account_manager_id?: string;
}

// Role checking functions
export const isSiteflowStaff = (role: UserRole): boolean => {
  return [
    'siteflow_admin',
    'siteflow_kam',
    'siteflow_pl',
    'siteflow_dev_frontend',
    'siteflow_dev_backend',
    'siteflow_dev_fullstack',
  ].includes(role);
};

export const isAdmin = (role: UserRole): boolean => {
  return role === 'siteflow_admin';
};

export const isKAM = (role: UserRole): boolean => {
  return role === 'siteflow_kam';
};

export const isProjectLeader = (role: UserRole): boolean => {
  return role === 'siteflow_pl';
};

export const isDeveloper = (role: UserRole): boolean => {
  return [
    'siteflow_dev_frontend',
    'siteflow_dev_backend',
    'siteflow_dev_fullstack',
  ].includes(role);
};

export const isCustomer = (role: UserRole): boolean => {
  return role === 'customer';
};

export const isPartner = (role: UserRole): boolean => {
  return role === 'partner';
};

export const isSEOPartner = (role: UserRole): boolean => {
  return role === 'seo_partner';
};

export const canInviteUsers = (role: UserRole): boolean => {
  return ['siteflow_admin', 'siteflow_kam'].includes(role);
};

export const canManageProjects = (role: UserRole): boolean => {
  return ['siteflow_admin', 'siteflow_pl', 'siteflow_kam'].includes(role);
};

export const canViewAllCustomers = (role: UserRole): boolean => {
  return ['siteflow_admin', 'siteflow_kam'].includes(role);
};

export const canManageCompanies = (role: UserRole): boolean => {
  return role === 'siteflow_admin';
};

export const canLogTime = (role: UserRole): boolean => {
  return isSiteflowStaff(role);
};

// Get user's dashboard type based on role
export const getDashboardType = (role: UserRole): string => {
  if (isAdmin(role)) return 'admin';
  if (isKAM(role)) return 'kam';
  if (isProjectLeader(role)) return 'project-leader';
  if (isDeveloper(role)) return 'developer';
  if (isCustomer(role)) return 'customer';
  if (isPartner(role)) return 'partner';
  if (isSEOPartner(role)) return 'seo-partner';
  return 'customer'; // fallback
};

// Get role display name for UI
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    siteflow_admin: 'Administrator',
    siteflow_kam: 'Key Account Manager',
    siteflow_pl: 'Project Leader',
    siteflow_dev_frontend: 'Frontend Developer',
    siteflow_dev_backend: 'Backend Developer',
    siteflow_dev_fullstack: 'Fullstack Developer',
    customer: 'Kund',
    partner: 'Partner',
    seo_partner: 'SEO Partner',
  };
  return roleNames[role] || role;
};
