"use client";
import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, HOVER_LIFT, PRESS } from "../../../lib/styles.js";
import { AudioPlayerBase, type AudioPlayerBaseProps } from "../../_base/AudioPlayer/AudioPlayerBase.js";

export type AudioPlayerPlayfulProps = Omit<AudioPlayerBaseProps, "classes">;

const CLASSES = {
  root: "flex items-center gap-4 text-bh-ink",
  play: cn(
    "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-bh-ink text-sm text-bh-paper",
    HOVER_LIFT,
    PRESS,
    FOCUS_RING,
  ),
  scrubber: "flex-1",
  track: "relative h-6 w-full before:absolute before:inset-x-0 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:bg-bh-ink",
  thumb: [
    "top-1/2 size-4 rounded-none border-2 border-bh-ink bg-bh-yellow",
    "data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink",
  ].join(" "),
  time: "font-bh-mono text-xs tabular-nums",
};

/** Audio player with a round ink play button and a yellow square scrubber thumb (BasicMobile). */
export function AudioPlayerPlayful(props: AudioPlayerPlayfulProps) {
  return <AudioPlayerBase {...props} classes={CLASSES} />;
}
