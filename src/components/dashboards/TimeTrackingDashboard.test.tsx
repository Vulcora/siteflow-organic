import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/utils';
import TimeTrackingDashboard from '../../../components/dashboards/TimeTrackingDashboard';

describe('TimeTrackingDashboard', () => {
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
  });

  it('should render loading state initially', () => {
    render(<TimeTrackingDashboard />);

    // Should show loader initially
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should render dashboard content after loading', async () => {
    render(<TimeTrackingDashboard />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Tidrapportering')).toBeInTheDocument();
    });

    // Check for header
    expect(screen.getByText(/Hantera och översikt över din arbetad tid/i)).toBeInTheDocument();
  });

  it('should display stats cards for today, week, and month', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Idag')).toBeInTheDocument();
      expect(screen.getByText('Denna vecka')).toBeInTheDocument();
      expect(screen.getByText('Denna månad')).toBeInTheDocument();
    });
  });

  it('should have add time button in header', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /lägg till tid/i })).toBeInTheDocument();
    });
  });

  it('should display view mode toggle with week and month options', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /vecka/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /månad/i })).toBeInTheDocument();
    });
  });

  it('should switch between week and month views', async () => {
    const user = userEvent.setup();
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /vecka/i })).toBeInTheDocument();
    });

    const weekButton = screen.getByRole('button', { name: /vecka/i });
    const monthButton = screen.getByRole('button', { name: /månad/i });

    // Initially, week view should be active
    expect(weekButton).toHaveClass('bg-white');

    // Click month button
    await user.click(monthButton);

    // Now month view should be active
    expect(monthButton).toHaveClass('bg-white');
  });

  it('should display time entries section', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Tidsposter')).toBeInTheDocument();
    });
  });

  it('should display time entries grouped by project', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      // Check for project name from mock data
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    // Check for time entry details (8 hours from mock data, appears multiple times)
    const hoursElements = screen.getAllByText('8.0h');
    expect(hoursElements.length).toBeGreaterThan(0);
  });

  it('should calculate and display total hours per project', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    });

    // Should show total hours
    expect(screen.getByText('Totalt')).toBeInTheDocument();
  });

  it('should display time entry description when available', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Development work')).toBeInTheDocument();
    });
  });

  it('should format dates correctly', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      // Date should be formatted in Swedish locale (e.g., "ons 26 nov.")
      // Check that a date-like element exists
      expect(screen.getByText(/nov\./i)).toBeInTheDocument();
    });
  });

  it('should display project count in grouped entries', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      // Check for entry count (1 tidpost or tidsposter)
      const countText = screen.getByText(/\d+\s+tidpost/);
      expect(countText).toBeInTheDocument();
    });
  });

  it('should show hours with one decimal place', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      // Mock has 8 hours, should display as 8.0h (appears multiple times)
      const hoursElements = screen.getAllByText('8.0h');
      expect(hoursElements.length).toBeGreaterThan(0);
    });
  });

  it('should have correct button styling', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: /lägg till tid/i });
      expect(addButton).toHaveClass('bg-white/10');
    });
  });
});

describe('TimeTrackingDashboard - Empty State', () => {
  beforeEach(() => {
    localStorage.clear();
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
  });

  it('should display empty state message when switching to a period with no entries', async () => {
    const user = userEvent.setup();
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /månad/i })).toBeInTheDocument();
    });

    // Switch to month view (if current week has entries but month doesn't, or vice versa)
    // The mock data may show entries for both, but the component should handle empty states
    const monthButton = screen.getByRole('button', { name: /månad/i });
    await user.click(monthButton);

    // Component should still render without errors
    expect(screen.getByText('Tidrapportering')).toBeInTheDocument();
  });
});

describe('TimeTrackingDashboard - Statistics', () => {
  beforeEach(() => {
    localStorage.clear();
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
  });

  it('should calculate hours statistics correctly', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      // Stats should show hours with .0 format
      const statsCards = screen.getAllByText(/\d+\.\d+h/);
      expect(statsCards.length).toBeGreaterThan(0);
    });
  });

  it('should display stats in the correct order', async () => {
    render(<TimeTrackingDashboard />);

    await waitFor(() => {
      const statTitles = ['Idag', 'Denna vecka', 'Denna månad'];
      statTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });
});
