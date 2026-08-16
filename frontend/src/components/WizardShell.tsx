import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepIndicator } from "./StepIndicator";
import { Button } from "./Button";

export function WizardShell({
  title,
  steps,
  currentIndex,
  children,
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
  hideFooter,
}: {
  title: string;
  steps: string[];
  currentIndex: number;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideFooter?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className="mb-6 font-display text-2xl font-medium text-ink-50">{title}</h1>
      <StepIndicator steps={steps} currentIndex={currentIndex} />

      <div className="mt-8 rounded-2xl border border-ink-700 bg-ink-900 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        {!hideFooter && (
          <div className="mt-8 flex items-center justify-between border-t border-ink-800 pt-5">
            <Button variant="ghost" size="sm" onClick={onBack} disabled={!onBack}>
              Back
            </Button>
            <Button size="md" onClick={onNext} disabled={nextDisabled}>
              {nextLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
