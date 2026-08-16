import { DollarSign, Target, Percent, PiggyBank } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";
import { Skeleton } from "@/components/Skeleton";
import { ChartCard } from "@/components/charts/ChartCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { CampaignTable } from "@/components/advertiser/CampaignTable";
import { useAsync } from "@/hooks/useAsync";
import { getAdvertiserOverview, getSpendHistory, getBudgetData } from "@/api/advertiserApi";

export default function AdvertiserOverview() {
  const { data: overview, loading } = useAsync(getAdvertiserOverview);
  const { data: spend, loading: spendLoading } = useAsync(getSpendHistory);
  const { data: budgetData, loading: budgetLoading } = useAsync(getBudgetData);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium text-ink-50">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-400">Here's how your campaigns are performing.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !overview ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <KpiCard label="Total spend this month" value={overview.totalSpend} prefix="$" icon={<DollarSign size={16} />} accent="amber" />
            <KpiCard label="Conversions" value={overview.conversions} icon={<Target size={16} />} accent="amber" />
            <KpiCard label="Cost per conversion" value={overview.costPerConversion} prefix="$" decimals={2} icon={<Percent size={16} />} accent="amber" />
            <KpiCard label="Est. savings vs. naive targeting" value={overview.estSavings} prefix="$" icon={<PiggyBank size={16} />} accent="amber" />
          </>
        )}
      </div>

      <div className="mb-6">
        <ChartCard
          title="Spend vs. naive targeting"
          subtitle="Last 30 days"
          legend={[
            { label: "With Proicio", color: "var(--color-amber-500)" },
            { label: "Without Proicio (est.)", color: "var(--color-ink-400)", dashed: true },
          ]}
        >
          {spendLoading || !spend ? (
            <Skeleton className="h-64" />
          ) : (
            <TrendChart
              data={spend}
              xKey="date"
              series={[
                { key: "spend", label: "With Proicio", color: "var(--color-amber-500)", fill: true },
                { key: "spendNaive", label: "Without Proicio (est.)", color: "var(--color-ink-400)", dashed: true },
              ]}
              valueFormatter={(v) => `$${Number(v).toFixed(0)}`}
            />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-3 font-display text-lg font-medium text-ink-50">Active campaigns</h2>
          {loading || !overview ? (
            <Skeleton className="h-48" />
          ) : (
            <CampaignTable campaigns={overview.campaigns.filter((c) => c.status !== "ended")} compact />
          )}
        </div>

        <div className="lg:col-span-2">
          <ChartCard title="Reach by category" subtitle="Audience categories reached this month">
            {budgetLoading || !budgetData ? (
              <Skeleton className="h-56" />
            ) : (
              <SimpleBarChart
                data={budgetData.reachBreakdown}
                xKey="category"
                series={[{ key: "value", label: "Reach", color: "var(--color-amber-500)" }]}
                height={220}
                valueFormatter={(v) => Number(v).toLocaleString()}
              />
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
