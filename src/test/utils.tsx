import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';

// Create a fresh QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

interface WrapperProps {
  children: React.ReactNode;
}

// Custom render with all providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const testQueryClient = createTestQueryClient();

  const Wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={testQueryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient: testQueryClient,
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };
