import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SlotDef = {
  id: string;
  label: string;
  area: string;
  keptWhenSignalOn: boolean;
};

const slots: SlotDef[] = [
  { id: "banner", label: "Banner", area: "banner", keptWhenSignalOn: true },
  { id: "sidebar-1", label: "Sidebar", area: "sidebar1", keptWhenSignalOn: false },
  { id: "sidebar-2", label: "Sidebar", area: "sidebar2", keptWhenSignalOn: false },
  { id: "in-content-1", label: "In-article", area: "incontent1", keptWhenSignalOn: true },
  { id: "in-content-2", label: "In-article", area: "incontent2", keptWhenSignalOn: false },
  { id: "footer", label: "Footer", area: "footer", keptWhenSignalOn: false },
];

function TextLines({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-2.5 rounded bg-ink-700"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function AdPageMock({ signalOn }: { signalOn: boolean }) {
  const visibleSlots = slots.filter((s) => !signalOn || s.keptWhenSignalOn);

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
      <div className="flex items-center gap-1.5 border-b border-ink-800 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink-600" />
        <span className="ml-3 truncate rounded bg-ink-800 px-3 py-1 text-[11px] text-ink-500">
          trailheadgear.com/reviews/best-trail-shoes-2026
        </span>
      </div>

      <div className="p-4">
        <AnimatePresence>
          {visibleSlots
            .filter((s) => s.area === "banner")
            .map((s) => (
              <AdSlot key={s.id} label={s.label} signalOn={signalOn} className="mb-4 h-16" />
            ))}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-4">
            <div className="h-24 w-full rounded-lg bg-gradient-to-br from-ink-700 to-ink-800" />
            <TextLines lines={3} />

            <AnimatePresence>
              {visibleSlots
                .filter((s) => s.area === "incontent1")
                .map((s) => (
                  <AdSlot
                    key={s.id}
                    label={s.label}
                    signalOn={signalOn}
                    className={signalOn ? "h-24" : "h-14"}
                  />
                ))}
            </AnimatePresence>

            <TextLines lines={2} />

            <AnimatePresence>
              {visibleSlots
                .filter((s) => s.area === "incontent2")
                .map((s) => (
                  <AdSlot key={s.id} label={s.label} signalOn={signalOn} className="h-14" />
                ))}
            </AnimatePresence>

            <TextLines lines={3} />
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {visibleSlots
                .filter((s) => s.area === "sidebar1" || s.area === "sidebar2")
                .map((s) => (
                  <AdSlot key={s.id} label={s.label} signalOn={signalOn} className="h-28" />
                ))}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {visibleSlots
            .filter((s) => s.area === "footer")
            .map((s) => (
              <AdSlot key={s.id} label={s.label} signalOn={signalOn} className="mt-4 h-14" />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AdSlot({
  label,
  signalOn,
  className,
}: {
  label: string;
  signalOn: boolean;
  className?: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "flex items-center justify-center rounded-lg border text-[11px] font-medium uppercase tracking-wide",
        signalOn
          ? "border-signal-500/40 bg-signal-500/10 text-signal-400"
          : "border-ink-600 bg-ink-800 text-ink-500",
        className
      )}
    >
      {label} ad
    </motion.div>
  );
}
