"use client";
import { useCallback, useRef, useState, type ReactNode, type Ref } from "react";
import { Slider, SliderThumb, SliderTrack } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import { formatTime } from "../../../lib/time.js";

export type AudioPlayerBaseClasses = {
  root: string;
  play: string;
  scrubber: string;
  track: string;
  thumb: string;
  time: string;
};

export type AudioPlayerBaseProps = {
  src: string;
  /** Track title; names the play/pause button ("Play {title}"). */
  title: string;
  /** Passed into `<audio>`, e.g. `<track kind="captions">`. */
  children?: ReactNode;
  /** The underlying `<audio>` element. */
  ref?: Ref<HTMLAudioElement>;
  className?: string;
  classes: AudioPlayerBaseClasses;
};

const assignRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === "function") ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
};

/** Internal: native `<audio>` with a play/pause button, a React Aria seek slider and elapsed/total time. */
export function AudioPlayerBase({ src, title, children, ref, className, classes }: AudioPlayerBaseProps) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(Number.NaN);

  const setAudio = useCallback(
    (el: HTMLAudioElement | null) => {
      audio.current = el;
      assignRef(ref, el);
    },
    [ref],
  );

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play();
      setPlaying(true);
    }
  };

  const seek = (value: number) => {
    if (audio.current) audio.current.currentTime = value;
    setCurrent(value);
  };

  const max = Number.isFinite(duration) ? duration : 0;

  return (
    <div className={cn(classes.root, className)}>
      <audio
        ref={setAudio}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)}
      >
        {children}
      </audio>
      <button type="button" className={classes.play} onClick={toggle}>
        <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
        <span className="sr-only">{`${playing ? "Pause" : "Play"} ${title}`}</span>
      </button>
      <Slider aria-label="Seek" minValue={0} maxValue={max} step={1} value={Math.min(current, max)} onChange={seek} className={classes.scrubber}>
        <SliderTrack className={classes.track}>
          <SliderThumb className={classes.thumb} />
        </SliderTrack>
      </Slider>
      <span className={classes.time}>{`${formatTime(current)} / ${formatTime(duration)}`}</span>
    </div>
  );
}
