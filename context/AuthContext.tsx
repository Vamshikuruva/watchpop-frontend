"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { setAccessToken, clearAccessToken } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type User = {
  id: string;
  email: string;
  name?: string;
  provider?: string;
  profile_picture?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function restoreSession() {
    try {
      const refresh = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refresh.ok) {
        setLoading(false);
        return;
      }

      const data = await refresh.json();
      setAccessToken(data.access_token);

      const meRes = await apiFetch(`/auth/me`);
      const me = await meRes.json();

      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(token: string) {
    setAccessToken(token);

    const res = await apiFetch(`/auth/me`);
    const me = await res.json();

    setUser(me);
  }

  async function logout() {
    await fetch(`/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    clearAccessToken();
    setUser(null);
  }

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
