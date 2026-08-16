export function AdCreativePreviewCard({
  headline,
  cta,
}: {
  headline: string;
  cta: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-950">
      <div className="flex h-24 items-center justify-center bg-gradient-to-br from-amber-500/30 to-amber-700/10 text-xs font-medium uppercase tracking-wide text-amber-300">
        Ad creative
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-ink-100">{headline || "Your headline goes here"}</p>
        <button className="mt-3 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-ink-950">
          {cta || "Call to action"}
        </button>
      </div>
    </div>
  );
}
