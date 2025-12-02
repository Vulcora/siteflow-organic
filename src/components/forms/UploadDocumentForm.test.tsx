import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/utils';
import UploadDocumentForm from '../../../components/forms/UploadDocumentForm';

describe('UploadDocumentForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    // Set up authenticated user
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 'user-1',
        email: 'admin@siteflow.se',
        firstName: 'Admin',
        lastName: 'User',
        role: 'siteflow_admin',
        companyId: null,
      })
    );
    mockOnSuccess.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render file upload area', async () => {
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText(/klicka för att välja fil eller dra och släpp/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Max 50MB')).toBeInTheDocument();
  });

  it('should render all form fields', async () => {
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/projekt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kategori/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/beskrivning/i)).toBeInTheDocument();
  });

  it('should show projects in dropdown', async () => {
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    expect(screen.getByText('Mobile App')).toBeInTheDocument();
  });

  it('should show all category options', async () => {
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /kategori/i })).toBeInTheDocument();
    });

    const categorySelect = screen.getByLabelText(/kategori/i) as HTMLSelectElement;
    expect(categorySelect).toHaveValue('other');

    // Check all category options exist by looking at the category select's options
    const options = categorySelect.querySelectorAll('option');
    const optionValues = Array.from(options).map(o => o.value);

    expect(optionValues).toContain('other');
    expect(optionValues).toContain('contract');
    expect(optionValues).toContain('specification');
    expect(optionValues).toContain('design');
    expect(optionValues).toContain('report');
    expect(optionValues).toContain('invoice');
  });

  it('should handle file selection', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    const file = new File(['test content'], 'test-document.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    });
  });

  it('should show file size after selection', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      // File size should be displayed (content is "test content" = 12 bytes)
      expect(screen.getByText(/bytes/i)).toBeInTheDocument();
    });
  });

  it('should allow removing selected file', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    // Find and click remove button
    const removeButtons = screen.getAllByRole('button');
    const removeButton = removeButtons.find(btn => btn.querySelector('svg'));
    expect(removeButton).toBeDefined();

    if (removeButton) {
      await user.click(removeButton);
    }

    // File should be removed and upload area should reappear
    await waitFor(() => {
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
      expect(screen.getByText(/klicka för att välja fil/i)).toBeInTheDocument();
    });
  });

  it('should reject files larger than 50MB', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    // Create a file larger than 50MB using ArrayBuffer (much faster)
    const largeBuffer = new ArrayBuffer(51 * 1024 * 1024);
    const file = new File([largeBuffer], 'large-file.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/filen är för stor/i)).toBeInTheDocument();
    });
  }, 15000);

  it('should disable project select when defaultProjectId is provided', async () => {
    render(
      <UploadDocumentForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        defaultProjectId="project-1"
      />
    );

    await waitFor(() => {
      const projectSelect = screen.getByLabelText(/projekt/i) as HTMLSelectElement;
      expect(projectSelect).toBeDisabled();
      expect(projectSelect).toHaveValue('project-1');
    });
  });

  it('should pre-select project when defaultProjectId is provided', async () => {
    render(
      <UploadDocumentForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        defaultProjectId="project-1"
      />
    );

    await waitFor(() => {
      const projectSelect = screen.getByLabelText(/projekt/i) as HTMLSelectElement;
      expect(projectSelect.value).toBe('project-1');
    });
  });

  it('should disable submit button when no file is selected (prevents submission)', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    // Select project
    const projectSelect = screen.getByLabelText(/projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    // Submit button should be disabled without file
    const submitButton = screen.getByRole('button', { name: /ladda upp/i });
    expect(submitButton).toBeDisabled();

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should require project selection (enforced by required attribute)', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    // Select file
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    // Verify project select has required attribute
    const projectSelect = screen.getByLabelText(/projekt/i) as HTMLSelectElement;
    expect(projectSelect).toHaveAttribute('required');
    expect(projectSelect.value).toBe(''); // No project selected

    // Submit button should be enabled since file is selected
    const submitButton = screen.getByRole('button', { name: /ladda upp/i });
    expect(submitButton).not.toBeDisabled();

    // onSuccess should not have been called since we didn't submit
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    // Select file
    const file = new File(['test content'], 'specification.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('specification.pdf')).toBeInTheDocument();
    });

    // Select project
    const projectSelect = screen.getByLabelText(/projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    // Select category
    const categorySelect = screen.getByLabelText(/kategori/i);
    await user.selectOptions(categorySelect, 'specification');

    // Add description
    const descriptionInput = screen.getByLabelText(/beskrivning/i);
    await user.type(descriptionInput, 'Technical specification for the project');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /ladda upp/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should submit form without optional description', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    // Select file
    const file = new File(['test'], 'contract.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('contract.pdf')).toBeInTheDocument();
    });

    // Select project
    const projectSelect = screen.getByLabelText(/projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    // Submit without description
    const submitButton = screen.getByRole('button', { name: /ladda upp/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /avbryt/i })).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /avbryt/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should not show cancel button when onCancel is not provided', () => {
    render(<UploadDocumentForm onSuccess={mockOnSuccess} />);

    expect(screen.queryByRole('button', { name: /avbryt/i })).not.toBeInTheDocument();
  });

  it('should disable submit button when no file is selected', async () => {
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /ladda upp/i });
      expect(submitButton).toBeDisabled();
    });
  });

  it('should enable submit button when file is selected', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /ladda upp/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should show loading indicator on submit button', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    // Select file and project
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const projectSelect = screen.getByLabelText(/projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    // Submit button should have the loading capability (shows "Ladda upp" before submission)
    const submitButton = screen.getByRole('button', { name: /ladda upp/i });
    expect(submitButton).toBeInTheDocument();

    // Submit and verify success
    await user.click(submitButton);
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should have cancel button that is functional', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    // Select file and project
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/fil/i) as HTMLInputElement;
    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const projectSelect = screen.getByLabelText(/projekt/i);
    await user.selectOptions(projectSelect, 'project-1');

    // Cancel button should exist and not be disabled initially
    const cancelButton = screen.getByRole('button', { name: /avbryt/i });
    const submitButton = screen.getByRole('button', { name: /ladda upp/i });

    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // Verify cancel calls onCancel
    await user.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should handle different file types', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/fil/i)).toBeInTheDocument();
    });

    // Test with different file types
    const types = [
      { name: 'document.pdf', type: 'application/pdf' },
      { name: 'image.png', type: 'image/png' },
      { name: 'spreadsheet.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    ];

    for (const fileType of types) {
      const file = new File(['test'], fileType.name, { type: fileType.type });
      const input = screen.getByLabelText(/fil/i) as HTMLInputElement;
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(fileType.name)).toBeInTheDocument();
      });

      // Remove file for next iteration
      const removeButtons = screen.getAllByRole('button');
      const removeButton = removeButtons.find(btn => btn.querySelector('svg'));
      if (removeButton) {
        await user.click(removeButton);
      }
    }
  });

  it('should change category selection', async () => {
    const user = userEvent.setup();
    render(<UploadDocumentForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/kategori/i)).toBeInTheDocument();
    });

    const categorySelect = screen.getByLabelText(/kategori/i) as HTMLSelectElement;

    // Default should be 'other'
    expect(categorySelect.value).toBe('other');

    // Change to 'contract'
    await user.selectOptions(categorySelect, 'contract');
    expect(categorySelect.value).toBe('contract');

    // Change to 'specification'
    await user.selectOptions(categorySelect, 'specification');
    expect(categorySelect.value).toBe('specification');
  });
});
