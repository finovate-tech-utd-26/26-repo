import { useState } from "react";
import { updateSlot, updateSite } from "@/api/publisherApi";
import { useToast } from "@/context/ToastContext";
import { ApiError } from "@/lib/apiClient";
import type { AdSlot } from "@/types/api";

export function SlotConfigPanel({
  siteId,
  slots: initialSlots,
  maxAdsPerSession: initialMax,
}: {
  siteId: string;
  slots: AdSlot[];
  maxAdsPerSession: number;
}) {
  const [slots, setSlots] = useState(initialSlots);
  const [maxAds, setMaxAds] = useState(initialMax);
  const { push } = useToast();

  async function toggleSlot(id: string) {
    const target = slots.find((s) => s.id === id);
    if (!target) return;
    const nextEnabled = !target.enabled;
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: nextEnabled } : s)));
    try {
      await updateSlot(siteId, id, nextEnabled);
    } catch (err) {
      setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: target.enabled } : s)));
      push(err instanceof ApiError ? err.message : "Couldn't update that slot.", "warning");
    }
  }

  async function commitMaxAds(value: number) {
    try {
      await updateSite(siteId, { maxAdsPerSession: value });
    } catch (err) {
      push(err instanceof ApiError ? err.message : "Couldn't save that setting.", "warning");
    }
  }

  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
      <h3 className="mb-4 font-display text-base font-medium text-ink-50">Ad slot configuration</h3>

      <div className="flex flex-col divide-y divide-ink-800">
        {slots.map((slot) => (
          <div key={slot.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-ink-100">{slot.name}</p>
              <p className="text-xs capitalize text-ink-500">{slot.position.replace("-", " ")}</p>
            </div>
            <button
              onClick={() => toggleSlot(slot.id)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                slot.enabled ? "bg-signal-500" : "bg-ink-700"
              }`}
            >
              <span
                className="absolute top-1 h-4 w-4 rounded-full bg-ink-950 transition-all"
                style={{ left: slot.enabled ? 24 : 4 }}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-ink-800 pt-5">
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
          onMouseUp={(e) => commitMaxAds(Number(e.currentTarget.value))}
          onTouchEnd={(e) => commitMaxAds(Number(e.currentTarget.value))}
          className="w-full accent-signal-500"
        />
      </div>
    </div>
  );
}
