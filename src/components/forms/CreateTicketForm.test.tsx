import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/utils';
import CreateTicketForm from '../../../components/forms/CreateTicketForm';

describe('CreateTicketForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSuccess.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render form fields', () => {
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/Titel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Projekt/i)).toBeInTheDocument();
    // Description uses RichTextEditor which doesn't have standard label association
    expect(screen.getByText(/Beskrivning/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prioritet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kategori/i)).toBeInTheDocument();
  });

  it('should render projects in dropdown', async () => {
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
      expect(screen.getByText('Mobile App')).toBeInTheDocument();
    });
  });

  it('should pre-select default project if provided', async () => {
    render(
      <CreateTicketForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        defaultProjectId="project-1"
      />
    );

    await waitFor(() => {
      const projectSelect = screen.getByLabelText(/Projekt/i) as HTMLSelectElement;
      expect(projectSelect.value).toBe('project-1');
    });
  });

  it('should not call onSuccess when title is empty', async () => {
    const user = userEvent.setup();
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /Skapa ärende/i });
    await user.click(submitButton);

    // Wait a bit to ensure the form doesn't submit
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should not call onSuccess when project is not selected', async () => {
    const user = userEvent.setup();
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText(/Titel/i);
    await user.type(titleInput, 'Test Ticket');

    const submitButton = screen.getByRole('button', { name: /Skapa ärende/i });
    await user.click(submitButton);

    // Wait a bit to ensure the form doesn't submit
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    // Fill in required fields
    const titleInput = screen.getByLabelText(/Titel/i);
    await user.type(titleInput, 'Fix navigation bug');

    const projectSelect = screen.getByLabelText(/Projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    // Note: Description field uses RichTextEditor which is complex to interact with in tests
    // We skip filling it as it's not a required field

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Skapa ärende/i });
    await user.click(submitButton);

    // Should call onSuccess after successful submission
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /Avbryt/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should allow changing priority', async () => {
    const user = userEvent.setup();
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const prioritySelect = screen.getByLabelText(/Prioritet/i) as HTMLSelectElement;

    // Default should be medium
    expect(prioritySelect.value).toBe('medium');

    // Change to high
    await user.selectOptions(prioritySelect, 'high');
    expect(prioritySelect.value).toBe('high');
  });

  it('should allow changing category', async () => {
    const user = userEvent.setup();
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const categorySelect = screen.getByLabelText(/Kategori/i) as HTMLSelectElement;

    // Default should be task
    expect(categorySelect.value).toBe('task');

    // Change to bug
    await user.selectOptions(categorySelect, 'bug');
    expect(categorySelect.value).toBe('bug');
  });

  it('should call onSuccess after successful submit', async () => {
    const user = userEvent.setup();
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText(/Titel/i);
    await user.type(titleInput, 'Test Ticket');

    const projectSelect = screen.getByLabelText(/Projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    const submitButton = screen.getByRole('button', { name: /Skapa ärende/i });

    // Click submit
    await user.click(submitButton);

    // Should eventually call onSuccess
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should render all priority options', () => {
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const prioritySelect = screen.getByLabelText(/Prioritet/i);

    expect(screen.getByRole('option', { name: /Låg/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Medel/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Hög/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Kritisk/i })).toBeInTheDocument();
  });

  it('should render all category options', () => {
    render(<CreateTicketForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const categorySelect = screen.getByLabelText(/Kategori/i);

    expect(screen.getByRole('option', { name: /Uppgift/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Bugg/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Funktion/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Support/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Fråga/i })).toBeInTheDocument();
  });
});
