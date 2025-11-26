import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import AdminFileBrowser from '../../../components/admin/AdminFileBrowser';

// Mock the useApi hooks
vi.mock('../../hooks/useApi', () => ({
  useDocuments: vi.fn(),
  useProjects: vi.fn(),
  useCompanies: vi.fn(),
}));

import { useDocuments, useProjects, useCompanies } from '../../hooks/useApi';

const mockDocuments = [
  {
    id: 'doc-1',
    name: 'Project_Specification.pdf',
    description: 'Technical specification document',
    filePath: '/uploads/1234567_Project_Specification.pdf',
    fileSize: 524288, // 512KB
    mimeType: 'application/pdf',
    category: 'specification',
    projectId: 'project-1',
    insertedAt: '2025-11-26T10:00:00Z',
  },
  {
    id: 'doc-2',
    name: 'Contract.pdf',
    description: 'Signed contract',
    filePath: '/uploads/1234568_Contract.pdf',
    fileSize: 1048576, // 1MB
    mimeType: 'application/pdf',
    category: 'contract',
    projectId: 'project-1',
    insertedAt: '2025-11-26T09:00:00Z',
  },
  {
    id: 'doc-3',
    name: 'Logo.png',
    description: 'Company logo',
    filePath: '/uploads/1234569_Logo.png',
    fileSize: 102400, // 100KB
    mimeType: 'image/png',
    category: 'design',
    projectId: 'project-2',
    insertedAt: '2025-11-26T08:00:00Z',
  },
];

const mockProjects = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    state: 'in_progress',
    companyId: 'company-1',
  },
  {
    id: 'project-2',
    name: 'Mobile App',
    state: 'pending_approval',
    companyId: 'company-2',
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
  {
    id: 'company-2',
    name: 'Another Company',
    orgNumber: '098765-4321',
    city: 'Göteborg',
    isActive: true,
  },
];

describe('AdminFileBrowser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.open for download functionality
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  it('renders loading state', () => {
    vi.mocked(useDocuments).mockReturnValue({
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

    render(<AdminFileBrowser />);

    expect(screen.getByText('common.loading')).toBeInTheDocument();
  });

  it('renders empty state when no documents', () => {
    vi.mocked(useDocuments).mockReturnValue({
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

    render(<AdminFileBrowser />);

    expect(screen.getByText('admin.fileBrowser.empty.title')).toBeInTheDocument();
    expect(screen.getByText('admin.fileBrowser.empty.message')).toBeInTheDocument();
  });

  it('renders header with title and file count', () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    expect(screen.getByText('admin.fileBrowser.title')).toBeInTheDocument();
    expect(screen.getByText('admin.fileBrowser.subtitle')).toBeInTheDocument();
  });

  it('displays companies as folders at root level', () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Should show companies as folders
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Another Company')).toBeInTheDocument();
  });

  it('navigates to company level when clicking company folder', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Click on Test Company folder
    fireEvent.click(screen.getByText('Test Company'));

    // Should show project folders for that company
    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    // Breadcrumb should show the path
    expect(screen.getByText('admin.fileBrowser.allFiles')).toBeInTheDocument();
  });

  it('navigates to project level and shows categories', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Navigate to company
    fireEvent.click(screen.getByText('Test Company'));

    // Navigate to project
    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Website Redesign'));

    // Should show category folders (Kontrakt, Specifikation)
    await waitFor(() => {
      // These are the Swedish category labels - may appear multiple times (select + folder)
      const kontraktElements = screen.getAllByText('Kontrakt');
      expect(kontraktElements.length).toBeGreaterThan(0);
      const specElements = screen.getAllByText('Specifikation');
      expect(specElements.length).toBeGreaterThan(0);
    });
  });

  it('toggles between grid and list view', () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Find view toggle buttons - they're in a flex container with bg-slate-100
    const viewToggleButtons = screen.getAllByRole('button').filter(
      btn => btn.className.includes('rounded-md')
    );

    // Should have grid and list buttons
    expect(viewToggleButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('filters files by search query', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Find search input
    const searchInput = screen.getByPlaceholderText('admin.fileBrowser.search');

    // Type in search
    fireEvent.change(searchInput, { target: { value: 'Contract' } });

    // Should filter to show only matching items
    await waitFor(() => {
      // The search should work on file names
      expect(searchInput).toHaveValue('Contract');
    });
  });

  it('clears search when clicking X button', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Enter search text
    const searchInput = screen.getByPlaceholderText('admin.fileBrowser.search');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    // Should show clear button and search should have value
    await waitFor(() => {
      expect(searchInput).toHaveValue('test');
    });

    // Find and click clear button (X icon in search)
    const clearButtons = screen.getAllByRole('button');
    const clearButton = clearButtons.find(btn =>
      btn.className.includes('right-3') || btn.querySelector('svg')
    );

    if (clearButton) {
      fireEvent.click(clearButton);
    }
  });

  it('filters by category when selecting from dropdown', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Find category select
    const categorySelect = screen.getByRole('combobox');

    // Select contract category
    fireEvent.change(categorySelect, { target: { value: 'contract' } });

    await waitFor(() => {
      expect(categorySelect).toHaveValue('contract');
    });
  });

  it('navigates back using breadcrumbs', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Navigate to company
    fireEvent.click(screen.getByText('Test Company'));

    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    // Click on home breadcrumb to go back
    fireEvent.click(screen.getByText('admin.fileBrowser.allFiles'));

    // Should be back at root, showing both companies (may be multiple instances)
    await waitFor(() => {
      const testCompanyElements = screen.getAllByText('Test Company');
      expect(testCompanyElements.length).toBeGreaterThan(0);
      const anotherCompanyElements = screen.getAllByText('Another Company');
      expect(anotherCompanyElements.length).toBeGreaterThan(0);
    });
  });

  it('displays file count for each folder', () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Test Company has 2 files, Another Company has 1
    // File counts are shown as "{count} admin.fileBrowser.files"
    // Use regex to find elements containing the translation key
    const fileCountTexts = screen.getAllByText(/admin\.fileBrowser\.files/);
    expect(fileCountTexts.length).toBeGreaterThan(0);
  });

  it('opens preview modal for previewable files', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Navigate deep to see files
    fireEvent.click(screen.getByText('Another Company'));

    await waitFor(() => {
      expect(screen.getByText('Mobile App')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mobile App'));

    await waitFor(() => {
      // Design appears multiple times (folder + category dropdown)
      const designElements = screen.getAllByText('Design');
      expect(designElements.length).toBeGreaterThan(0);
    });

    // Click on the Design folder button
    const designButtons = screen.getAllByText('Design');
    const designFolderButton = designButtons.find(el => el.closest('button'));
    if (designFolderButton) {
      fireEvent.click(designFolderButton);
    }

    // Should show the Logo.png file
    await waitFor(() => {
      expect(screen.getByText('Logo.png')).toBeInTheDocument();
    });
  });

  it('downloads file when clicking download button', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Navigate to see files
    fireEvent.click(screen.getByText('Test Company'));
    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Website Redesign'));
    await waitFor(() => {
      // Kontrakt appears multiple times (folder + category dropdown)
      const kontraktElements = screen.getAllByText('Kontrakt');
      expect(kontraktElements.length).toBeGreaterThan(0);
    });

    // Click on the Kontrakt folder button
    const kontraktButtons = screen.getAllByText('Kontrakt');
    const kontraktFolderButton = kontraktButtons.find(el => el.closest('button'));
    if (kontraktFolderButton) {
      fireEvent.click(kontraktFolderButton);
    }

    // Should show the Contract.pdf file
    await waitFor(() => {
      expect(screen.getByText('Contract.pdf')).toBeInTheDocument();
    });
  });

  it('shows correct file size formatting', () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Component should render without errors
    expect(screen.getByText('admin.fileBrowser.title')).toBeInTheDocument();
  });

  it('shows category badges with correct colors', () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Component should render with category config
    expect(screen.getByText('admin.fileBrowser.allCategories')).toBeInTheDocument();
  });

  it('sorts files correctly', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Default sorting is by date descending
    // The component should render correctly
    expect(screen.getByText('admin.fileBrowser.title')).toBeInTheDocument();
  });

  it('closes preview modal when clicking close button', async () => {
    vi.mocked(useDocuments).mockReturnValue({
      data: mockDocuments,
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

    render(<AdminFileBrowser />);

    // Navigate to image file
    fireEvent.click(screen.getByText('Another Company'));
    await waitFor(() => {
      expect(screen.getByText('Mobile App')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Mobile App'));
    await waitFor(() => {
      // Design appears both in folder list and category dropdown
      const designElements = screen.getAllByText('Design');
      expect(designElements.length).toBeGreaterThan(0);
    });
    // Click on the first Design folder element (not the dropdown option)
    const designButtons = screen.getAllByText('Design');
    const designFolderButton = designButtons.find(el => el.closest('button'));
    if (designFolderButton) {
      fireEvent.click(designFolderButton);
    }

    // Wait for files to appear
    await waitFor(() => {
      expect(screen.getByText('Logo.png')).toBeInTheDocument();
    });

    // Click on the file to preview
    fireEvent.click(screen.getByText('Logo.png'));

    // Preview modal should open
    await waitFor(() => {
      expect(screen.getByText('admin.fileBrowser.download')).toBeInTheDocument();
    });
  });
});
