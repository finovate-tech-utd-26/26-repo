import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { WizardShell } from "@/components/WizardShell";
import { CodeSnippetBlock } from "@/components/CodeSnippetBlock";
import { Button } from "@/components/Button";
import { createSite, updateSite } from "@/api/publisherApi";
import { updateProfile } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";
import { businessCategories } from "@/lib/categories";
import { ApiError } from "@/lib/apiClient";
import type { Site } from "@/types/api";

const steps = ["Business info", "Connect site", "Preferences", "Done"];

export default function PublisherOnboarding() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState({ name: "", url: "", category: businessCategories[0] });
  const [site, setSite] = useState<Site | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [maxAds, setMaxAds] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNext() {
    setError(null);
    if (step === 0) {
      setSubmitting(true);
      try {
        const [createdSite] = await Promise.all([
          createSite({ name: business.name, url: business.url, category: business.category }),
          updateProfile({ businessName: business.name, category: business.category }),
        ]);
        setSite(createdSite);
        await refreshProfile();
        setStep(1);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Couldn't connect that site.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (step === 2 && site) {
      setSubmitting(true);
      try {
        await updateSite(site.id, { maxAdsPerSession: maxAds });
        setStep(3);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Couldn't save preferences.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setStep((s) => s + 1);
  }

  if (step === 3) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-signal-500/10 text-signal-400"
        >
          <CheckCircle2 size={32} />
        </motion.div>
        <h1 className="mt-6 font-display text-2xl font-medium text-ink-50">You're all set</h1>
        <p className="mt-2 text-sm text-ink-400">
          {business.name || "Your site"} is connected and Proicio is live.
        </p>
        <Button className="mt-8" onClick={() => navigate("/publisher")}>
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <WizardShell
      title="Set up your publisher account"
      steps={steps}
      currentIndex={step}
      onBack={step > 0 ? () => setStep((s) => s - 1) : undefined}
      onNext={handleNext}
      nextDisabled={
        submitting ||
        (step === 0 && (!business.name.trim() || !business.url.trim())) ||
        (step === 1 && !confirmed)
      }
      nextLabel={submitting ? "Please wait…" : step === 2 ? "Finish setup" : "Continue"}
    >
      {error && <p className="mb-4 text-sm text-bad-500">{error}</p>}

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Business name</label>
            <input
              value={business.name}
              onChange={(e) => setBusiness((b) => ({ ...b, name: e.target.value }))}
              placeholder="Trailhead Gear Reviews"
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-signal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Site URL</label>
            <input
              value={business.url}
              onChange={(e) => setBusiness((b) => ({ ...b, url: e.target.value }))}
              placeholder="yoursite.com"
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-signal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Category</label>
            <select
              value={business.category}
              onChange={(e) => setBusiness((b) => ({ ...b, category: e.target.value }))}
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-signal-500"
            >
              {businessCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {step === 1 && site && (
        <div>
          <p className="mb-3 text-sm text-ink-400">
            Add this snippet before <code className="text-ink-300">&lt;/body&gt;</code> on{" "}
            {business.url}:
          </p>
          <CodeSnippetBlock code={site.embedSnippet} />
          <label className="mt-4 flex items-center gap-2 text-sm text-ink-300">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="h-4 w-4 accent-signal-500"
            />
            I've added this snippet to my site
          </label>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-sm text-ink-300">Max ads per session</label>
            <span className="font-medium text-ink-50">{maxAds}</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            value={maxAds}
            onChange={(e) => setMaxAds(Number(e.target.value))}
            className="w-full accent-signal-500"
          />
        </div>
      )}
    </WizardShell>
  );
}
