import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { WizardShell } from "@/components/WizardShell";
import { Button } from "@/components/Button";
import { AdCreativePreviewCard } from "@/components/advertiser/AdCreativePreviewCard";
import { CategoryTagList } from "@/components/CategoryTagList";
import { businessCategories, predictCategories } from "@/lib/categories";
import { createCampaign } from "@/api/advertiserApi";
import { ApiError } from "@/lib/apiClient";

const steps = ["Basics", "Budget", "Creative", "Targeting", "Review"];

export default function AdvertiserNewCampaign() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(businessCategories[0]);
  const [budget, setBudget] = useState(500);
  const [dailyCap, setDailyCap] = useState(30);
  const [pacing, setPacing] = useState<"even" | "accelerated">("even");
  const [headline, setHeadline] = useState("");
  const [cta, setCta] = useState("Shop Now");
  const [launched, setLaunched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predicted = predictCategories(category);

  async function handleNext() {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await createCampaign({
        name,
        category,
        budget,
        dailyCap,
        pacing,
        creative: { headline, cta },
      });
      setLaunched(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't launch that campaign.");
    } finally {
      setSubmitting(false);
    }
  }

  if (launched) {
    return (
      <div className="mx-auto max-w-xl text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400"
        >
          <CheckCircle2 size={32} />
        </motion.div>
        <h1 className="mt-6 font-display text-2xl font-medium text-ink-50">Campaign launched</h1>
        <p className="mt-2 text-sm text-ink-400">
          {name || "Your campaign"} is live and matching against {predicted.length} categories.
        </p>
        <Button className="mt-8" variant="amber" onClick={() => navigate("/advertiser/campaigns")}>
          View campaigns
        </Button>
      </div>
    );
  }

  return (
    <WizardShell
      title="Create a new campaign"
      steps={steps}
      currentIndex={step}
      onBack={step > 0 ? () => setStep((s) => s - 1) : undefined}
      onNext={handleNext}
      nextLabel={submitting ? "Launching…" : step === steps.length - 1 ? "Launch campaign" : "Continue"}
      nextDisabled={submitting || (step === 0 && !name.trim())}
    >
      {error && <p className="mb-4 text-sm text-bad-500">{error}</p>}

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Campaign name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Local Bakery — Spring Promo"
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Business category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-amber-500"
            >
              {businessCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label className="text-sm text-ink-300">Total budget</label>
              <span className="font-display text-lg font-medium text-ink-50">${budget}</span>
            </div>
            <input
              type="range"
              min={100}
              max={2000}
              step={10}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label className="text-sm text-ink-300">Daily cap</label>
              <span className="font-medium text-ink-50">${dailyCap}</span>
            </div>
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={dailyCap}
              onChange={(e) => setDailyCap(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-ink-300">Pacing style</label>
            <div className="flex gap-2">
              {(["even", "accelerated"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPacing(p)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition ${
                    pacing === p
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-ink-700 text-ink-300 hover:border-ink-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-ink-300">Headline</label>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Fresh sourdough, baked daily"
                className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-ink-300">Call to action</label>
              <input
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm text-ink-300">Preview</p>
            <AdCreativePreviewCard headline={headline} cta={cta} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="mb-1 text-sm text-ink-300">Predicted targeting</p>
          <p className="mb-4 text-xs text-ink-500">
            Based on your creative and category, Proicio will match this campaign against:
          </p>
          <CategoryTagList categories={predicted} />
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex justify-between border-b border-ink-800 pb-3">
            <span className="text-ink-400">Campaign</span>
            <span className="text-ink-100">{name || "Untitled campaign"}</span>
          </div>
          <div className="flex justify-between border-b border-ink-800 pb-3">
            <span className="text-ink-400">Budget</span>
            <span className="text-ink-100">${budget} total · ${dailyCap}/day · {pacing}</span>
          </div>
          <div className="flex justify-between border-b border-ink-800 pb-3">
            <span className="text-ink-400">Creative</span>
            <span className="text-ink-100">{headline || "No headline set"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-400">Targeting</span>
            <span className="text-right text-ink-100">{predicted.join(", ")}</span>
          </div>
        </div>
      )}
    </WizardShell>
  );
}
