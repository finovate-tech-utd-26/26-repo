import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Radio } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function OnboardingLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const section = location.pathname.startsWith("/advertiser") ? "advertiser" : "publisher";
  if (user.role !== section) {
    return <Navigate to={`/${user.role}/onboarding`} replace />;
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="border-b border-ink-800 px-6 py-4">
        <Link to="/" className="flex w-fit items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-500 text-ink-950">
            <Radio size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold text-ink-50">Proicio</span>
        </Link>
      </header>
      <div className="px-6 py-12">
        <Outlet />
      </div>
    </div>
  );
}
