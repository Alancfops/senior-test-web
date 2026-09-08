import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  clearSession,
  getAccessToken,
  getStoredUser,
  isAdminSession,
  setSession,
} from '@/lib/auth/session';
import type { AuthUser, LoginResponse } from '@/types/api';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(() =>
    isAdminSession() ? getStoredUser() : null,
  );

  const login = useCallback((response: LoginResponse) => {
    setSession(response.accessToken, response.user);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      const token = getAccessToken();
      if (token) {
        setSession(token, next);
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      mustChangePassword: Boolean(user?.mustChangePassword),
      login,
      logout,
      updateUser,
    }),
    [user, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
