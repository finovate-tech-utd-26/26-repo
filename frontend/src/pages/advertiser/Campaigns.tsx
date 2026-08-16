import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Megaphone } from "lucide-react";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { CampaignTable } from "@/components/advertiser/CampaignTable";
import { StatusFilterTabs, type StatusFilter } from "@/components/advertiser/StatusFilterTabs";
import { useAsync } from "@/hooks/useAsync";
import { getCampaigns } from "@/api/advertiserApi";

export default function AdvertiserCampaigns() {
  const { data: campaigns, loading } = useAsync(getCampaigns);
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    if (!campaigns) return [];
    return filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);
  }, [campaigns, filter]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-50">Campaigns</h1>
          <p className="mt-1 text-sm text-ink-400">All campaigns across your account.</p>
        </div>
        <Link to="/advertiser/campaigns/new">
          <Button variant="amber">
            <Plus size={16} />
            New campaign
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <StatusFilterTabs value={filter} onChange={setFilter} />
      </div>

      {loading || !campaigns ? (
        <Skeleton className="h-64" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Megaphone size={20} />}
          title="No campaigns here"
          description="Try a different filter, or create a new campaign."
        />
      ) : (
        <CampaignTable campaigns={filtered} />
      )}
    </div>
  );
}
