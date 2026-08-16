import { cn } from "@/lib/utils";

const ranges = ["7d", "30d", "90d"];

export function DateRangePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-ink-700 bg-ink-900 p-1">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition",
            value === r ? "bg-ink-100 text-ink-950" : "text-ink-300 hover:text-ink-50"
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
