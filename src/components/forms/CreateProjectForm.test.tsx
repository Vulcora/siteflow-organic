import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/utils';
import CreateProjectForm from '../../../components/forms/CreateProjectForm';

describe('CreateProjectForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSuccess.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render form fields', () => {
    render(<CreateProjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/Projektnamn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Företag/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Beskrivning/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Startdatum/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Målslutdatum/i)).toBeInTheDocument();
  });

  it('should render companies in dropdown', async () => {
    render(<CreateProjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const companySelect = screen.getByLabelText(/Företag/i) as HTMLSelectElement;

    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
      expect(screen.getByText('Another Company')).toBeInTheDocument();
    });
  });

  it('should not call onSuccess when name is empty', async () => {
    const user = userEvent.setup();
    render(<CreateProjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /Skapa projekt/i });
    await user.click(submitButton);

    // Wait a bit to ensure the form doesn't submit
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should not call onSuccess when company is not selected', async () => {
    const user = userEvent.setup();
    render(<CreateProjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Projektnamn/i);
    await user.type(nameInput, 'Test Project');

    const submitButton = screen.getByRole('button', { name: /Skapa projekt/i });
    await user.click(submitButton);

    // Wait a bit to ensure the form doesn't submit
    await new Promise(resolve => setTimeout(resolve, 500));

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<CreateProjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Wait for companies to load
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });

    // Fill in required fields
    const nameInput = screen.getByLabelText(/Projektnamn/i);
    await user.type(nameInput, 'New Website Project');

    const companySelect = screen.getByLabelText(/Företag/i);
    await user.selectOptions(companySelect, 'company-1');

    const descriptionInput = screen.getByLabelText(/Beskrivning/i);
    await user.type(descriptionInput, 'A new website for the client');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Skapa projekt/i });
    await user.click(submitButton);

    // Should call onSuccess after successful submission
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<CreateProjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /Avbryt/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onSuccess after successful submit', async () => {
    const user = userEvent.setup();
    render(<CreateProjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Wait for companies to load
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText(/Projektnamn/i);
    await user.type(nameInput, 'Test Project');

    const companySelect = screen.getByLabelText(/Företag/i);
    await user.selectOptions(companySelect, 'company-1');

    const submitButton = screen.getByRole('button', { name: /Skapa projekt/i });

    // Click submit
    await user.click(submitButton);

    // Should eventually call onSuccess
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should allow optional fields to be empty', async () => {
    const user = userEvent.setup();
    render(<CreateProjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });

    // Fill only required fields
    const nameInput = screen.getByLabelText(/Projektnamn/i);
    await user.type(nameInput, 'Minimal Project');

    const companySelect = screen.getByLabelText(/Företag/i);
    await user.selectOptions(companySelect, 'company-1');

    // Submit without optional fields
    const submitButton = screen.getByRole('button', { name: /Skapa projekt/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should accept budget and date inputs', async () => {
    const user = userEvent.setup();
    render(<CreateProjectForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });

    const budgetInput = screen.getByLabelText(/Budget/i);
    await user.type(budgetInput, '100000');
    expect((budgetInput as HTMLInputElement).value).toBe('100000');

    const startDateInput = screen.getByLabelText(/Startdatum/i);
    await user.type(startDateInput, '2025-01-01');
    expect((startDateInput as HTMLInputElement).value).toBe('2025-01-01');

    const endDateInput = screen.getByLabelText(/Målslutdatum/i);
    await user.type(endDateInput, '2025-12-31');
    expect((endDateInput as HTMLInputElement).value).toBe('2025-12-31');
  });
});
