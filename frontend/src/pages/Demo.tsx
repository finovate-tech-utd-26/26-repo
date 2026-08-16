import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { AdPageMock } from "@/components/demo/AdPageMock";
import { CampaignBudgetSlider } from "@/components/demo/CampaignBudgetSlider";
import { OutcomeComparisonCards } from "@/components/demo/OutcomeComparisonCards";
import { MatchingEngineTicker, type MatchingEngineTickerHandle } from "@/components/MatchingEngineTicker";
import { ChartCard } from "@/components/charts/ChartCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { FunnelSteps } from "@/components/charts/FunnelSteps";
import { SimpleBarChart } from "@/components/charts/SimpleBarChart";
import { StatCounter } from "@/components/StatCounter";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

const revenuePerSession = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  revenue: 0.44 + Math.sin(i / 2) * 0.02,
}));

const pacingByDay = [
  { day: "Mon", even: 64, naive: 138 },
  { day: "Tue", even: 60, naive: 132 },
  { day: "Wed", even: 68, naive: 58 },
  { day: "Thu", even: 62, naive: 44 },
  { day: "Fri", even: 70, naive: 52 },
  { day: "Sat", even: 58, naive: 48 },
  { day: "Sun", even: 66, naive: 46 },
];

type Tab = "publisher" | "advertiser";

export default function Demo() {
  const [tab, setTab] = useState<Tab>("publisher");
  const [signalOn, setSignalOn] = useState(false);
  const [budget, setBudget] = useState(500);
  const tickerRef = useRef<MatchingEngineTickerHandle>(null);

  const cpaSignal = 6;
  const cpaNaive = 9.2;
  const conversions = Math.round(budget / cpaSignal);
  const naiveSpend = Math.round(conversions * cpaNaive);

  const funnelSignal = useMemo(
    () => [
      { label: "Impressions", value: 10000 },
      { label: "Clicks", value: 410 },
      { label: "Conversions", value: conversions },
    ],
    [conversions]
  );
  const funnelNaive = useMemo(
    () => [
      { label: "Impressions", value: 10000 },
      { label: "Clicks", value: 320 },
      { label: "Conversions", value: conversions },
    ],
    [conversions]
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-signal-400">Live demo</p>
        <h1 className="mt-1 font-display text-3xl font-medium text-ink-50">See Proicio decide, live</h1>
        <p className="mt-2 max-w-2xl text-ink-400">
          Toggle between what a publisher and an advertiser see. Every event in the ticker below
          is generated in real time by the same matching logic driving both views.
        </p>
      </div>

      <div className="mb-8 inline-flex rounded-xl border border-ink-700 bg-ink-900 p-1">
        {(["publisher", "advertiser"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg px-5 py-2 text-sm font-medium capitalize transition",
              tab === t ? "bg-ink-100 text-ink-950" : "text-ink-300 hover:text-ink-50"
            )}
          >
            {t} view
          </button>
        ))}
      </div>

      {tab === "publisher" ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-ink-700 bg-ink-900 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-ink-100">Enable Proicio</p>
                <p className="text-xs text-ink-400">{signalOn ? "After — 2 slots" : "Before — 6 slots"}</p>
              </div>
              <button
                onClick={() => setSignalOn((v) => !v)}
                className={cn(
                  "relative h-8 w-14 rounded-full transition-colors",
                  signalOn ? "bg-signal-500" : "bg-ink-700"
                )}
              >
                <motion.span
                  layout
                  className="absolute top-1 h-6 w-6 rounded-full bg-ink-950"
                  animate={{ left: signalOn ? 28 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            <AdPageMock signalOn={signalOn} />

            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => tickerRef.current?.pushEvent()}
            >
              <PlayCircle size={14} />
              Simulate visitor
            </Button>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <ChartCard title="Revenue per session" subtitle="Held steady across the toggle">
              <TrendChart
                data={revenuePerSession}
                xKey="day"
                series={[{ key: "revenue", label: "Revenue/session", color: "var(--color-signal-500)", fill: true }]}
                height={180}
                valueFormatter={(v) => `$${Number(v).toFixed(2)}`}
              />
              <p className="mt-2 text-xs text-good-500">
                Revenue held steady with 67% fewer ads shown.
              </p>
            </ChartCard>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Ads shown", value: signalOn ? 2 : 6, suffix: "" },
                { label: "Revenue/session", value: signalOn ? 0.47 : 0.45, decimals: 2, suffix: "", prefix: "$" },
                { label: "Bounce rate", value: signalOn ? -18 : 0, suffix: "%" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-ink-700 bg-ink-900 p-4">
                  <p className="text-xs text-ink-400">{stat.label}</p>
                  <p className="mt-1 font-display text-xl font-medium text-ink-50">
                    <StatCounter
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals ?? 0}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
              <p className="mb-4 text-sm font-medium text-ink-100">Local Bakery — Spring Promo</p>
              <CampaignBudgetSlider value={budget} onChange={setBudget} />
            </div>
            <OutcomeComparisonCards naiveSpend={naiveSpend} signalSpend={budget} conversions={conversions} />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-3">
            <ChartCard
              title="Impressions → Clicks → Conversions"
              legend={[
                { label: "With Proicio", color: "var(--color-amber-500)" },
                { label: "Without Proicio", color: "var(--color-ink-500)" },
              ]}
            >
              <div className="grid grid-cols-2 gap-8">
                <FunnelSteps steps={funnelSignal} color="var(--color-amber-500)" />
                <FunnelSteps steps={funnelNaive} color="var(--color-ink-500)" />
              </div>
            </ChartCard>

            <ChartCard title="Budget pacing" subtitle="Even delivery vs. naive front-loading">
              <SimpleBarChart
                data={pacingByDay}
                xKey="day"
                series={[
                  { key: "even", label: "With Proicio", color: "var(--color-amber-500)" },
                  { key: "naive", label: "Without Proicio", color: "var(--color-ink-600)" },
                ]}
                height={200}
                valueFormatter={(v) => `$${v}`}
              />
            </ChartCard>
          </div>
        </div>
      )}

      <div className="mt-8">
        <MatchingEngineTicker ref={tickerRef} />
      </div>
    </div>
  );
}
