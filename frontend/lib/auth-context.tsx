"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setToken } from "./api";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, fullName: string, schoolName?: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMe() {
    try {
      const me = await api.get<User>("/auth/me");
      setUser(me);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Fetch-on-mount: setState only happens after the awaited request
    // resolves, not synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMe();
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await api.post<{ access_token: string }>(
      "/auth/login",
      { email, password },
      false
    );
    setToken(access_token);
    const me = await api.get<User>("/auth/me");
    setUser(me);
    return me;
  }

  async function register(email: string, password: string, fullName: string, schoolName?: string) {
    const { access_token } = await api.post<{ access_token: string }>(
      "/auth/register",
      { email, password, full_name: fullName, school_name: schoolName || undefined },
      false
    );
    setToken(access_token);
    const me = await api.get<User>("/auth/me");
    setUser(me);
    return me;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
