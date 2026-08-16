import { api } from "@/lib/apiClient";
import type { AuthResponse, Role, UserProfile } from "@/types/api";

export function register(input: {
  email: string;
  password: string;
  role: Role;
}) {
  return api.post<AuthResponse>("/api/auth/register", input);
}

export function login(input: { email: string; password: string }) {
  return api.post<AuthResponse>("/api/auth/login", input);
}

export function logout() {
  return api.post<{ status: string }>("/api/auth/logout");
}

export function getProfile() {
  return api.get<UserProfile>("/api/auth/me");
}

export function updateProfile(input: Partial<{
  businessName: string;
  category: string;
  advertiserGoal: string;
  monthlyBudgetRange: number;
  notifyOnActivity: boolean;
  notifyOnRecommendations: boolean;
}>) {
  return api.patch<UserProfile>("/api/auth/me", input);
}
