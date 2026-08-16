import { FileText, GitBranch, Gavel, Megaphone } from "lucide-react";

const stages = [
  { icon: FileText, label: "Publisher content", x: 20, accent: "signal" as const },
  { icon: GitBranch, label: "Embedding model", x: 280, accent: "signal" as const },
  { icon: Gavel, label: "Auction / bandit engine", x: 540, accent: "signal" as const },
  { icon: Megaphone, label: "Advertiser bids", x: 800, accent: "amber" as const },
];

const boxW = 160;
const boxH = 92;
const y = 30;
const midY = y + boxH / 2;

const connectors = [
  { x1: stages[0].x + boxW, x2: stages[1].x },
  { x1: stages[1].x + boxW, x2: stages[2].x },
  { x1: stages[2].x + boxW, x2: stages[3].x },
];

export function ArchitectureDiagram() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-700 bg-ink-900 p-6">
      <svg viewBox="0 0 980 300" className="mx-auto w-full min-w-[760px]" role="img" aria-label="Proicio matching architecture">
        <defs>
          <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-amber-500)" />
          </marker>
        </defs>

        {connectors.map((c, i) => (
          <g key={i}>
            <line
              x1={c.x1}
              y1={midY}
              x2={c.x2}
              y2={midY}
              stroke="var(--color-ink-700)"
              strokeWidth={2}
            />
            <circle cx={c.x1} cy={midY} r="4" fill="var(--color-signal-400)">
              <animateMotion
                dur="2.4s"
                repeatCount="indefinite"
                begin={`${i * 0.6}s`}
                path={`M${c.x1},${midY} L${c.x2},${midY}`}
              />
            </circle>
          </g>
        ))}

        <path
          d={`M${stages[3].x + boxW / 2},${y + boxH} C${stages[3].x + boxW / 2},250 ${stages[0].x + boxW / 2},250 ${stages[0].x + boxW / 2},${y + boxH}`}
          fill="none"
          stroke="var(--color-amber-600)"
          strokeWidth={2}
          strokeDasharray="4 4"
          markerEnd="url(#arrow-amber)"
        />
        <circle r="4" fill="var(--color-amber-400)">
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            path={`M${stages[3].x + boxW / 2},${y + boxH} C${stages[3].x + boxW / 2},250 ${stages[0].x + boxW / 2},250 ${stages[0].x + boxW / 2},${y + boxH}`}
          />
        </circle>
        <text
          x={490}
          y={272}
          textAnchor="middle"
          fill="var(--color-amber-400)"
          fontSize="12"
          className="font-sans"
        >
          Winning ad flows back to publisher
        </text>

        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <foreignObject key={stage.label} x={stage.x} y={y} width={boxW} height={boxH}>
              <div
                className={`flex h-full flex-col justify-center gap-2 rounded-xl border px-4 ${
                  stage.accent === "signal"
                    ? "border-signal-500/40 bg-signal-500/10"
                    : "border-amber-500/40 bg-amber-500/10"
                }`}
              >
                <Icon
                  size={16}
                  className={stage.accent === "signal" ? "text-signal-400" : "text-amber-400"}
                />
                <p className="text-xs font-medium leading-snug text-ink-100">{stage.label}</p>
              </div>
            </foreignObject>
          );
        })}

      </svg>
    </div>
  );
}
