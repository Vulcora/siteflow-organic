import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InviteUserForm from '../../../components/forms/InviteUserForm';

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

describe('InviteUserForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields correctly', async () => {
    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/e-postadress/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/företag/i)).toBeInTheDocument();
      expect(screen.getByText('Roll')).toBeInTheDocument();
      expect(screen.getByText('Kund')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /skicka inbjudan/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /avbryt/i })).toBeInTheDocument();
    });
  });

  it('should have email field marked as required', async () => {
    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/e-postadress/i) as HTMLInputElement;
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput.type).toBe('email');
    });
  });

  it('should have company field marked as required', async () => {
    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const companySelect = screen.getByLabelText(/företag/i) as HTMLSelectElement;
      expect(companySelect).toHaveAttribute('required');
    });
  });

  it('should submit successfully with valid data', async () => {
    const user = userEvent.setup();

    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/e-postadress/i)).toBeInTheDocument();
    });

    // Fill in valid data
    const emailInput = screen.getByLabelText(/e-postadress/i);
    await user.type(emailInput, 'newuser@example.com');

    const companySelect = screen.getByLabelText(/företag/i);
    await user.selectOptions(companySelect, 'company-1');

    // Submit form
    await user.click(screen.getByRole('button', { name: /skicka inbjudan/i }));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /avbryt/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /avbryt/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should prefill and disable company field when defaultCompanyId is provided', async () => {
    render(
      <InviteUserForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        defaultCompanyId="company-1"
      />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const companySelect = screen.getByLabelText(/företag/i) as HTMLSelectElement;
      expect(companySelect).toBeDisabled();
      expect(companySelect.value).toBe('company-1');
    });
  });

  it('should load and display available companies', async () => {
    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const companySelect = screen.getByLabelText(/företag/i);
      expect(companySelect).toBeInTheDocument();

      // Check that options are loaded
      expect(screen.getByText('Test Company (123456-7890)')).toBeInTheDocument();
      expect(screen.getByText('Another Company (098765-4321)')).toBeInTheDocument();
    });
  });

  it('should update form fields when user types', async () => {
    const user = userEvent.setup();

    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/e-postadress/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/e-postadress/i) as HTMLInputElement;
    await user.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');

    const companySelect = screen.getByLabelText(/företag/i) as HTMLSelectElement;
    await user.selectOptions(companySelect, 'company-1');

    expect(companySelect.value).toBe('company-1');
  });

  it('should show helper text for email and role fields', async () => {
    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(screen.getByText('En inbjudan skickas till denna e-postadress')).toBeInTheDocument();
      expect(screen.getByText('Användaren får tillgång till kundportalen')).toBeInTheDocument();
    });
  });

  it('should have correct input attributes', async () => {
    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/e-postadress/i) as HTMLInputElement;
      expect(emailInput.type).toBe('email');
      expect(emailInput.placeholder).toBe('exempel@foretagsmail.se');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('name', 'email');
    });
  });

  it('should display role as non-editable "Kund"', async () => {
    render(
      <InviteUserForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />,
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      // Role should be displayed as text, not as an input field
      expect(screen.getByText('Kund')).toBeInTheDocument();

      // Should not have a role input/select field
      expect(screen.queryByLabelText(/roll/i)).not.toBeInTheDocument();
    });
  });
});
