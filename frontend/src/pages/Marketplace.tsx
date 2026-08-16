import { ArchitectureDiagram } from "@/components/marketplace/ArchitectureDiagram";
import { ExplainerCard, type ExplainerItem } from "@/components/marketplace/ExplainerCard";
import { MatchingEngineTicker } from "@/components/MatchingEngineTicker";

const explainers: ExplainerItem[] = [
  {
    title: "Content embedding",
    body: "As a page is crawled, its text is embedded into a vector that captures what it's about — no cookies, no user history, just the content itself.",
    example: '"outdoor gear review, trail shoes" → [0.12, -0.44, 0.81, …] → Sporting Goods',
  },
  {
    title: "Bandit + auction match",
    body: "A multi-armed bandit ranks candidate ads by predicted conversion for this content vector, then a second-price auction sets the clearing price among the top candidates.",
    example: "4 bidders → ranked by predicted CVR → clearing price = 2nd highest bid",
  },
  {
    title: "Advertiser bids",
    body: "Advertisers set a budget and target CPA; Proicio converts that into a live bid for every auction its targeting matches.",
    example: 'Local Bakery: target $5 CPA → bid $0.42 for this session',
  },
  {
    title: "Winning ad flows back",
    body: "The winning ad renders in the publisher's slot within milliseconds — the whole loop runs per-pageview, not per-cookie.",
  },
];

export default function Marketplace() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-signal-400">Under the hood</p>
        <h1 className="mt-1 font-display text-3xl font-medium text-ink-50">
          How the matching engine works
        </h1>
        <p className="mt-2 max-w-2xl text-ink-400">
          Content flows in from the publisher, gets embedded and matched against live advertiser
          bids, and a winning ad flows back — all in real time.
        </p>
      </div>

      <div className="mb-8">
        <ArchitectureDiagram />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-3 lg:col-span-2">
          {explainers.map((item) => (
            <ExplainerCard key={item.title} item={item} />
          ))}
        </div>
        <div className="lg:col-span-3">
          <MatchingEngineTicker maxItems={12} />
        </div>
      </div>
    </div>
  );
}
