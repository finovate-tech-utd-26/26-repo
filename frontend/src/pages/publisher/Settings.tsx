import { useEffect, useState } from "react";
import { CreditCard, Users } from "lucide-react";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { updateProfile } from "@/api/authApi";
import { businessCategories } from "@/lib/categories";
import { ApiError } from "@/lib/apiClient";

export default function PublisherSettings() {
  const { user, refreshProfile } = useAuth();
  const { push } = useToast();

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState(businessCategories[0]);
  const [notifyOnActivity, setNotifyOnActivity] = useState(true);
  const [notifyOnRecommendations, setNotifyOnRecommendations] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setBusinessName(user.businessName ?? "");
    setCategory(user.category ?? businessCategories[0]);
    setNotifyOnActivity(user.notifyOnActivity);
    setNotifyOnRecommendations(user.notifyOnRecommendations);
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({ businessName, category, notifyOnActivity, notifyOnRecommendations });
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
        </div>

        <h2 className="mb-3 mt-6 font-display text-base font-medium text-ink-50">Notifications</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-ink-300">
            <input
              type="checkbox"
              checked={notifyOnActivity}
              onChange={(e) => setNotifyOnActivity(e.target.checked)}
              className="h-4 w-4 accent-signal-500"
            />
            Email me about site activity
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-300">
            <input
              type="checkbox"
              checked={notifyOnRecommendations}
              onChange={(e) => setNotifyOnRecommendations(e.target.checked)}
              className="h-4 w-4 accent-signal-500"
            />
            Email me new Proicio recommendations
          </label>
        </div>

        <Button className="mt-6" onClick={handleSave} disabled={saving}>
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
