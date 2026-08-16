import { StatCounter } from "@/components/StatCounter";

export function ValueStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-signal-500/30 bg-signal-500/5 p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-signal-400">Publishers</p>
          <p className="mt-4 font-display text-4xl font-medium text-ink-50">
            Same revenue,{" "}
            <span className="text-signal-400">
              <StatCounter value={60} suffix="%" />
            </span>{" "}
            fewer ads
          </p>
          <p className="mt-3 text-sm text-ink-400">
            Two well-matched ads out-earn six poorly-matched ones — and readers stay longer.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-amber-400">Advertisers</p>
          <p className="mt-4 font-display text-4xl font-medium text-ink-50">
            Same reach,{" "}
            <span className="text-amber-400">
              <StatCounter value={35} suffix="%" />
            </span>{" "}
            less spend
          </p>
          <p className="mt-3 text-sm text-ink-400">
            Content-based matching finds the audience that actually converts — without the premium.
          </p>
        </div>
      </div>
    </section>
  );
}
