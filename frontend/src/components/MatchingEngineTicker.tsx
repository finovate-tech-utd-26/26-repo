import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity } from "lucide-react";
import { streamAuctionEvents, simulateVisitor } from "@/api/marketplaceApi";
import type { TickerEvent } from "@/types/api";
import { cn } from "@/lib/utils";

const kindDot: Record<TickerEvent["kind"], string> = {
  match: "bg-signal-400",
  embedding: "bg-amber-400",
  auction: "bg-ink-300",
};

export type MatchingEngineTickerHandle = {
  pushEvent: () => void;
};

export const MatchingEngineTicker = forwardRef<MatchingEngineTickerHandle, { maxItems?: number }>(
  function MatchingEngineTicker({ maxItems = 8 }, ref) {
    const [events, setEvents] = useState<TickerEvent[]>([]);
    const sourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
      const source = streamAuctionEvents((event) => {
        setEvents((prev) => [event, ...prev].slice(0, maxItems));
      });
      sourceRef.current = source;
      return () => source.close();
    }, [maxItems]);

    useImperativeHandle(ref, () => ({
      pushEvent: () => {
        simulateVisitor().catch(() => {});
      },
    }));

    return (
      <div className="rounded-2xl border border-ink-700 bg-ink-900">
        <div className="flex items-center gap-2 border-b border-ink-800 px-4 py-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-400" />
          </span>
          <Activity size={14} className="text-ink-400" />
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Matching engine — live
          </p>
        </div>
        <div className="flex flex-col divide-y divide-ink-800/70 font-mono text-xs">
          {events.length === 0 && (
            <p className="px-4 py-3 text-ink-500">Waiting for the first event…</p>
          )}
          <AnimatePresence initial={false}>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 overflow-hidden px-4 py-2.5"
              >
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", kindDot[event.kind])} />
                <span className="truncate text-ink-300">{event.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);
