/** Maps `domain` onto `range`. Not clamped. A zero-width domain returns `range[0]`. */
export function linearScale(
  domain: [number, number],
  range: [number, number],
): (v: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d1 === d0) return () => r0;
  return (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
}

/** Ascending "nice" ticks bracketing [min, max]. */
export function niceTicks(min: number, max: number, target = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min > max) [min, max] = [max, min];
  if (min === 0 && max === 0) return [0, 1];
  if (min === max) {
    if (max > 0) min = 0;
    else max = 0;
  }

  const raw = (max - min) / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;

  const start = Math.floor(min / step + 1e-9);
  const end = Math.ceil(max / step - 1e-9);
  const decimals = Math.max(0, -Math.floor(Math.log10(step)));

  const ticks: number[] = [];
  for (let i = start; i <= end; i++) {
    ticks.push(Number((i * step).toFixed(decimals)));
  }
  return ticks;
}

/** Formats a number to at most 2 decimals. Non-finite values become an em dash. */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return Number(n.toFixed(2)).toString();
}
