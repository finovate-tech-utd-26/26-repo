import { Fragment } from "react";
import { FileText, GitBranch, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Content embedding",
    body: "Every page is embedded into a content vector as it's crawled — no cookies, no user profiles.",
  },
  {
    icon: GitBranch,
    title: "Bandit + auction match",
    body: "A live bandit ranks candidate ads by predicted conversion; a second-price auction sets the price.",
  },
  {
    icon: Sparkles,
    title: "Fewer, better ads",
    body: "Only the highest-confidence matches make it to the page — usually two, sometimes just one.",
  },
];

export function StepDiagram() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-10 text-center font-display text-2xl font-medium text-ink-50">
        How it works
      </h2>
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <Fragment key={step.title}>
              <div className="flex-1 rounded-2xl border border-ink-800 bg-ink-900 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-signal-500/10 text-signal-400">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 font-display text-base font-medium text-ink-100">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-ink-400">{step.body}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden shrink-0 text-ink-600 sm:flex sm:items-center">
                  <ArrowRight size={20} />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
