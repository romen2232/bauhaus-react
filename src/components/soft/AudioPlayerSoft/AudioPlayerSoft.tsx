"use client";
import { cn } from "../../../lib/cn.js";
import { SOFT_HOVER_CLASSES } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { AudioPlayerBase, type AudioPlayerBaseProps } from "../../_base/AudioPlayer/AudioPlayerBase.js";

export type AudioPlayerSoftProps = Omit<AudioPlayerBaseProps, "classes" | "renderTime">;

const CLASSES = {
  root: "grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-6 rounded-bh-soft bg-bh-charcoal p-6 text-bh-paper",
  play: cn(
    "inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-bh-paper text-base text-bh-ink motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out",
    SOFT_HOVER_CLASSES.paper,
    FOCUS_RING,
    "focus-visible:outline-bh-paper",
  ),
  scrubber: "w-full",
  // The thumb (16px) sits at top-1 in the 24px track, so both centre on the 4px bar at top-2.5.
  track: "relative h-6 w-full before:absolute before:inset-x-0 before:top-2.5 before:h-1 before:rounded-full before:bg-bh-muted",
  thumb: [
    "top-1 size-4 rounded-full bg-bh-paper",
    "data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-paper",
  ].join(" "),
  time: "col-span-2 flex items-baseline gap-3 font-bh-display",
};

/** Soft audio player: charcoal panel, round paper play button, and the elapsed time as a big numeral (BasicMobile). */
export function AudioPlayerSoft(props: AudioPlayerSoftProps) {
  return (
    <AudioPlayerBase
      {...props}
      classes={CLASSES}
      renderTime={({ elapsed, total }) => (
        <>
          <span className="text-6xl font-light leading-none tabular-nums">{elapsed}</span>
          <span className="text-sm tabular-nums text-bh-muted">/ {total}</span>
        </>
      )}
    />
  );
}
