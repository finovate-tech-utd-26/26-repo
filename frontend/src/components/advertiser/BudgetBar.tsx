import { Badge } from "@/components/Badge";

export function BudgetBar({ spend, budget, pacing }: { spend: number; budget: number; pacing: "even" | "accelerated" }) {
  const pct = Math.min(100, Math.round((spend / budget) * 100));

  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-sm text-ink-300">Budget spent</p>
        <Badge tone={pacing === "even" ? "good" : "amber"}>{pacing === "even" ? "Pacing evenly" : "Accelerated pacing"}</Badge>
      </div>
      <p className="font-display text-2xl font-medium text-ink-50">
        ${spend.toLocaleString()} <span className="text-base font-normal text-ink-500">/ ${budget.toLocaleString()}</span>
      </p>
      <div className="mt-3 h-2.5 w-full rounded-full bg-ink-800">
        <div
          className="h-2.5 rounded-full bg-amber-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-ink-500">{pct}% of budget used</p>
    </div>
  );
}
