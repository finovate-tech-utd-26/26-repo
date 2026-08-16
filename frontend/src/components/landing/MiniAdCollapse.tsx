import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const blocks = ["b1", "b2", "b3", "b4", "b5", "b6"];
const kept = new Set(["b1", "b4"]);

export function MiniAdCollapse({ size = "md" }: { size?: "sm" | "md" }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 2400);
    return () => clearInterval(id);
  }, []);

  const visible = blocks.filter((b) => !on || kept.has(b));
  const h = size === "sm" ? "h-6" : "h-9";

  return (
    <div className={cn("flex items-center gap-2", size === "sm" && "gap-1.5")}>
      <AnimatePresence>
        {visible.map((b) => (
          <motion.div
            key={b}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={cn(
              "rounded-md",
              h,
              on ? "w-16 bg-signal-500/25 ring-1 ring-signal-400/50" : "w-9 bg-ink-700"
            )}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
