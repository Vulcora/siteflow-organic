import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../src/test/utils';
import userEvent from '@testing-library/user-event';
import DynamicProjectForm from './DynamicProjectForm';

describe('DynamicProjectForm', () => {
  let defaultProps: {
    projectId: string;
    onSave: ReturnType<typeof vi.fn>;
    onSubmit: ReturnType<typeof vi.fn>;
    onCancel: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    defaultProps = {
      projectId: 'project-1',
      onSave: vi.fn().mockResolvedValue(undefined),
      onSubmit: vi.fn().mockResolvedValue(undefined),
      onCancel: vi.fn(),
    };
  });

  describe('Form Type Selection', () => {
    it('should render form type selection when no initial type', () => {
      render(<DynamicProjectForm {...defaultProps} />);

      // Should show the form type selection screen
      expect(screen.getByText('projectForm.title')).toBeInTheDocument();
      expect(screen.getByText('projectForm.formTypes.website')).toBeInTheDocument();
      expect(screen.getByText('projectForm.formTypes.system')).toBeInTheDocument();
      expect(screen.getByText('projectForm.formTypes.both')).toBeInTheDocument();
    });

    it('should transition to website form when website is selected', async () => {
      const user = userEvent.setup();
      render(<DynamicProjectForm {...defaultProps} />);

      const websiteButton = screen.getByText('projectForm.formTypes.website');
      await user.click(websiteButton);

      // Should now show the first section of website form (appears in both tab and heading)
      await waitFor(() => {
        const basicInfoElements = screen.getAllByText('projectForm.sections.basic_info');
        expect(basicInfoElements.length).toBeGreaterThan(0);
      });
    });

    it('should transition to system form when system is selected', async () => {
      const user = userEvent.setup();
      render(<DynamicProjectForm {...defaultProps} />);

      const systemButton = screen.getByText('projectForm.formTypes.system');
      await user.click(systemButton);

      // Should now show the first section of system form (appears in both tab and heading)
      await waitFor(() => {
        const overviewElements = screen.getAllByText('projectForm.system.sections.overview');
        expect(overviewElements.length).toBeGreaterThan(0);
      });
    });

    it('should skip type selection when initialFormType is provided', () => {
      render(<DynamicProjectForm {...defaultProps} initialFormType="website" />);

      // Should immediately show the first section (appears in both tab and heading)
      const basicInfoElements = screen.getAllByText('projectForm.sections.basic_info');
      expect(basicInfoElements.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation', () => {
    it('should show progress bar', () => {
      render(<DynamicProjectForm {...defaultProps} initialFormType="website" />);

      expect(screen.getByText(/projectForm.progress.step/)).toBeInTheDocument();
      expect(screen.getByText(/projectForm.progress.of/)).toBeInTheDocument();
    });

    it('should show next button', () => {
      render(<DynamicProjectForm {...defaultProps} initialFormType="website" />);

      expect(screen.getByText('projectForm.actions.next')).toBeInTheDocument();
    });

    it('should show save button when onSave is provided', () => {
      render(<DynamicProjectForm {...defaultProps} initialFormType="website" />);

      expect(screen.getByText('projectForm.actions.save')).toBeInTheDocument();
    });

    it('should have disabled previous button on first section', () => {
      render(<DynamicProjectForm {...defaultProps} initialFormType="website" />);

      const prevButton = screen.getByText('projectForm.actions.previous');
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Form Fields', () => {
    it('should render text inputs in basic_info section', () => {
      render(<DynamicProjectForm {...defaultProps} initialFormType="website" />);

      const textInputs = screen.getAllByRole('textbox');
      expect(textInputs.length).toBeGreaterThan(0);
    });

    it('should render section tabs', () => {
      render(<DynamicProjectForm {...defaultProps} initialFormType="website" />);

      // Check for some section tab buttons (appears in both tab and heading)
      const basicInfoElements = screen.getAllByText('projectForm.sections.basic_info');
      expect(basicInfoElements.length).toBeGreaterThan(0);
    });
  });

  describe('Initial Values', () => {
    it('should populate fields with initial values', () => {
      render(
        <DynamicProjectForm
          {...defaultProps}
          initialFormType="website"
          initialValues={{
            company_name: 'Initial Company',
            contact_email: 'initial@test.com',
          }}
        />
      );

      const companyNameInput = screen.getAllByRole('textbox')[0] as HTMLInputElement;
      expect(companyNameInput.value).toBe('Initial Company');
    });
  });

  describe('Save Draft', () => {
    it('should call onSave when save button is clicked', async () => {
      const onSave = vi.fn().mockResolvedValue(undefined);
      const user = userEvent.setup();
      render(
        <DynamicProjectForm
          {...defaultProps}
          initialFormType="website"
          onSave={onSave}
          initialValues={{
            company_name: 'Test Company',
          }}
        />
      );

      const saveButton = screen.getByText('projectForm.actions.save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalledWith('website', expect.any(Object));
      });
    });
  });
});
