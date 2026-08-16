import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";

export type TrendSeries = {
  key: string;
  label: string;
  color: string;
  dashed?: boolean;
  fill?: boolean;
};

export function TrendChart({
  data,
  xKey,
  series,
  height = 260,
  valueFormatter,
}: {
  data: Record<string, number | string>[];
  xKey: string;
  series: TrendSeries[];
  height?: number;
  valueFormatter?: (v: number | string) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {series
            .filter((s) => s.fill)
            .map((s) => (
              <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
        </defs>
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
          cursor={{ stroke: "var(--color-ink-600)", strokeWidth: 1 }}
        />
        {series.map((s) =>
          s.fill ? (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "5 5" : undefined}
              fill={`url(#fill-${s.key})`}
            />
          ) : (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "5 5" : undefined}
              dot={false}
            />
          )
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
