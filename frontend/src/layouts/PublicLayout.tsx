import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />
      <Outlet />
    </div>
  );
}
