/** Formats seconds as `m:ss`. Unknown (NaN/Infinity) durations read `--:--`; negatives clamp to `0:00`. */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "--:--";
  const whole = Math.max(0, Math.floor(seconds));
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
