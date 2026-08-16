import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { WizardShell } from "@/components/WizardShell";
import { Button } from "@/components/Button";
import { businessCategories } from "@/lib/categories";
import { updateProfile } from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/apiClient";

const steps = ["Business info", "Goals", "Budget range", "Done"];
const goalOptions = ["Drive online sales", "Get more foot traffic", "Build local awareness", "Grow bookings"];

export default function AdvertiserOnboarding() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState({ name: "", category: businessCategories[0] });
  const [goal, setGoal] = useState(goalOptions[0]);
  const [budgetRange, setBudgetRange] = useState(500);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNext() {
    if (step < 2) {
      setStep((s) => s + 1);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await updateProfile({
        businessName: business.name,
        category: business.category,
        advertiserGoal: goal,
        monthlyBudgetRange: budgetRange,
      });
      await refreshProfile();
      setStep(3);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't save your profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 3) {
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
        <h1 className="mt-6 font-display text-2xl font-medium text-ink-50">You're all set</h1>
        <p className="mt-2 text-sm text-ink-400">
          {business.name || "Your business"} is ready to launch its first campaign.
        </p>
        <Button className="mt-8" variant="amber" onClick={() => navigate("/advertiser")}>
          Go to dashboard
        </Button>
      </div>
    );
  }

  return (
    <WizardShell
      title="Set up your advertiser account"
      steps={steps}
      currentIndex={step}
      onBack={step > 0 ? () => setStep((s) => s - 1) : undefined}
      onNext={handleNext}
      nextLabel={submitting ? "Please wait…" : step === 2 ? "Finish setup" : "Continue"}
      nextDisabled={submitting || (step === 0 && !business.name.trim())}
    >
      {error && <p className="mb-4 text-sm text-bad-500">{error}</p>}

      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Business name</label>
            <input
              value={business.name}
              onChange={(e) => setBusiness((b) => ({ ...b, name: e.target.value }))}
              placeholder="Local Bakery"
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Category</label>
            <select
              value={business.category}
              onChange={(e) => setBusiness((b) => ({ ...b, category: e.target.value }))}
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
        <div>
          <p className="mb-3 text-sm text-ink-300">What's your main goal?</p>
          <div className="flex flex-col gap-2">
            {goalOptions.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                  goal === g
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-ink-700 text-ink-300 hover:border-ink-600"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label className="text-sm text-ink-300">Monthly budget range</label>
            <span className="font-display text-lg font-medium text-ink-50">${budgetRange}</span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={budgetRange}
            onChange={(e) => setBudgetRange(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
      )}
    </WizardShell>
  );
}
