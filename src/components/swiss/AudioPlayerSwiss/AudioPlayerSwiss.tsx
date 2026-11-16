"use client";
import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, SWISS_MOTION } from "../../../lib/styles.js";
import { AudioPlayerBase, type AudioPlayerBaseProps } from "../../_base/AudioPlayer/AudioPlayerBase.js";

export type AudioPlayerSwissProps = Omit<AudioPlayerBaseProps, "classes">;

const CLASSES = {
  root: "flex items-center gap-4 text-bh-ink",
  play: cn(
    "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-bh-ink text-sm text-bh-ink hover:bg-bh-ink hover:text-bh-paper-white",
    SWISS_MOTION,
    FOCUS_RING,
  ),
  scrubber: "flex-1",
  track:
    "relative h-6 w-full before:absolute before:inset-x-0 before:top-3 before:h-px before:bg-bh-ink",
  thumb:
    "top-1.5 size-3 bg-bh-ink data-[focus-visible]:outline-solid data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-bh-ink",
  time: "font-bh-grotesk text-sm tabular-nums",
};

/** Swiss audio player with a round outlined play button, hairline track and square thumb. */
export function AudioPlayerSwiss(props: AudioPlayerSwissProps) {
  return <AudioPlayerBase {...props} classes={CLASSES} />;
}
