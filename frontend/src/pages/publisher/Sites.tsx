import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";
import { SiteCard } from "@/components/publisher/SiteCard";
import { ConnectSiteModal } from "@/components/publisher/ConnectSiteModal";
import { useAsync } from "@/hooks/useAsync";
import { getSites } from "@/api/publisherApi";
import type { Site } from "@/types/api";

export default function PublisherSites() {
  const { data, loading } = useAsync(getSites);
  const [sites, setSites] = useState<Site[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (data) setSites(data);
  }, [data]);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink-50">Sites</h1>
          <p className="mt-1 text-sm text-ink-400">Manage the sites connected to Proicio.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Connect a new site
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading || !sites
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)
          : sites.map((site) => <SiteCard key={site.id} site={site} />)}
      </div>

      <ConnectSiteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSiteCreated={(site) => setSites((prev) => [...(prev ?? []), site])}
      />
    </div>
  );
}
