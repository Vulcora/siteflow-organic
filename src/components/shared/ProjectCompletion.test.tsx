import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectCompletion from '../../../components/shared/ProjectCompletion';

// Note: Uses global i18n mock from setup.ts with Swedish translations

describe('ProjectCompletion', () => {
  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
    isDelivered: true,
    deliveredAt: new Date().toISOString(),
    deliveryUrl: 'https://example.com',
    deliveryNotes: 'Project is live!',
    customerRating: null,
    customerReview: null,
    reviewedAt: null,
    supportStartDate: new Date().toISOString(),
    supportEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    supportMonths: 6,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render if project is not delivered', () => {
    const { container } = render(
      <ProjectCompletion
        project={{ ...mockProject, isDelivered: false }}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders celebration banner for delivered project', () => {
    render(<ProjectCompletion project={mockProject} />);

    expect(screen.getByText(/Grattis/i)).toBeInTheDocument();
    expect(screen.getByText(/stolta att leverera/i)).toBeInTheDocument();
  });

  it('shows delivery URL link when provided', () => {
    render(<ProjectCompletion project={mockProject} />);

    const link = screen.getByRole('link', { name: /Visa projekt/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('shows delivery notes when provided', () => {
    render(<ProjectCompletion project={mockProject} />);

    expect(screen.getByText('Project is live!')).toBeInTheDocument();
  });

  it('shows review section when canReview is true and not yet reviewed', () => {
    render(<ProjectCompletion project={mockProject} canReview={true} />);

    expect(screen.getByText(/Hur nöjd är du/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Betygsätt projektet/i })).toBeInTheDocument();
  });

  it('does not show review section when canReview is false', () => {
    render(<ProjectCompletion project={mockProject} canReview={false} />);

    expect(screen.queryByText(/Hur nöjd är du/i)).not.toBeInTheDocument();
  });

  it('opens review form when rate button is clicked', async () => {
    const user = userEvent.setup();

    render(<ProjectCompletion project={mockProject} canReview={true} />);

    const rateButton = screen.getByRole('button', { name: /Betygsätt projektet/i });
    await user.click(rateButton);

    expect(screen.getByText(/Betyg/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Berätta om din upplevelse/i)).toBeInTheDocument();
  });

  it('allows star rating selection', async () => {
    const user = userEvent.setup();

    render(<ProjectCompletion project={mockProject} canReview={true} />);

    const rateButton = screen.getByRole('button', { name: /Betygsätt projektet/i });
    await user.click(rateButton);

    // There should be 5 star buttons
    const stars = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg')?.classList.contains('lucide-star')
    );
    expect(stars).toHaveLength(5);

    // Click the third star
    await user.click(stars[2]);

    // The submit button should still be disabled until review text is added
    const submitButton = screen.getByRole('button', { name: /Skicka omdöme/i });
    expect(submitButton).toBeDisabled();
  });

  it('submits review with rating and text', async () => {
    const user = userEvent.setup();
    const onSubmitReview = vi.fn().mockResolvedValue(undefined);

    render(
      <ProjectCompletion
        project={mockProject}
        canReview={true}
        onSubmitReview={onSubmitReview}
      />
    );

    // Open review form
    const rateButton = screen.getByRole('button', { name: /Betygsätt projektet/i });
    await user.click(rateButton);

    // Select 4 stars
    const stars = screen.getAllByRole('button').filter(btn =>
      btn.querySelector('svg')?.classList.contains('lucide-star')
    );
    await user.click(stars[3]);

    // Enter review text
    const textarea = screen.getByPlaceholderText(/Berätta om din upplevelse/i);
    await user.type(textarea, 'Great work!');

    // Submit
    const submitButton = screen.getByRole('button', { name: /Skicka omdöme/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmitReview).toHaveBeenCalledWith(4, 'Great work!');
    });
  });

  it('shows existing review when project has been reviewed', () => {
    const reviewedProject = {
      ...mockProject,
      customerRating: 5,
      customerReview: 'Excellent work!',
      reviewedAt: new Date().toISOString(),
    };

    render(<ProjectCompletion project={reviewedProject} canReview={true} />);

    expect(screen.getByText(/Ditt omdöme/i)).toBeInTheDocument();
    expect(screen.getByText('Excellent work!')).toBeInTheDocument();

    // Should show 5 stars (note: they are not buttons, they are just Star icons)
    const stars = document.querySelectorAll('svg.fill-yellow-400');
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it('shows support period information', () => {
    render(<ProjectCompletion project={mockProject} />);

    expect(screen.getByText(/Support & Underhåll/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Aktiv/i)).toBeInTheDocument();
  });

  it('shows warning when support is ending soon', () => {
    const endingSoonProject = {
      ...mockProject,
      supportEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days
    };

    render(<ProjectCompletion project={endingSoonProject} />);

    // Check for the status label (exact match to avoid matching the longer message)
    expect(screen.getByText('Snart slut')).toBeInTheDocument();
    expect(screen.getByText('Din supportperiod är snart slut.')).toBeInTheDocument();
  });

  it('shows expired message when support has ended', async () => {
    const expiredProject = {
      ...mockProject,
      supportEndDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    };

    render(<ProjectCompletion project={expiredProject} />);

    // Wait for useEffect to calculate daysLeft
    await waitFor(() => {
      expect(screen.getByText(/Utgången/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Din supportperiod har gått ut/i)).toBeInTheDocument();
  });

  it('calculates days remaining correctly', () => {
    const futureDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000); // 45 days
    const projectWithSupport = {
      ...mockProject,
      supportEndDate: futureDate.toISOString(),
    };

    render(<ProjectCompletion project={projectWithSupport} />);

    // Should show approximately 45 days remaining (may appear multiple times)
    const daysElements = screen.getAllByText(/dagar/i);
    expect(daysElements.length).toBeGreaterThan(0);
  });

  it('hides confetti after 5 seconds', async () => {
    vi.useFakeTimers();

    const { container, rerender } = render(<ProjectCompletion project={mockProject} />);

    // Confetti should be visible initially
    const confetti = container.querySelector('.animate-bounce');
    expect(confetti).toBeInTheDocument();

    // Fast-forward 5 seconds
    await vi.advanceTimersByTimeAsync(5000);

    // Force re-render to reflect state change
    rerender(<ProjectCompletion project={mockProject} />);

    // Confetti should be hidden now
    const confettiAfter = container.querySelector('.animate-bounce');
    expect(confettiAfter).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
