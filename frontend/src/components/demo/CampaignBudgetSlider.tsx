export function CampaignBudgetSlider({
  value,
  onChange,
  min = 200,
  max = 1000,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm text-ink-300">Monthly budget</label>
        <span className="font-display text-lg font-medium text-ink-50">
          ${value.toLocaleString()}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber-500"
      />
      <div className="mt-1 flex justify-between text-xs text-ink-500">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
}
