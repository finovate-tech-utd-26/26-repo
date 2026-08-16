import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

export type BarSeries = {
  key: string;
  label: string;
  color: string;
};

export function SimpleBarChart({
  data,
  xKey,
  series,
  height = 220,
  valueFormatter,
  radius = 4,
}: {
  data: Record<string, number | string>[];
  xKey: string;
  series: BarSeries[];
  height?: number;
  valueFormatter?: (v: number | string) => string;
  radius?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
        <CartesianGrid stroke="var(--color-ink-800)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "var(--color-ink-400)", fontSize: 12 }}
          axisLine={{ stroke: "var(--color-ink-700)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--color-ink-400)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          content={<ChartTooltip formatter={valueFormatter} />}
          cursor={{ fill: "var(--color-ink-800)" }}
        />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[radius, radius, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
