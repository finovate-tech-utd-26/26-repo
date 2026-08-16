export function CategoryTagList({ categories }: { categories: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <span
          key={cat}
          className="rounded-full border border-ink-700 bg-ink-800 px-3 py-1 text-xs text-ink-300"
        >
          {cat}
        </span>
      ))}
    </div>
  );
}
