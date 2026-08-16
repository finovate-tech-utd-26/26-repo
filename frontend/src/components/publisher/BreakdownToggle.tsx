import { cn } from "@/lib/utils";

export type Breakdown = "total" | "site";

const options: { value: Breakdown; label: string }[] = [
  { value: "total", label: "Total" },
  { value: "site", label: "By site" },
];

export function BreakdownToggle({
  value,
  onChange,
}: {
  value: Breakdown;
  onChange: (value: Breakdown) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-ink-700 bg-ink-900 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition",
            value === opt.value ? "bg-ink-100 text-ink-950" : "text-ink-300 hover:text-ink-50"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
