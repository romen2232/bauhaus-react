import type { ComponentType, ReactNode, Ref } from "react";
import {
  AudioPlayerPlayful,
  AudioPlayerSoft,
  AudioPlayerSwiss,
  ButtonPlayful,
  ButtonSoft,
  ButtonSwiss,
  CardPlayful,
  CardSoft,
  CardSwiss,
  SparklinePlayful,
  SparklineSoft,
  SparklineSwiss,
  ToastRegionPlayful,
  ToastRegionSoft,
  ToastRegionSwiss,
  type ToastQueueHandle,
} from "bauhaus-react";
import type { Look, SingleLook } from "../../look/LookContext";

export type HeroKit = {
  Card: ComponentType<{ header?: ReactNode; children?: ReactNode; className?: string }>;
  Sparkline: ComponentType<{ title: string; data: { label: string; value: number }[]; hideTitle?: boolean; className?: string }>;
  AudioPlayer: ComponentType<{ src: string; title: string }>;
  ToastRegion: ComponentType<{
    queue?: ToastQueueHandle;
    placement?: "bottom-end" | "bottom" | "top-end" | "top";
    className?: string;
    ref?: Ref<HTMLDivElement>;
  }>;
  Button: ComponentType<{ children: ReactNode; onClick?: () => void; "aria-label"?: string }>;
};

/** Mix shows the Playful kit: sharp corners, so the hero row never mixes corner styles. */
export function heroLook(look: Look): SingleLook {
  return look === "mix" ? "playful" : look;
}

export const HERO_KIT: Record<SingleLook, HeroKit> = {
  playful: {
    Card: CardPlayful,
    Sparkline: SparklinePlayful,
    AudioPlayer: AudioPlayerPlayful,
    ToastRegion: ToastRegionPlayful,
    Button: ButtonPlayful as HeroKit["Button"],
  },
  swiss: {
    Card: CardSwiss,
    Sparkline: SparklineSwiss,
    AudioPlayer: AudioPlayerSwiss,
    ToastRegion: ToastRegionSwiss,
    Button: ButtonSwiss as HeroKit["Button"],
  },
  soft: {
    Card: CardSoft,
    Sparkline: SparklineSoft,
    AudioPlayer: AudioPlayerSoft,
    ToastRegion: ToastRegionSoft,
    Button: ButtonSoft as HeroKit["Button"],
  },
};
