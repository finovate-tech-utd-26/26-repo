type TooltipPayloadItem = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
};

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  formatter?: (value: number | string) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 shadow-xl">
      {label !== undefined && (
        <p className="mb-1 text-xs font-medium text-ink-300">{label}</p>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-ink-300">{item.name}</span>
            <span className="ml-auto font-medium tabular-nums text-ink-50">
              {item.value !== undefined
                ? formatter
                  ? formatter(item.value)
                  : item.value
                : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
