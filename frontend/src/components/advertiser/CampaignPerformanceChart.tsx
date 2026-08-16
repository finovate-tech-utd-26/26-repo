import { useMemo } from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { dateLabel, seededSeries } from "@/lib/chartHelpers";
import type { Campaign } from "@/types/api";

export function CampaignPerformanceChart({ campaign }: { campaign: Campaign }) {
  const data = useMemo(() => {
    const days = 14;
    const clickBase = campaign.conversions / days / 0.22;
    const clicks = seededSeries(days, clickBase, clickBase * 0.3);
    const conversions = seededSeries(days, campaign.conversions / days, campaign.conversions / days / 3);
    return Array.from({ length: days }, (_, i) => ({
      date: dateLabel(days - 1 - i),
      clicks: Math.round(clicks[i]),
      conversions: Math.round(conversions[i]),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign.id]);

  const impressions = campaign.conversions * 55;

  return (
    <ChartCard
      title="Performance"
      subtitle={`${impressions.toLocaleString()} impressions this period`}
      legend={[
        { label: "Clicks", color: "var(--color-amber-400)" },
        { label: "Conversions", color: "var(--color-amber-600)" },
      ]}
    >
      <TrendChart
        data={data}
        xKey="date"
        series={[
          { key: "clicks", label: "Clicks", color: "var(--color-amber-400)" },
          { key: "conversions", label: "Conversions", color: "var(--color-amber-600)", fill: true },
        ]}
        height={240}
      />
    </ChartCard>
  );
}
