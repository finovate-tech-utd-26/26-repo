import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Skeleton } from "@/components/Skeleton";
import { ChartCard } from "@/components/charts/ChartCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { SlotConfigPanel } from "@/components/publisher/SlotConfigPanel";
import { RecommendationCard } from "@/components/publisher/RecommendationCard";
import { CategoryTagList } from "@/components/CategoryTagList";
import { useAsync } from "@/hooks/useAsync";
import { getSite, getSiteRevenue, getRecommendation } from "@/api/publisherApi";

export default function PublisherSiteDetail() {
  const { siteId } = useParams<{ siteId: string }>();
  const { data: site, loading } = useAsync(() => getSite(siteId!), [siteId]);
  const { data: revenue, loading: revenueLoading } = useAsync(() => getSiteRevenue(siteId!), [siteId]);
  const {
    data: recommendation,
    loading: recommendationLoading,
    error: recommendationError,
    refetch: refetchRecommendation,
  } = useAsync(() => getRecommendation(siteId!), [siteId]);

  if (loading || !site) {
    return (
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64" />
      </div>
    );
  }

  return (
    <div>
      <Link to="/publisher/sites" className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100">
        <ArrowLeft size={14} />
        All sites
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-50">{site.name}</h1>
          <p className="mt-1 text-sm text-ink-400">
            {site.url} · Connected {site.connectedDate}
          </p>
        </div>
        <Badge tone={site.status === "active" ? "good" : "neutral"}>{site.status}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SlotConfigPanel siteId={site.id} slots={site.slots} maxAdsPerSession={site.maxAdsPerSession} />

          <div className="mt-6 rounded-2xl border border-ink-700 bg-ink-900 p-5">
            <h3 className="mb-3 font-display text-base font-medium text-ink-50">
              Content categories detected
            </h3>
            <CategoryTagList categories={site.categories} />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <ChartCard title="Site performance" subtitle="Revenue, last 30 days">
            {revenueLoading || !revenue ? (
              <Skeleton className="h-56" />
            ) : (
              <TrendChart
                data={revenue}
                xKey="date"
                series={[{ key: "revenue", label: "Revenue", color: "var(--color-signal-500)", fill: true }]}
                height={220}
                valueFormatter={(v) => `$${Number(v).toFixed(0)}`}
              />
            )}
          </ChartCard>

          <RecommendationCard
            recommendation={recommendation ?? null}
            loading={recommendationLoading}
            error={recommendationError}
            onRetry={refetchRecommendation}
          />
        </div>
      </div>
    </div>
  );
}
