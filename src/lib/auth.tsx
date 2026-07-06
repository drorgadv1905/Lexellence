"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "./types";
import { AUTH_KEY } from "./permissions";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  getUserByEmail,
  updateUser,
}: {
  children: ReactNode;
  getUserByEmail: (email: string) => User | undefined;
  updateUser: (id: string, updates: Partial<User>) => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        const fresh = getUserByEmail(parsed.email);
        if (fresh) setUser(fresh);
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    setIsLoading(false);
  }, [getUserByEmail]);

  const login = useCallback(
    (email: string, password: string) => {
      const found = getUserByEmail(email);
      if (found && found.password === password) {
        setUser(found);
        localStorage.setItem(AUTH_KEY, JSON.stringify(found));
        return found;
      }
      return null;
    },
    [getUserByEmail]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const updateCurrentUser = useCallback(
    (updates: Partial<User>) => {
      if (!user) return;
      updateUser(user.id, updates);
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    },
    [user, updateUser]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
