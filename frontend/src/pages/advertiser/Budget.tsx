import { Skeleton } from "@/components/Skeleton";
import { ChartCard } from "@/components/charts/ChartCard";
import { DonutChart } from "@/components/charts/DonutChart";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { RecommendationAlertList } from "@/components/advertiser/RecommendationAlertList";
import { useAsync } from "@/hooks/useAsync";
import { getBudgetData } from "@/api/advertiserApi";

export default function AdvertiserBudget() {
  const { data, loading } = useAsync(getBudgetData);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium text-ink-50">Budget & pacing</h1>
        <p className="mt-1 text-sm text-ink-400">
          How your spend is allocated and paced across active campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ChartCard title="Budget allocation" subtitle="Active campaigns">
            {loading || !data ? (
              <Skeleton className="h-56" />
            ) : (
              <>
                <DonutChart
                  data={data.budgetAllocation}
                  height={200}
                  valueFormatter={(v) => `$${v}`}
                />
                <div className="mt-4 flex flex-col gap-2">
                  {data.budgetAllocation.map((slice) => (
                    <div key={slice.name} className="flex items-center gap-2 text-xs text-ink-300">
                      <span className="h-2 w-2 rounded-full" style={{ background: slice.color }} />
                      <span className="flex-1 truncate">{slice.name}</span>
                      <span className="tabular-nums text-ink-100">${slice.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ChartCard>
        </div>

        <div className="lg:col-span-3">
          <ChartCard
            title="Pacing"
            subtitle="Even delivery vs. a naive spike pattern"
            legend={[
              { label: "With Proicio", color: "var(--color-amber-500)" },
              { label: "Naive", color: "var(--color-ink-600)" },
            ]}
          >
            {loading || !data ? (
              <Skeleton className="h-56" />
            ) : (
              <SimpleBarChart
                data={data.pacingByDay}
                xKey="day"
                series={[
                  { key: "even", label: "With Proicio", color: "var(--color-amber-500)" },
                  { key: "naive", label: "Naive", color: "var(--color-ink-600)" },
                ]}
                height={240}
                valueFormatter={(v) => `$${v}`}
              />
            )}
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-lg font-medium text-ink-50">Recommendations</h2>
        {loading || !data ? (
          <Skeleton className="h-40" />
        ) : (
          <RecommendationAlertList items={data.recommendations} />
        )}
      </div>
    </div>
  );
}
