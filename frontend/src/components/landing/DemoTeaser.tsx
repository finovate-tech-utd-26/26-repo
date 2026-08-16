import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MiniAdCollapse } from "./MiniAdCollapse";

export function DemoTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col items-center gap-8 rounded-2xl border border-ink-800 bg-ink-900 px-8 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 className="font-display text-2xl font-medium text-ink-50">
            Watch the engine make the call
          </h2>
          <p className="mt-2 max-w-md text-sm text-ink-400">
            Toggle Proicio on live and watch six ad slots collapse into two — with a matching
            engine ticker showing every decision as it happens.
          </p>
          <Link
            to="/demo"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-signal-400 hover:text-signal-300"
          >
            Try the full demo
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="shrink-0 rounded-xl border border-ink-800 bg-ink-950 px-6 py-5">
          <MiniAdCollapse />
        </div>
      </div>
    </section>
  );
}
