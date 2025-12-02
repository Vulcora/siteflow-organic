import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

export type UserRole =
  | 'siteflow_admin'
  | 'siteflow_kam'
  | 'siteflow_pl'
  | 'siteflow_dev_frontend'
  | 'siteflow_dev_backend'
  | 'siteflow_dev_fullstack'
  | 'customer'
  | 'partner';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId: string | null;
  specialization?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenExpiresAt: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = ''; // Use relative URLs so Vite proxy handles routing

// Decode JWT payload without external library
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Check if token is expired (with 60 second buffer)
function isTokenExpired(expiresAt: number | null): boolean {
  if (!expiresAt) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= expiresAt - 60; // 60 second buffer
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear logout timer
  const clearLogoutTimer = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  // Schedule auto-logout when token expires
  const scheduleAutoLogout = useCallback((expiresAt: number) => {
    clearLogoutTimer();
    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = (expiresAt - now - 60) * 1000; // 60 second buffer, convert to ms

    if (timeUntilExpiry > 0) {
      logoutTimerRef.current = setTimeout(() => {
        console.log('Token expired, logging out automatically');
        setToken(null);
        setUser(null);
        setTokenExpiresAt(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expires_at');
      }, timeUntilExpiry);
    }
  }, [clearLogoutTimer]);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    const storedExpiresAt = localStorage.getItem('token_expires_at');

    if (storedToken && storedUser) {
      // Check if token is expired
      const expiresAt = storedExpiresAt ? parseInt(storedExpiresAt, 10) : null;

      // Also try to decode from token itself as backup
      const payload = decodeJwtPayload(storedToken);
      const tokenExp = payload?.exp || expiresAt;

      if (tokenExp && isTokenExpired(tokenExp)) {
        // Token expired, clear everything
        console.log('Stored token expired, clearing auth state');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token_expires_at');
      } else {
        setToken(storedToken);
        setTokenExpiresAt(tokenExp || null);
        try {
          setUser(JSON.parse(storedUser));
          // Schedule auto-logout
          if (tokenExp) {
            scheduleAutoLogout(tokenExp);
          }
        } catch {
          localStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, [scheduleAutoLogout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password } }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await response.json();

    // Calculate expiry time from token or response
    const payload = decodeJwtPayload(data.token);
    const expiresAt = payload?.exp || (data.expires_in ? Math.floor(Date.now() / 1000) + data.expires_in : null);

    // Store in state
    setToken(data.token);
    setUser(data.user);
    setTokenExpiresAt(expiresAt);

    // Store in localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (expiresAt) {
      localStorage.setItem('token_expires_at', expiresAt.toString());
      // Schedule auto-logout
      scheduleAutoLogout(expiresAt);
    }
  }, [scheduleAutoLogout]);

  const logout = useCallback(() => {
    clearLogoutTimer();
    setToken(null);
    setUser(null);
    setTokenExpiresAt(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expires_at');
  }, [clearLogoutTimer]);

  const getAuthHeaders = useCallback((): Record<string, string> => {
    if (!token) return {};
    return { 'Authorization': `Bearer ${token}` };
  }, [token]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      clearLogoutTimer();
    };
  }, [clearLogoutTimer]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    tokenExpiresAt,
    login,
    logout,
    getAuthHeaders,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
