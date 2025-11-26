import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import AdminFormResponseView from '../../../components/admin/AdminFormResponseView';

// Mock the useApi hooks
vi.mock('../../hooks/useApi', () => ({
  useAllFormResponses: vi.fn(),
  useProjects: vi.fn(),
  useCompanies: vi.fn(),
  useToggleProjectPriority: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
  useInternalNotes: vi.fn(() => ({ data: [], isLoading: false })),
  useCreateInternalNote: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useDeleteInternalNote: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

// Mock the form schema
vi.mock('../../config/formSchema', () => ({
  getFormSchema: vi.fn((formType: string) => {
    if (formType === 'website') {
      return {
        formType: 'website',
        sections: [
          {
            key: 'basic_info',
            fields: [
              { key: 'company_name', type: 'text', required: true },
              { key: 'contact_email', type: 'email', required: true },
            ],
          },
          {
            key: 'goals',
            fields: [
              { key: 'primary_goal', type: 'radio', required: true },
            ],
          },
        ],
      };
    }
    return null;
  }),
  websiteFormSchema: {
    formType: 'website',
    sections: [],
  },
  systemFormSchema: {
    formType: 'system',
    sections: [],
  },
}));

import { useAllFormResponses, useProjects, useCompanies } from '../../hooks/useApi';

const mockFormResponses = [
  {
    id: 'response-1',
    projectId: 'project-1',
    formType: 'website',
    section: 'basic_info',
    questionKey: 'company_name',
    answerValue: { value: 'Test Company AB' },
    answerMetadata: null,
    insertedAt: '2025-11-26T10:00:00Z',
    updatedAt: '2025-11-26T10:00:00Z',
  },
  {
    id: 'response-2',
    projectId: 'project-1',
    formType: 'website',
    section: 'basic_info',
    questionKey: 'contact_email',
    answerValue: { value: 'contact@test.com' },
    answerMetadata: null,
    insertedAt: '2025-11-26T10:00:00Z',
    updatedAt: '2025-11-26T10:30:00Z',
  },
  {
    id: 'response-3',
    projectId: 'project-1',
    formType: 'website',
    section: 'goals',
    questionKey: 'primary_goal',
    answerValue: { value: 'lead_generation' },
    answerMetadata: null,
    insertedAt: '2025-11-26T11:00:00Z',
    updatedAt: '2025-11-26T11:00:00Z',
  },
];

const mockProjects = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    state: 'in_progress',
    companyId: 'company-1',
    isPriority: false,
  },
  {
    id: 'project-2',
    name: 'Mobile App',
    state: 'pending_approval',
    companyId: 'company-1',
    isPriority: true,
  },
];

const mockCompanies = [
  {
    id: 'company-1',
    name: 'Test Company',
    orgNumber: '123456-7890',
    city: 'Stockholm',
    isActive: true,
  },
];

describe('AdminFormResponseView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(useAllFormResponses).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    expect(screen.getByText('common.loading')).toBeInTheDocument();
  });

  it('renders empty state when no form responses', () => {
    vi.mocked(useAllFormResponses).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: mockCompanies,
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    expect(screen.getByText('admin.formResponses.empty.title')).toBeInTheDocument();
    expect(screen.getByText('admin.formResponses.empty.message')).toBeInTheDocument();
  });

  it('renders grouped form responses', () => {
    vi.mocked(useAllFormResponses).mockReturnValue({
      data: mockFormResponses,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: mockCompanies,
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    // Should show header
    expect(screen.getByText('admin.formResponses.title')).toBeInTheDocument();

    // Should show project name
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();

    // Should show company name
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });

  it('displays progress information', () => {
    vi.mocked(useAllFormResponses).mockReturnValue({
      data: mockFormResponses,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: mockCompanies,
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    // Progress should be shown (3 out of 3 fields answered)
    expect(screen.getByText('3/3')).toBeInTheDocument();
  });

  it('expands section overview when clicking on project row', async () => {
    vi.mocked(useAllFormResponses).mockReturnValue({
      data: mockFormResponses,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: mockCompanies,
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    // Find and click the project row to expand it
    const projectRow = screen.getByText('Website Redesign').closest('.cursor-pointer');
    expect(projectRow).toBeInTheDocument();

    if (projectRow) {
      fireEvent.click(projectRow);
    }

    // After clicking, the section overview should be visible
    await waitFor(() => {
      expect(screen.getByText('admin.formResponses.sectionOverview')).toBeInTheDocument();
    });
  });

  it('opens detail modal when clicking view button', async () => {
    vi.mocked(useAllFormResponses).mockReturnValue({
      data: mockFormResponses,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: mockCompanies,
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    // Find the view button (Eye icon button)
    const viewButton = screen.getByTitle('admin.formResponses.viewDetails');
    fireEvent.click(viewButton);

    // Modal should open showing project name and company
    await waitFor(() => {
      // Modal should show project name in header
      const headers = screen.getAllByText('Website Redesign');
      expect(headers.length).toBeGreaterThanOrEqual(1);

      // Modal should show company name
      const companyNames = screen.getAllByText('Test Company');
      expect(companyNames.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows form type icons correctly', () => {
    vi.mocked(useAllFormResponses).mockReturnValue({
      data: mockFormResponses,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: mockCompanies,
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    // Form type badge should be visible (multiple elements with same text exist)
    const websiteLabels = screen.getAllByText('admin.formResponses.types.website');
    expect(websiteLabels.length).toBeGreaterThan(0);
  });

  it('closes detail modal when clicking close button', async () => {
    vi.mocked(useAllFormResponses).mockReturnValue({
      data: mockFormResponses,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: mockCompanies,
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    // Open the modal first
    const viewButton = screen.getByTitle('admin.formResponses.viewDetails');
    fireEvent.click(viewButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText('common.close')).toBeInTheDocument();
    });

    // Click close button
    fireEvent.click(screen.getByText('common.close'));

    // Modal should close - check that the close button is no longer visible
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('groups responses by project correctly', () => {
    // Add responses from multiple projects
    const multiProjectResponses = [
      ...mockFormResponses,
      {
        id: 'response-4',
        projectId: 'project-2',
        formType: 'website',
        section: 'basic_info',
        questionKey: 'company_name',
        answerValue: { value: 'Another Company' },
        answerMetadata: null,
        insertedAt: '2025-11-26T12:00:00Z',
        updatedAt: '2025-11-26T12:00:00Z',
      },
    ];

    vi.mocked(useAllFormResponses).mockReturnValue({
      data: multiProjectResponses,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: mockCompanies,
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    // Both projects should be visible
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('Mobile App')).toBeInTheDocument();
  });

  it('displays subtitle with correct count', () => {
    vi.mocked(useAllFormResponses).mockReturnValue({
      data: mockFormResponses,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useProjects).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null,
    } as any);
    vi.mocked(useCompanies).mockReturnValue({
      data: mockCompanies,
      isLoading: false,
      error: null,
    } as any);

    render(<AdminFormResponseView />);

    // Subtitle should show count (1 project with responses)
    expect(screen.getByText('admin.formResponses.subtitle')).toBeInTheDocument();
  });
});
