import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import { ChartCard } from "@/components/charts/ChartCard";
import { TrendChart, type TrendSeries } from "@/components/charts/TrendChart";
import { DateRangePicker } from "@/components/publisher/DateRangePicker";
import { BreakdownToggle, type Breakdown } from "@/components/publisher/BreakdownToggle";
import { RevenueTable } from "@/components/publisher/RevenueTable";
import { useAsync } from "@/hooks/useAsync";
import { getRevenueHistory, getSites, getSiteRevenue } from "@/api/publisherApi";

const rangeDays: Record<string, number> = { "7d": 7, "30d": 30, "90d": 30 };
const siteColors = ["var(--color-signal-500)", "var(--color-amber-500)", "var(--color-ink-300)"];

export default function PublisherRevenue() {
  const { data: revenue, loading } = useAsync(getRevenueHistory);
  const { data: sites, loading: sitesLoading } = useAsync(getSites);
  const [range, setRange] = useState("30d");
  const [breakdown, setBreakdown] = useState<Breakdown>("total");
  const [bySite, setBySite] = useState<Record<string, number>[] | null>(null);

  const scoped = useMemo(() => {
    if (!revenue) return [];
    return revenue.slice(-rangeDays[range]);
  }, [revenue, range]);

  useEffect(() => {
    if (breakdown !== "site" || !sites || sites.length === 0) return;
    let alive = true;
    Promise.all(sites.map((s) => getSiteRevenue(s.id))).then((allSeries) => {
      if (!alive) return;
      const byDate = new Map<string, Record<string, number>>();
      allSeries.forEach((series, i) => {
        series.forEach((point) => {
          const row = byDate.get(point.date) ?? { date: point.date } as unknown as Record<string, number>;
          row[`site${i}`] = point.revenue;
          byDate.set(point.date, row);
        });
      });
      setBySite(Array.from(byDate.values()).sort((a, b) => String(a.date).localeCompare(String(b.date))));
    });
    return () => {
      alive = false;
    };
  }, [breakdown, sites]);

  const series: TrendSeries[] =
    breakdown === "site" && sites
      ? sites.map((s, i) => ({
          key: `site${i}`,
          label: s.name,
          color: siteColors[i % siteColors.length],
        }))
      : [{ key: "revenue", label: "Revenue", color: "var(--color-signal-500)", fill: true }];

  const chartData = breakdown === "site" ? bySite ?? [] : scoped;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-50">Revenue analytics</h1>
          <p className="mt-1 text-sm text-ink-400">Track revenue across every connected site.</p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <ChartCard
        title="Revenue"
        subtitle={`Last ${range}`}
        actions={<BreakdownToggle value={breakdown} onChange={setBreakdown} />}
        legend={series.map((s) => ({ label: s.label, color: s.color }))}
      >
        {loading || !revenue || (breakdown === "site" && !bySite) ? (
          <Skeleton className="h-72" />
        ) : (
          <TrendChart
            data={chartData}
            xKey="date"
            series={series}
            height={300}
            valueFormatter={(v) => `$${Number(v).toFixed(2)}`}
          />
        )}
      </ChartCard>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-medium text-ink-50">Line items</h2>
        <Button variant="outline" size="sm" disabled>
          <Download size={14} />
          Export CSV (coming soon)
        </Button>
      </div>

      <div className="mt-4">
        {loading || sitesLoading || !revenue || !sites ? (
          <Skeleton className="h-64" />
        ) : (
          <RevenueTable rows={scoped} sites={sites} />
        )}
      </div>
    </div>
  );
}
