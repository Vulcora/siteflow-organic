import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/utils';
import LoginPage from '../../components/LoginPage';

describe('LoginPage', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('should render login form', () => {
    render(<LoginPage onNavigate={mockNavigate} />);

    expect(screen.getByRole('textbox', { name: /loginPage.emailLabel/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/loginPage.passwordLabel/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /loginPage.loginButton/i })).toBeInTheDocument();
  });

  it('should render demo account buttons', () => {
    render(<LoginPage onNavigate={mockNavigate} />);

    expect(screen.getByText('Demo-konton:')).toBeInTheDocument();
    expect(screen.getByText('admin@siteflow.se')).toBeInTheDocument();
    expect(screen.getByText('demo@siteflow.se')).toBeInTheDocument();
  });

  it('should fill email field when clicking admin demo button', async () => {
    const user = userEvent.setup();
    render(<LoginPage onNavigate={mockNavigate} />);

    const adminButton = screen.getByText('admin@siteflow.se').closest('button');
    await user.click(adminButton!);

    const emailInput = screen.getByRole('textbox', { name: /loginPage.emailLabel/i }) as HTMLInputElement;
    expect(emailInput.value).toBe('admin@siteflow.se');
  });

  it('should disable submit button while submitting', async () => {
    const user = userEvent.setup();
    render(<LoginPage onNavigate={mockNavigate} />);

    // Fill in credentials
    const emailInput = screen.getByRole('textbox', { name: /loginPage.emailLabel/i });
    const passwordInput = screen.getByLabelText(/loginPage.passwordLabel/i);

    await user.type(emailInput, 'admin@siteflow.se');
    await user.type(passwordInput, 'AdminPassword123!');

    // Get submit button before submission
    const submitButton = screen.getByRole('button', { name: /loginPage.loginButton/i });
    expect(submitButton).not.toBeDisabled();

    // Submit form - button should become disabled briefly then re-enabled after success
    await user.click(submitButton);

    // Wait for successful login and navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('dashboard');
    });
  });

  it('should navigate to dashboard on successful login', async () => {
    const user = userEvent.setup();
    render(<LoginPage onNavigate={mockNavigate} />);

    // Fill in valid credentials
    const emailInput = screen.getByRole('textbox', { name: /loginPage.emailLabel/i });
    const passwordInput = screen.getByLabelText(/loginPage.passwordLabel/i);

    await user.type(emailInput, 'admin@siteflow.se');
    await user.type(passwordInput, 'AdminPassword123!');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /loginPage.loginButton/i });
    await user.click(submitButton);

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('dashboard');
    });
  });

  it('should show error message on failed login', async () => {
    const user = userEvent.setup();
    render(<LoginPage onNavigate={mockNavigate} />);

    // Fill in invalid credentials
    const emailInput = screen.getByRole('textbox', { name: /loginPage.emailLabel/i });
    const passwordInput = screen.getByLabelText(/loginPage.passwordLabel/i);

    await user.type(emailInput, 'wrong@email.com');
    await user.type(passwordInput, 'wrongpassword');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /loginPage.loginButton/i });
    await user.click(submitButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });

    // Should not navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should have remember me checkbox', () => {
    render(<LoginPage onNavigate={mockNavigate} />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('loginPage.rememberMe')).toBeInTheDocument();
  });

  it('should have forgot password link', () => {
    render(<LoginPage onNavigate={mockNavigate} />);

    expect(screen.getByText('loginPage.forgotPassword')).toBeInTheDocument();
  });

  it('should render social login buttons', () => {
    render(<LoginPage onNavigate={mockNavigate} />);

    expect(screen.getByText('loginPage.continueWithGoogle')).toBeInTheDocument();
    expect(screen.getByText('loginPage.continueWithGithub')).toBeInTheDocument();
  });

  it('should have sign up link', () => {
    render(<LoginPage onNavigate={mockNavigate} />);

    expect(screen.getByText('loginPage.noAccount')).toBeInTheDocument();
    expect(screen.getByText('loginPage.createAccount')).toBeInTheDocument();
  });
});
