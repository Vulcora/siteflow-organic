import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { useCompanies, useProjects, useTickets, useTimeEntries, queryKeys } from './useApi';
import React from 'react';

// Create wrapper with all providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };
};

describe('useApi hooks', () => {
  beforeEach(() => {
    localStorage.clear();
    // Set up auth token for authenticated requests
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

  describe('useCompanies', () => {
    it('should fetch companies successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useCompanies(), { wrapper });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for data
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.length).toBe(2);
      expect(result.current.data?.[0].name).toBe('Test Company');
    });

    it('should return companies with correct fields', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useCompanies(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const company = result.current.data?.[0];
      expect(company).toHaveProperty('id');
      expect(company).toHaveProperty('name');
      expect(company).toHaveProperty('orgNumber');
      expect(company).toHaveProperty('city');
      expect(company).toHaveProperty('isActive');
    });
  });

  describe('useProjects', () => {
    it('should fetch projects successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.length).toBe(2);
      expect(result.current.data?.[0].name).toBe('Website Redesign');
    });

    it('should return projects with correct state values', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const inProgressProject = result.current.data?.find((p) => p.state === 'in_progress');
      expect(inProgressProject).toBeDefined();

      const pendingProject = result.current.data?.find((p) => p.state === 'pending_approval');
      expect(pendingProject).toBeDefined();
    });
  });

  describe('useTickets', () => {
    it('should fetch tickets successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTickets(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.length).toBe(2);
    });

    it('should return tickets with priority and state', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTickets(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const highPriorityTicket = result.current.data?.find((t) => t.priority === 'high');
      expect(highPriorityTicket).toBeDefined();
      expect(highPriorityTicket?.title).toBe('Fix login bug');
    });
  });

  describe('useTimeEntries', () => {
    it('should fetch time entries successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useTimeEntries(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.length).toBe(1);
      expect(result.current.data?.[0].hours).toBe(8);
    });
  });

  describe('queryKeys', () => {
    it('should have correct query key structure', () => {
      expect(queryKeys.companies).toEqual(['companies']);
      expect(queryKeys.projects).toEqual(['projects']);
      expect(queryKeys.tickets).toEqual(['tickets']);
      expect(queryKeys.timeEntries).toEqual(['timeEntries']);
    });

    it('should generate correct dynamic keys', () => {
      expect(queryKeys.project('123')).toEqual(['project', '123']);
      expect(queryKeys.ticket('456')).toEqual(['ticket', '456']);
    });
  });
});

describe('useApi hooks - error handling', () => {
  beforeEach(() => {
    localStorage.clear();
    // No auth token - should still work with RPC but might return different data
  });

  it('should handle unauthenticated state gracefully', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCompanies(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Even without auth, the hook should not crash
    expect(result.current.error).toBeNull();
  });
});
