import { CategoryTagList } from "@/components/CategoryTagList";

export function TargetingPanel({ targeting }: { targeting: string[] }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
      <p className="mb-3 text-sm font-medium text-ink-100">Targeting</p>
      <p className="mb-3 text-xs text-ink-500">
        Matched automatically from your creative and category — read-only.
      </p>
      <CategoryTagList categories={targeting} />
    </div>
  );
}
