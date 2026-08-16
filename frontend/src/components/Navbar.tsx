import { Link, NavLink } from "react-router-dom";
import { Radio } from "lucide-react";
import { Button } from "./Button";

const links = [
  { to: "/demo", label: "Live Demo" },
  { to: "/marketplace", label: "Under the Hood" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-500 text-ink-950">
            <Radio size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold text-ink-50">Proicio</span>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? "text-signal-400" : "text-ink-300 hover:text-ink-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-ink-300 hover:text-ink-50">
            Log in
          </Link>
          <Link to="/login">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
