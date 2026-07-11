"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api";
import {
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  saveStoredAuth,
} from "./auth-storage";
import type { User } from "./types";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (cancelled) return;

      setToken(getStoredToken());
      setUser(getStoredUser());
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const saveAuth = useCallback((nextToken: string, nextUser: User) => {
    saveStoredAuth(nextToken, nextUser);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login(email, password);
      saveAuth(res.token, res.user);
    },
    [saveAuth]
  );

  const signup = useCallback(
    async (email: string, password: string) => {
      const res = await api.signup(email, password);
      saveAuth(res.token, res.user);
    },
    [saveAuth]
  );

  const demoLogin = useCallback(() => login("demo@gmail.com", "demo123"), [
    login,
  ]);

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      signup,
      demoLogin,
      logout,
    }),
    [token, user, loading, login, signup, demoLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
