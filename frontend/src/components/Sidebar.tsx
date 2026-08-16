import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Globe,
  LineChart,
  Settings,
  Megaphone,
  Wallet,
  Radio,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const publisherLinks = [
  { to: "/publisher", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/publisher/sites", label: "Sites", icon: Globe },
  { to: "/publisher/revenue", label: "Revenue", icon: LineChart },
  { to: "/publisher/settings", label: "Settings", icon: Settings },
];

const advertiserLinks = [
  { to: "/advertiser", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/advertiser/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/advertiser/budget", label: "Budget", icon: Wallet },
  { to: "/advertiser/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const section = location.pathname.startsWith("/advertiser") ? "advertiser" : "publisher";
  const links = section === "advertiser" ? advertiserLinks : publisherLinks;
  const accent = section === "advertiser" ? "amber" : "signal";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-ink-800 bg-ink-900 px-4 py-6">
      <Link to="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-500 text-ink-950">
          <Radio size={18} strokeWidth={2.5} />
        </span>
        <span className="font-display text-lg font-semibold text-ink-50">Proicio</span>
      </Link>

      <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wide text-ink-500">
        {section === "advertiser" ? "Advertiser" : "Publisher"}
      </p>
      {user?.businessName && (
        <p className="mb-4 truncate px-2 text-sm text-ink-300">{user.businessName}</p>
      )}

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? accent === "amber"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-signal-500/10 text-signal-400"
                    : "text-ink-300 hover:bg-ink-800 hover:text-ink-50"
                )
              }
            >
              <Icon size={16} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-ink-400 hover:bg-ink-800 hover:text-ink-100"
      >
        <LogOut size={14} />
        Log out
      </button>
    </aside>
  );
}
