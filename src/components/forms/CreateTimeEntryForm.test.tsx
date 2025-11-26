import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreateTimeEntryForm from '../../../components/forms/CreateTimeEntryForm';

// Mock the useAuth hook
const mockGetAuthHeaders = vi.fn(() => ({ 'Authorization': 'Bearer mock-token' }));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      email: 'admin@siteflow.se',
      role: 'siteflow_admin',
      companyId: null,
    },
    token: 'mock-token',
    isAuthenticated: true,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    getAuthHeaders: mockGetAuthHeaders,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('CreateTimeEntryForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', async () => {
    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/timmar/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/datum/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/projekt/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/beskrivning/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /spara tid/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /avbryt/i })).toBeInTheDocument();
    });
  });

  it('should have hours field marked as required', async () => {
    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const hoursInput = screen.getByLabelText(/timmar/i) as HTMLInputElement;
      expect(hoursInput).toHaveAttribute('required');
      expect(hoursInput.type).toBe('number');
      expect(hoursInput.min).toBe('0');
      expect(hoursInput.max).toBe('24');
      expect(hoursInput.step).toBe('0.25');
    });
  });

  it('should have date field marked as required with today as default', async () => {
    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const dateInput = screen.getByLabelText(/datum/i) as HTMLInputElement;
      expect(dateInput).toHaveAttribute('required');
      expect(dateInput.type).toBe('date');

      // Check that it has a default value (today's date)
      expect(dateInput.value).toBeTruthy();
    });
  });

  it('should have project field marked as required', async () => {
    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const projectSelect = screen.getByLabelText(/projekt/i) as HTMLSelectElement;
      expect(projectSelect).toHaveAttribute('required');
    });
  });

  it('should load and display available projects', async () => {
    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const projectSelect = screen.getByLabelText(/projekt/i);
      expect(projectSelect).toBeInTheDocument();

      // Check that options are loaded
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
      expect(screen.getByText('Mobile App')).toBeInTheDocument();
    });
  });

  it('should submit successfully with valid data', async () => {
    const user = userEvent.setup();

    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/timmar/i)).toBeInTheDocument();
    });

    // Fill in valid data
    const hoursInput = screen.getByLabelText(/timmar/i);
    await user.clear(hoursInput);
    await user.type(hoursInput, '8');

    const projectSelect = screen.getByLabelText(/projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    // Submit form
    await user.click(screen.getByRole('button', { name: /spara tid/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /avbryt/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /avbryt/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should update form fields when user types', async () => {
    const user = userEvent.setup();

    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/timmar/i)).toBeInTheDocument();
    });

    const hoursInput = screen.getByLabelText(/timmar/i) as HTMLInputElement;
    await user.clear(hoursInput);
    await user.type(hoursInput, '4.5');

    expect(hoursInput.value).toBe('4.5');

    const descriptionInput = screen.getByLabelText(/beskrivning/i) as HTMLTextAreaElement;
    await user.type(descriptionInput, 'Worked on feature implementation');

    expect(descriptionInput.value).toBe('Worked on feature implementation');
  });

  it('should prefill and disable project field when defaultProjectId is provided', async () => {
    render(
      <CreateTimeEntryForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        defaultProjectId="project-1"
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const projectSelect = screen.getByLabelText(/projekt/i) as HTMLSelectElement;
      expect(projectSelect).toBeDisabled();
      expect(projectSelect.value).toBe('project-1');
    });
  });

  it('should show ticket selection when project is selected', async () => {
    const user = userEvent.setup();

    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    // Initially, ticket field should not be visible
    expect(screen.queryByLabelText(/ärende/i)).not.toBeInTheDocument();

    // Select a project
    const projectSelect = screen.getByLabelText(/projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    // Now ticket field should appear
    await waitFor(() => {
      expect(screen.getByLabelText(/ärende/i)).toBeInTheDocument();
    });
  });

  it('should show helper text for hours field', async () => {
    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText(/Ange timmar/i)).toBeInTheDocument();
    });
  });

  it('should have correct input attributes', async () => {
    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const hoursInput = screen.getByLabelText(/timmar/i) as HTMLInputElement;
      expect(hoursInput.type).toBe('number');
      expect(hoursInput.placeholder).toBe('8.0');
      expect(hoursInput).toHaveAttribute('required');
      expect(hoursInput).toHaveAttribute('name', 'hours');
      expect(hoursInput.min).toBe('0');
      expect(hoursInput.max).toBe('24');
    });
  });

  it('should clear ticket selection when project changes', async () => {
    const user = userEvent.setup();

    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    // Select first project
    const projectSelect = screen.getByLabelText(/projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    // Wait for ticket field to appear and select a ticket
    await waitFor(() => {
      expect(screen.getByLabelText(/ärende/i)).toBeInTheDocument();
    });

    const ticketSelect = screen.getByLabelText(/ärende/i) as HTMLSelectElement;
    await user.selectOptions(ticketSelect, 'ticket-1');

    expect(ticketSelect.value).toBe('ticket-1');

    // Change project
    await user.selectOptions(projectSelect, 'project-2');

    // Ticket selection should be cleared
    await waitFor(() => {
      const ticketSelectAfter = screen.getByLabelText(/ärende/i) as HTMLSelectElement;
      expect(ticketSelectAfter.value).toBe('');
    });
  });

  it('should show description as optional', async () => {
    render(
      <CreateTimeEntryForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const descriptionLabel = screen.getByText(/Beskrivning \(valfritt\)/i);
      expect(descriptionLabel).toBeInTheDocument();
    });
  });
});
