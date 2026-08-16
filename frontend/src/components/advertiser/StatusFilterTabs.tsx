import { cn } from "@/lib/utils";

const options = ["all", "active", "paused", "ended"] as const;
export type StatusFilter = (typeof options)[number];

export function StatusFilterTabs({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-ink-700 bg-ink-900 p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition",
            value === opt ? "bg-ink-100 text-ink-950" : "text-ink-300 hover:text-ink-50"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
