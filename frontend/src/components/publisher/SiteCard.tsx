import { Link } from "react-router-dom";
import { Badge } from "@/components/Badge";
import type { Site } from "@/types/api";

export function SiteCard({ site }: { site: Site }) {
  return (
    <Link
      to={`/publisher/sites/${site.id}`}
      className="block rounded-2xl border border-ink-700 bg-ink-900 p-5 transition hover:border-ink-600"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-base font-medium text-ink-50">{site.name}</p>
          <p className="text-xs text-ink-500">{site.url}</p>
        </div>
        <Badge tone={site.status === "active" ? "good" : "neutral"}>{site.status}</Badge>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-ink-500">Ads shown avg</p>
          <p className="mt-1 font-medium tabular-nums text-ink-100">{site.adsShownAvg}</p>
        </div>
        <div>
          <p className="text-xs text-ink-500">Revenue</p>
          <p className="mt-1 font-medium tabular-nums text-ink-100">${site.revenue.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}
