import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import {
  useFormResponsesByProject,
  useProjectFormResponses,
} from './useApi';

// Wrapper component with all providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

describe('Form Response Hooks', () => {
  beforeEach(() => {
    // Set up auth token in localStorage
    localStorage.setItem('auth_token', 'mock-jwt-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({
        id: 'user-1',
        email: 'admin@siteflow.se',
        role: 'siteflow_admin',
      })
    );
  });

  describe('useFormResponsesByProject', () => {
    it('should return loading state initially', () => {
      const { result } = renderHook(
        () => useFormResponsesByProject('project-1'),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when projectId is empty', () => {
      const { result } = renderHook(
        () => useFormResponsesByProject(''),
        { wrapper: createWrapper() }
      );

      // Query should be disabled
      expect(result.current.isFetching).toBe(false);
    });

    it('should eventually complete loading', async () => {
      const { result } = renderHook(
        () => useFormResponsesByProject('project-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 5000 });
    });
  });

  describe('useProjectFormResponses', () => {
    it('should return formValues object', async () => {
      const { result } = renderHook(
        () => useProjectFormResponses('project-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 5000 });

      expect(result.current.formValues).toBeDefined();
      expect(typeof result.current.formValues).toBe('object');
    });

    it('should have saveAnswer function', async () => {
      const { result } = renderHook(
        () => useProjectFormResponses('project-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 5000 });

      expect(typeof result.current.saveAnswer).toBe('function');
    });

    it('should have saveAllAnswers function', async () => {
      const { result } = renderHook(
        () => useProjectFormResponses('project-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 5000 });

      expect(typeof result.current.saveAllAnswers).toBe('function');
    });

    it('should have isSaving state', async () => {
      const { result } = renderHook(
        () => useProjectFormResponses('project-1'),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 5000 });

      expect(typeof result.current.isSaving).toBe('boolean');
      expect(result.current.isSaving).toBe(false);
    });
  });
});
