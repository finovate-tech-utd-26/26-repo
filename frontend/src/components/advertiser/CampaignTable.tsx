import { Link } from "react-router-dom";
import { Badge } from "@/components/Badge";
import type { Campaign } from "@/types/api";

const statusTone: Record<Campaign["status"], "good" | "neutral" | "bad"> = {
  active: "good",
  paused: "neutral",
  ended: "bad",
};

export function CampaignTable({
  campaigns,
  compact = false,
}: {
  campaigns: Campaign[];
  compact?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-700 bg-ink-900">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-800 text-xs uppercase tracking-wide text-ink-500">
            <th className="px-4 py-3 font-medium">Campaign</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {!compact && <th className="px-4 py-3 font-medium">Budget</th>}
            <th className="px-4 py-3 font-medium">Spend</th>
            <th className="px-4 py-3 font-medium">Conversions</th>
            {!compact && <th className="px-4 py-3 font-medium">CPA</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-800">
          {campaigns.map((c) => (
            <tr key={c.id} className="text-ink-300 hover:bg-ink-800/40">
              <td className="max-w-[180px] truncate px-4 py-3">
                <Link
                  to={`/advertiser/campaigns/${c.id}`}
                  className="font-medium text-ink-100 hover:text-amber-400"
                >
                  {c.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <Badge tone={statusTone[c.status]}>{c.status}</Badge>
              </td>
              {!compact && <td className="px-4 py-3 tabular-nums">${c.budget.toLocaleString()}</td>}
              <td className="px-4 py-3 tabular-nums text-ink-100">${c.spend.toLocaleString()}</td>
              <td className="px-4 py-3 tabular-nums">{c.conversions}</td>
              {!compact && <td className="px-4 py-3 tabular-nums">${c.cpa.toFixed(2)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
