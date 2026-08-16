import { LayoutGrid, TrendingDown, LogOut } from "lucide-react";

const items = [
  {
    icon: LayoutGrid,
    title: "Publishers overload pages",
    body: "Six ad slots crammed around content, hoping enough of them convert to make up for the clutter.",
  },
  {
    icon: TrendingDown,
    title: "Advertisers overspend on the wrong audience",
    body: "Naive targeting means paying full price to reach people who were never going to convert.",
  },
  {
    icon: LogOut,
    title: "Users leave",
    body: "Slow, cluttered pages push readers away before either side gets any value at all.",
  },
];

export function ProblemStatement() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-ink-800 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-800 text-ink-300">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 font-display text-base font-medium text-ink-100">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-ink-400">{item.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
