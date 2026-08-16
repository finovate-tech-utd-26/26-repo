import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { MiniAdCollapse } from "./MiniAdCollapse";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-signal-400">
        For publishers and advertisers
      </p>
      <h1 className="mx-auto max-w-3xl font-display text-5xl font-medium leading-tight text-ink-50 sm:text-6xl">
        Fewer ads. Same revenue.
        <br />
        Less spend. Same reach.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-ink-400">
        Proicio matches content to advertisers with a live bandit auction — so publishers show
        fewer, better ads and advertisers stop paying for the wrong audience.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/publisher/onboarding">
          <Button size="lg">I show ads</Button>
        </Link>
        <Link to="/advertiser/onboarding">
          <Button size="lg" variant="amber">
            I buy ads
          </Button>
        </Link>
      </div>

      <div className="mt-14 flex justify-center">
        <div className="rounded-2xl border border-ink-800 bg-ink-900/60 px-8 py-6">
          <MiniAdCollapse />
        </div>
      </div>
    </section>
  );
}
