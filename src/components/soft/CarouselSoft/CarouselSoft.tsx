"use client";
import { CarouselBase, type CarouselBaseProps } from "../../_base/Carousel/CarouselBase.js";
import { IconButtonSoft } from "../IconButtonSoft/IconButtonSoft.js";

export type CarouselSoftProps = Omit<CarouselBaseProps, "classes" | "renderButton">;

const CLASSES = {
  root: "flex flex-col gap-4",
  viewport: "overflow-hidden rounded-bh-soft",
  track: "",
  slide: "overflow-hidden rounded-bh-soft",
  controls: "flex items-center gap-4",
  pager: "flex flex-1 items-center gap-4 font-bh-display font-light",
};

/** Soft slide carousel: rounded slides, charcoal round arrows, index + progress pager (Mobile). */
export function CarouselSoft(props: CarouselSoftProps) {
  return (
    <CarouselBase
      {...props}
      classes={CLASSES}
      renderButton={({ direction, label, disabled, onClick }) => (
        <IconButtonSoft aria-label={label} disabled={disabled} onClick={onClick}>
          {direction === "prev" ? "←" : "→"}
        </IconButtonSoft>
      )}
    />
  );
}
