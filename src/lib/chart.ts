import type { ChartDatum } from "./chartTypes";

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

const fmt = (n: number): number => +n.toFixed(2);

/** Evenly spaced bands across `extent`; `padding` is the empty fraction of each step. */
export function bandLayout(
  count: number,
  extent: number,
  padding = 0.2,
): { x: number; width: number }[] {
  if (count <= 0) return [];
  const step = extent / count;
  const width = step * (1 - padding);
  return Array.from({ length: count }, (_, i) => ({
    x: i * step + (step - width) / 2,
    width,
  }));
}

/** Rough text width used to thin crowded labels. */
export function estimateTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.6;
}

/** Draw every n-th category label so labels never overlap. */
export function labelStride(step: number, labelWidth: number): number {
  return step <= 0 ? 1 : Math.max(1, Math.ceil(labelWidth / step));
}

export function linePath(points: { x: number; y: number }[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"}${fmt(p.x)},${fmt(p.y)}`)
    .join("");
}

/** 0deg at 12 o'clock, clockwise. */
export function polarPoint(
  cx: number,
  cy: number,
  r: number,
  deg: number,
): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

export function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number,
): string {
  const sweep = endDeg - startDeg;
  if (sweep <= 0) return "";
  if (sweep >= 360) {
    const mid = startDeg + 180;
    return (
      arcPath(cx, cy, rOuter, rInner, startDeg, mid) +
      arcPath(cx, cy, rOuter, rInner, mid, startDeg + 360)
    );
  }
  const large = sweep > 180 ? 1 : 0;
  const outerStart = polarPoint(cx, cy, rOuter, startDeg);
  const outerEnd = polarPoint(cx, cy, rOuter, endDeg);
  const innerEnd = polarPoint(cx, cy, rInner, endDeg);
  const innerStart = polarPoint(cx, cy, rInner, startDeg);
  return (
    `M${fmt(outerStart.x)},${fmt(outerStart.y)}` +
    `A${fmt(rOuter)},${fmt(rOuter)},0,${large},1,${fmt(outerEnd.x)},${fmt(outerEnd.y)}` +
    `L${fmt(innerEnd.x)},${fmt(innerEnd.y)}` +
    `A${fmt(rInner)},${fmt(rInner)},0,${large},0,${fmt(innerStart.x)},${fmt(innerStart.y)}Z`
  );
}

/** Splits 360deg proportionally. Negative and non-finite values count as 0. */
export function pieAngles(values: number[]): { start: number; end: number }[] {
  const clean = values.map((v) => (Number.isFinite(v) && v > 0 ? v : 0));
  const total = clean.reduce((s, v) => s + v, 0);
  if (total === 0) return clean.map(() => ({ start: 0, end: 0 }));

  const lastNonEmpty = clean.reduce((last, v, i) => (v > 0 ? i : last), -1);
  let acc = 0;
  return clean.map((v, i) => {
    const start = i > lastNonEmpty ? 360 : (acc * 360) / total;
    acc += v;
    const end = i >= lastNonEmpty ? 360 : (acc * 360) / total;
    return { start, end };
  });
}

/** Keeps the top `max - 1` slices by value (original order) and sums the rest into one. */
export function groupSlices(
  data: ChartDatum[],
  max: number,
  otherLabel = "Other",
): ChartDatum[] {
  const limit = Math.max(2, max);
  if (data.length <= limit) return data;

  const keep = new Set(
    data
      .map((d, i) => ({ i, value: d.value }))
      .sort((a, b) => b.value - a.value || a.i - b.i)
      .slice(0, limit - 1)
      .map((x) => x.i),
  );
  const rest = data
    .filter((_, i) => !keep.has(i))
    .reduce((s, d) => s + d.value, 0);
  return [
    ...data.filter((_, i) => keep.has(i)),
    { label: otherLabel, value: rest },
  ];
}
