import { StatCounter } from "@/components/StatCounter";
import { cn } from "@/lib/utils";

function Card({
  title,
  tone,
  spend,
  conversions,
  cpa,
}: {
  title: string;
  tone: "naive" | "signal";
  spend: number;
  conversions: number;
  cpa: number;
}) {
  const signal = tone === "signal";
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        signal ? "border-amber-500/40 bg-amber-500/5" : "border-ink-700 bg-ink-900"
      )}
    >
      <p className={cn("text-xs font-medium uppercase tracking-wide", signal ? "text-amber-400" : "text-ink-400")}>
        {title}
      </p>
      <p className="mt-3 font-display text-2xl font-medium text-ink-50">
        $<StatCounter value={spend} />
      </p>
      <p className="text-xs text-ink-400">spend to reach {conversions} conversions</p>
      <div className="mt-4 flex items-center justify-between border-t border-ink-800 pt-3 text-sm">
        <span className="text-ink-400">Cost / conversion</span>
        <span className="font-medium tabular-nums text-ink-100">${cpa.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function OutcomeComparisonCards({
  naiveSpend,
  signalSpend,
  conversions,
}: {
  naiveSpend: number;
  signalSpend: number;
  conversions: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card title="Without Proicio" tone="naive" spend={naiveSpend} conversions={conversions} cpa={naiveSpend / conversions} />
      <Card title="With Proicio" tone="signal" spend={signalSpend} conversions={conversions} cpa={signalSpend / conversions} />
    </div>
  );
}
