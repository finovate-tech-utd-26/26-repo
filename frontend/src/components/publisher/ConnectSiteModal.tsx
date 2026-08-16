import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { CodeSnippetBlock } from "@/components/CodeSnippetBlock";
import { createSite } from "@/api/publisherApi";
import { businessCategories } from "@/lib/categories";
import { ApiError } from "@/lib/apiClient";
import type { Site } from "@/types/api";

type Step = "form" | "verifying" | "success";

export function ConnectSiteModal({
  open,
  onClose,
  onSiteCreated,
}: {
  open: boolean;
  onClose: () => void;
  onSiteCreated?: (site: Site) => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState(businessCategories[0]);
  const [site, setSite] = useState<Site | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep("form");
      setName("");
      setUrl("");
      setSite(null);
      setError(null);
    }, 200);
  }

  async function handleSubmit() {
    setError(null);
    setStep("verifying");
    try {
      const created = await createSite({ name, url, category });
      setSite(created);
      onSiteCreated?.(created);
      setStep("success");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't connect that site.");
      setStep("form");
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Connect a new site">
      {step === "form" && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Site name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Trailhead Gear Reviews"
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-signal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Site URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yoursite.com"
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-signal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-signal-500"
            >
              {businessCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-bad-500">{error}</p>}
          <Button onClick={handleSubmit} disabled={!name.trim() || !url.trim()}>
            Continue
          </Button>
        </div>
      )}

      {step === "verifying" && (
        <div className="flex flex-col items-center py-6 text-center">
          <Loader2 size={28} className="animate-spin text-signal-400" />
          <p className="mt-4 text-sm text-ink-300">Connecting {url}…</p>
        </div>
      )}

      {step === "success" && site && (
        <div>
          <div className="mb-4 flex items-center gap-2 text-good-500">
            <CheckCircle2 size={18} />
            <p className="text-sm font-medium">Site connected</p>
          </div>
          <p className="mb-3 text-sm text-ink-400">
            Add this snippet before <code className="text-ink-300">&lt;/body&gt;</code> to start
            serving Proicio ads:
          </p>
          <CodeSnippetBlock code={site.embedSnippet} />
          <Button className="mt-5 w-full" onClick={handleClose}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
}
