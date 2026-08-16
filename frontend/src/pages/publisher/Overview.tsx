import { Link } from "react-router-dom";
import { useState } from "react";
import { DollarSign, Image, TrendingUp, LogOut } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { Badge } from "@/components/Badge";
import { ChartCard } from "@/components/charts/ChartCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { Skeleton } from "@/components/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { getPublisherOverview, getRevenueHistory } from "@/api/publisherApi";

export default function PublisherOverview() {
  const { data: overview, loading } = useAsync(getPublisherOverview);
  const { data: revenue, loading: revenueLoading } = useAsync(getRevenueHistory);
  const [showComparison, setShowComparison] = useState(true);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-50">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-400">Here's how your sites are doing.</p>
        </div>
        {overview && (
          <Badge tone="good">
            {overview.sitesActive} of {overview.sitesConnected} sites active with Proicio
          </Badge>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !overview ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <KpiCard label="Revenue this month" value={overview.revenueThisMonth} prefix="$" icon={<DollarSign size={16} />} />
            <KpiCard label="Ads shown (avg/page)" value={overview.adsShownAvg} decimals={1} icon={<Image size={16} />} />
            <KpiCard label="Revenue per ad shown" value={overview.revenuePerAdShown} prefix="$" decimals={2} icon={<TrendingUp size={16} />} />
            <KpiCard label="Bounce rate" value={overview.bounceRate} suffix="%" icon={<LogOut size={16} />} deltaGood={false} />
          </>
        )}
      </div>

      <div className="mb-6">
        <ChartCard
          title="Revenue trend"
          subtitle="Last 30 days"
          legend={
            showComparison
              ? [
                  { label: "With Proicio", color: "var(--color-signal-500)" },
                  { label: "Without Proicio (est.)", color: "var(--color-ink-400)", dashed: true },
                ]
              : [{ label: "With Proicio", color: "var(--color-signal-500)" }]
          }
          actions={
            <button
              onClick={() => setShowComparison((v) => !v)}
              className="text-xs font-medium text-signal-400 hover:text-signal-300"
            >
              {showComparison ? "Hide comparison" : "Show comparison"}
            </button>
          }
        >
          {revenueLoading || !revenue ? (
            <Skeleton className="h-64" />
          ) : (
            <TrendChart
              data={revenue}
              xKey="date"
              series={[
                { key: "revenue", label: "With Proicio", color: "var(--color-signal-500)", fill: true },
                ...(showComparison
                  ? [
                      {
                        key: "revenueWithoutSignal",
                        label: "Without Proicio (est.)",
                        color: "var(--color-ink-400)",
                        dashed: true,
                      },
                    ]
                  : []),
              ]}
              valueFormatter={(v) => `$${Number(v).toFixed(0)}`}
            />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-ink-700 bg-ink-900 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-ink-800 px-5 py-4">
            <h3 className="font-display text-base font-medium text-ink-50">Your sites</h3>
            <Link to="/publisher/sites" className="text-xs font-medium text-signal-400 hover:text-signal-300">
              View all
            </Link>
          </div>
          <div className="divide-y divide-ink-800">
            {loading || !overview
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="px-5 py-4">
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                ))
              : overview.sites.map((site) => (
                  <Link
                    key={site.id}
                    to={`/publisher/sites/${site.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-ink-800/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink-100">{site.name}</p>
                      <p className="text-xs text-ink-500">{site.url}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-ink-400">{site.adsShownAvg} ads/page</span>
                      <span className="text-sm font-medium tabular-nums text-ink-100">
                        ${site.revenue.toLocaleString()}
                      </span>
                      <Badge tone={site.status === "active" ? "good" : "neutral"}>{site.status}</Badge>
                    </div>
                  </Link>
                ))}
          </div>
        </div>

        <div className="rounded-2xl border border-ink-700 bg-ink-900 lg:col-span-2">
          <div className="border-b border-ink-800 px-5 py-4">
            <h3 className="font-display text-base font-medium text-ink-50">Recent activity</h3>
          </div>
          <div className="flex flex-col gap-4 px-5 py-4">
            {loading || !overview
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4" />)
              : overview.activity.map((item) => (
                  <div key={item.id} className="text-sm">
                    <p className="text-ink-300">{item.text}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{item.time}</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
