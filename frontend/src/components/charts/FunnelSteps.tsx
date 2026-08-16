export type FunnelStep = {
  label: string;
  value: number;
};

export function FunnelSteps({
  steps,
  color,
}: {
  steps: FunnelStep[];
  color: string;
}) {
  const max = steps[0]?.value || 1;

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, i) => {
        const pct = Math.max(4, (step.value / max) * 100);
        const dropoff =
          i > 0 ? Math.round((1 - step.value / steps[i - 1].value) * 100) : null;
        return (
          <div key={step.label}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="text-ink-300">{step.label}</span>
              <span className="tabular-nums text-ink-100">
                {step.value.toLocaleString()}
                {dropoff !== null && (
                  <span className="ml-2 text-ink-500">-{dropoff}%</span>
                )}
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-ink-800">
              <div
                className="h-2.5 rounded-full transition-all"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
