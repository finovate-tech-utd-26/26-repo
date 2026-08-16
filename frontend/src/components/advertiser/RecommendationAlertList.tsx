import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

type Tone = "warning" | "info" | "success";

const toneIcon: Record<Tone, typeof AlertTriangle> = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const toneClasses: Record<Tone, string> = {
  warning: "text-amber-400 bg-amber-500/10",
  info: "text-signal-400 bg-signal-500/10",
  success: "text-good-500 bg-good-500/10",
};

export function RecommendationAlertList({
  items,
}: {
  items: { id: string; text: string; tone: Tone }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const Icon = toneIcon[item.tone];
        return (
          <div key={item.id} className="flex items-start gap-3 rounded-xl border border-ink-700 bg-ink-900 p-4">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${toneClasses[item.tone]}`}>
              <Icon size={14} />
            </span>
            <p className="text-sm text-ink-300">{item.text}</p>
          </div>
        );
      })}
    </div>
  );
}
