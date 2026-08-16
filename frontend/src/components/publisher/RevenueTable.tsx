import type { Site } from "@/types/api";

type Row = { date: string; revenue: number; adsShown: number };

export function RevenueTable({ rows, sites }: { rows: Row[]; sites: Site[] }) {
  const recent = rows.slice(-10).reverse();

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-700 bg-ink-900">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-800 text-xs uppercase tracking-wide text-ink-500">
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">Site</th>
            <th className="px-5 py-3 font-medium">Ads shown</th>
            <th className="px-5 py-3 font-medium">Revenue</th>
            <th className="px-5 py-3 font-medium">Revenue / ad</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800">
          {recent.map((row, i) => {
            const site = sites[i % sites.length];
            return (
              <tr key={row.date} className="text-ink-300">
                <td className="px-5 py-3">{row.date}</td>
                <td className="px-5 py-3 text-ink-100">{site.name}</td>
                <td className="px-5 py-3 tabular-nums">{row.adsShown}</td>
                <td className="px-5 py-3 tabular-nums text-ink-100">${row.revenue.toFixed(2)}</td>
                <td className="px-5 py-3 tabular-nums">${(row.revenue / row.adsShown).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
