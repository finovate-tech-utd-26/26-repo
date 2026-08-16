import { ShieldCheck } from "lucide-react";

export function TrustNote() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-xl border border-ink-800 px-6 py-5 text-left">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-ink-400" />
        <p className="text-sm text-ink-400">
          No third-party cookies. Targeting is based on page content, not behavioral profiles —
          the model reads what the page is about, not who's reading it.
        </p>
      </div>
    </section>
  );
}
