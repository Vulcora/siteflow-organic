import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

// Wrapper component for hooks
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('useAuth hook', () => {
    it('should return initial state when not authenticated', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should provide getAuthHeaders function', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      const headers = result.current.getAuthHeaders();
      expect(headers).toEqual({});
    });

    it('should provide getAuthHeaders with Bearer token when authenticated', async () => {
      // Set up localStorage with token
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 'user-1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'customer',
          companyId: null,
        })
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Wait for context to initialize from localStorage
      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      const headers = result.current.getAuthHeaders();
      expect(headers).toEqual({ Authorization: 'Bearer test-token' });
    });

    it('should restore auth state from localStorage on mount', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'admin@siteflow.se',
        firstName: 'Admin',
        lastName: 'User',
        role: 'siteflow_admin' as const,
        companyId: null,
      };

      localStorage.setItem('auth_token', 'stored-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('stored-token');
    });
  });

  describe('login function', () => {
    it('should login successfully with valid credentials', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('admin@siteflow.se', 'AdminPassword123!');
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeDefined();
      expect(result.current.user?.email).toBe('admin@siteflow.se');
      expect(result.current.token).toBe('mock-jwt-token');
    });

    it('should store auth data in localStorage after login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('admin@siteflow.se', 'AdminPassword123!');
      });

      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
      expect(localStorage.getItem('user')).toBeTruthy();
    });

    it('should throw error with invalid credentials', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await expect(
        act(async () => {
          await result.current.login('wrong@email.com', 'wrongpassword');
        })
      ).rejects.toThrow('Invalid email or password');

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('logout function', () => {
    it('should clear auth state on logout', async () => {
      // First login
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 'user-1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'customer',
          companyId: null,
        })
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should clear localStorage on logout', async () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user', '{}');

      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.logout();
      });

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
