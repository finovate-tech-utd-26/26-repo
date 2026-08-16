import type { ReactNode } from "react";
import { StatCounter } from "./StatCounter";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  delta,
  deltaGood = true,
  icon,
  accent = "signal",
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: string;
  deltaGood?: boolean;
  icon?: ReactNode;
  accent?: "signal" | "amber";
}) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-300">{label}</p>
        {icon && (
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              accent === "signal"
                ? "bg-signal-500/10 text-signal-400"
                : "bg-amber-500/10 text-amber-400"
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-medium tabular-nums text-ink-50">
        <StatCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </p>
      {delta && (
        <p className={cn("mt-2 text-xs font-medium", deltaGood ? "text-good-500" : "text-bad-500")}>
          {delta}
        </p>
      )}
    </div>
  );
}
