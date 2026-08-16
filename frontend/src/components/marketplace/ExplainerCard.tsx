import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ExplainerItem = {
  title: string;
  body: string;
  example?: string;
};

export function ExplainerCard({ item }: { item: ExplainerItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-ink-100">{item.title}</span>
        <ChevronDown
          size={16}
          className={cn("text-ink-400 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="border-t border-ink-800 px-5 py-4">
          <p className="text-sm text-ink-400">{item.body}</p>
          {item.example && (
            <p className="mt-3 rounded-lg bg-ink-950 px-3 py-2 font-mono text-xs text-signal-300">
              {item.example}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
