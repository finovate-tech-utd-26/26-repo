import { AlertTriangle, Sparkles } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import type { Recommendation } from "@/types/api";

export function RecommendationCard({
  recommendation,
  loading,
  error,
  onRetry,
}: {
  recommendation: Recommendation | null;
  loading: boolean;
  error?: Error | null;
  onRetry?: () => void;
}) {
  if (error) {
    return (
      <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
        <div className="flex items-center gap-2 text-bad-500">
          <AlertTriangle size={16} />
          <p className="text-sm font-medium">Couldn't load a recommendation</p>
        </div>
        <p className="mt-1 text-sm text-ink-400">
          The matching engine didn't respond in time. It may be warming up.
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }

  if (loading || !recommendation) {
    return <Skeleton className="h-32" />;
  }

  const actionLabel = recommendation.action.replace(/_/g, " ");
  const tone = recommendation.tone === "good" ? "good" : "amber";

  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-500/10 text-signal-400">
            <Sparkles size={16} />
          </span>
          <p className="text-sm font-medium text-ink-100">Proicio recommendation</p>
        </div>
        <Badge tone={tone}>{Math.round(recommendation.confidence * 100)}% confidence</Badge>
      </div>
      <p className="font-display text-lg font-medium capitalize text-ink-50">{actionLabel}</p>
      <p className="mt-1 text-sm text-ink-400">{recommendation.rationale}</p>
      <p className="mt-3 text-xs text-ink-500">
        Projected net CPM: <span className="text-ink-300">${recommendation.projectedCpm.toFixed(2)}</span>
      </p>
    </div>
  );
}
