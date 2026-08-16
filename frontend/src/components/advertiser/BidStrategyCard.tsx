import { Gauge } from "lucide-react";

export function BidStrategyCard({ bidStrategy }: { bidStrategy: string }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
          <Gauge size={16} />
        </span>
        <p className="text-sm font-medium text-ink-100">Bid strategy</p>
      </div>
      <p className="mt-3 text-sm text-ink-300">{bidStrategy}</p>
    </div>
  );
}
