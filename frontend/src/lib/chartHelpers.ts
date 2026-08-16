export function dateLabel(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function seededSeries(days: number, base: number, volatility: number, drift = 0) {
  const out: number[] = [];
  let value = base;
  for (let i = 0; i < days; i++) {
    value += Math.random() * volatility * 2 - volatility + drift;
    value = Math.max(base * 0.4, value);
    out.push(Math.round(value * 100) / 100);
  }
  return out;
}
