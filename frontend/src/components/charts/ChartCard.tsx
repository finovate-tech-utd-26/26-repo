import type { ReactNode } from "react";

export function ChartCard({
  title,
  subtitle,
  actions,
  legend,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  legend?: { label: string; color: string; dashed?: boolean }[];
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-medium text-ink-50">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          {legend && (
            <div className="flex items-center gap-3">
              {legend.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs text-ink-300">
                  <span
                    className="h-0.5 w-3"
                    style={{
                      background: item.dashed ? "transparent" : item.color,
                      borderTop: item.dashed ? `2px dashed ${item.color}` : undefined,
                    }}
                  />
                  {item.label}
                </div>
              ))}
            </div>
          )}
          {actions}
        </div>
      </div>
      {children}
    </div>
  );
}
