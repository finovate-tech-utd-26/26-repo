import { useEffect, useState } from "react";
import { CreditCard, Users } from "lucide-react";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { updateProfile } from "@/api/authApi";
import { businessCategories } from "@/lib/categories";
import { ApiError } from "@/lib/apiClient";

const goalOptions = ["Drive online sales", "Get more foot traffic", "Build local awareness", "Grow bookings"];

export default function AdvertiserSettings() {
  const { user, refreshProfile } = useAuth();
  const { push } = useToast();

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState(businessCategories[0]);
  const [advertiserGoal, setAdvertiserGoal] = useState(goalOptions[0]);
  const [monthlyBudgetRange, setMonthlyBudgetRange] = useState(500);
  const [notifyOnActivity, setNotifyOnActivity] = useState(true);
  const [notifyOnRecommendations, setNotifyOnRecommendations] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setBusinessName(user.businessName ?? "");
    setCategory(user.category ?? businessCategories[0]);
    setAdvertiserGoal(user.advertiserGoal ?? goalOptions[0]);
    setMonthlyBudgetRange(user.monthlyBudgetRange ?? 500);
    setNotifyOnActivity(user.notifyOnActivity);
    setNotifyOnRecommendations(user.notifyOnRecommendations);
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({
        businessName,
        category,
        advertiserGoal,
        monthlyBudgetRange,
        notifyOnActivity,
        notifyOnRecommendations,
      });
      await refreshProfile();
      push("Settings saved.", "success");
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Couldn't save settings.", "warning");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium text-ink-50">Settings</h1>

      <div className="max-w-xl rounded-2xl border border-ink-700 bg-ink-900 p-6">
        <h2 className="mb-4 font-display text-base font-medium text-ink-50">Profile</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Email</label>
            <input
              disabled
              value={user?.email ?? ""}
              className="w-full rounded-lg border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-ink-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Business name</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Category</label>
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
          <div>
            <label className="mb-1.5 block text-sm text-ink-300">Primary goal</label>
            <select
              value={advertiserGoal}
              onChange={(e) => setAdvertiserGoal(e.target.value)}
              className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-ink-100 outline-none focus:border-amber-500"
            >
              {goalOptions.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label className="text-sm text-ink-300">Typical monthly budget</label>
              <span className="font-medium text-ink-50">${monthlyBudgetRange}</span>
            </div>
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={monthlyBudgetRange}
              onChange={(e) => setMonthlyBudgetRange(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        <h2 className="mb-3 mt-6 font-display text-base font-medium text-ink-50">Notifications</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-ink-300">
            <input
              type="checkbox"
              checked={notifyOnActivity}
              onChange={(e) => setNotifyOnActivity(e.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            Email me about campaign activity
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-300">
            <input
              type="checkbox"
              checked={notifyOnRecommendations}
              onChange={(e) => setNotifyOnRecommendations(e.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            Email me budget recommendations
          </label>
        </div>

        <Button variant="amber" className="mt-6" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <div className="mt-6 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
        <EmptyState icon={<CreditCard size={18} />} title="Billing" description="Coming soon." />
        <EmptyState icon={<Users size={18} />} title="Team members" description="Coming soon." />
      </div>
    </div>
  );
}
