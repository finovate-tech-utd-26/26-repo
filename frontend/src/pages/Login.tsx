import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button";
import { ApiError } from "@/lib/apiClient";
import type { Role } from "@/types/api";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("publisher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        const loggedInRole = await login(email, password);
        navigate(loggedInRole === "publisher" ? "/publisher" : "/advertiser");
      } else {
        await register(email, password, role);
        navigate(role === "publisher" ? "/publisher/onboarding" : "/advertiser/onboarding");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-center font-display text-3xl font-medium text-ink-50">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-center text-ink-400">
        {mode === "login" ? "Log in to your Proicio dashboard." : "Set up a Proicio account in seconds."}
      </p>

      <div className="mx-auto mt-8 flex w-fit rounded-xl border border-ink-700 bg-ink-900 p-1">
        {(["login", "register"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={cn(
              "rounded-lg px-5 py-2 text-sm font-medium capitalize transition",
              mode === m ? "bg-ink-100 text-ink-950" : "text-ink-300 hover:text-ink-50"
            )}
          >
            {m === "login" ? "Log in" : "Register"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {mode === "register" && (
          <div>
            <label className="mb-2 block text-sm text-ink-300">I am a</label>
            <div className="flex gap-2">
              {(["publisher", "advertiser"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition",
                    role === r
                      ? r === "publisher"
                        ? "border-signal-500 bg-signal-500/10 text-signal-400"
                        : "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-ink-700 text-ink-300 hover:border-ink-600"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm text-ink-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-signal-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-ink-300">Password</label>
          <input
            type="password"
            required
            minLength={mode === "register" ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "register" ? "At least 8 characters" : "••••••••"}
            className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-signal-500"
          />
        </div>

        {error && <p className="text-sm text-bad-500">{error}</p>}

        <Button type="submit" size="lg" disabled={submitting} className="mt-2 w-full">
          {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </Button>
      </form>

      <Link to="/demo" className="mt-8 block text-center text-sm text-ink-400 hover:text-ink-100">
        or view the live demo →
      </Link>
    </div>
  );
}
