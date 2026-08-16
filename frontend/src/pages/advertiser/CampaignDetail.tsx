import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import { BudgetBar } from "@/components/advertiser/BudgetBar";
import { BidStrategyCard } from "@/components/advertiser/BidStrategyCard";
import { TargetingPanel } from "@/components/advertiser/TargetingPanel";
import { CampaignPerformanceChart } from "@/components/advertiser/CampaignPerformanceChart";
import { useAsync } from "@/hooks/useAsync";
import { getCampaign, updateCampaign } from "@/api/advertiserApi";
import { useToast } from "@/context/ToastContext";
import { ApiError } from "@/lib/apiClient";

const statusTone = { active: "good", paused: "neutral", ended: "bad" } as const;

export default function AdvertiserCampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: campaign, loading } = useAsync(() => getCampaign(id!), [id]);
  const { push } = useToast();
  const [status, setStatus] = useState<"active" | "paused" | "ended" | null>(null);
  const [updating, setUpdating] = useState(false);

  if (loading || !campaign) {
    return (
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64" />
      </div>
    );
  }

  const currentStatus = status ?? campaign.status;

  return (
    <div>
      <Link
        to="/advertiser/campaigns"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100"
      >
        <ArrowLeft size={14} />
        All campaigns
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-50">{campaign.name}</h1>
          <p className="mt-1 text-sm text-ink-400">{campaign.category}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={statusTone[currentStatus]}>{currentStatus}</Badge>
          <Button
            variant="outline"
            size="sm"
            disabled={updating}
            onClick={async () => {
              const next = currentStatus === "active" ? "paused" : "active";
              setUpdating(true);
              try {
                await updateCampaign(campaign.id, { status: next });
                setStatus(next);
                push(`Campaign ${next === "active" ? "resumed" : "paused"}.`, "success");
              } catch (err) {
                push(err instanceof ApiError ? err.message : "Couldn't update campaign.", "warning");
              } finally {
                setUpdating(false);
              }
            }}
          >
            {currentStatus === "active" ? "Pause" : "Resume"}
          </Button>
          <Button variant="ghost" size="sm">
            <Pencil size={14} />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <BudgetBar spend={campaign.spend} budget={campaign.budget} pacing={campaign.pacing} />
          <BidStrategyCard bidStrategy={campaign.bidStrategy} />
          <TargetingPanel targeting={campaign.targeting} />
        </div>

        <div className="lg:col-span-3">
          <CampaignPerformanceChart campaign={campaign} />
        </div>
      </div>
    </div>
  );
}
