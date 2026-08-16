import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "good" | "bad" | "signal" | "amber";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-ink-700 text-ink-200 ring-ink-600",
  good: "bg-good-500/10 text-good-500 ring-good-500/30",
  bad: "bg-bad-500/10 text-bad-500 ring-bad-500/30",
  signal: "bg-signal-500/10 text-signal-400 ring-signal-500/30",
  amber: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
