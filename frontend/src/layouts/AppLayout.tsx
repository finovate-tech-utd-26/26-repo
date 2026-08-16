import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";

export function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const section = location.pathname.startsWith("/advertiser") ? "advertiser" : "publisher";
  if (user.role !== section) {
    return <Navigate to={user.role === "advertiser" ? "/advertiser" : "/publisher"} replace />;
  }

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <main className="min-w-0 flex-1 px-8 py-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
