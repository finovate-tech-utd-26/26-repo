import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getToken, setToken as persistToken } from "@/lib/apiClient";
import * as authApi from "@/api/authApi";
import type { Role, UserProfile } from "@/types/api";

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<Role>;
  register: (email: string, password: string, role: Role) => Promise<Role>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setUser(await authApi.getProfile());
    } catch {
      persistToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function login(email: string, password: string) {
    const res = await authApi.login({ email, password });
    persistToken(res.token);
    await loadProfile();
    return res.role;
  }

  async function register(email: string, password: string, role: Role) {
    const res = await authApi.register({ email, password, role });
    persistToken(res.token);
    await loadProfile();
    return res.role;
  }

  function logout() {
    persistToken(null);
    setUser(null);
    authApi.logout().catch(() => {});
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, role: user?.role ?? null, login, register, logout, refreshProfile: loadProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
