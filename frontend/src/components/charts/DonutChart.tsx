import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

export type DonutSlice = {
  name: string;
  value: number;
  color: string;
};

export function DonutChart({
  data,
  height = 220,
  valueFormatter,
}: {
  data: DonutSlice[];
  height?: number;
  valueFormatter?: (v: number | string) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="62%"
          outerRadius="90%"
          paddingAngle={3}
          stroke="none"
        >
          {data.map((slice) => (
            <Cell key={slice.name} fill={slice.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip formatter={valueFormatter} />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
