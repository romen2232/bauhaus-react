"use client";
import { CarouselBase, type CarouselBaseProps } from "../../_base/Carousel/CarouselBase.js";
import { IconButtonPlayful } from "../IconButtonPlayful/IconButtonPlayful.js";

export type CarouselPlayfulProps = Omit<CarouselBaseProps, "classes" | "renderButton">;

const CLASSES = {
  root: "flex flex-col gap-4",
  viewport: "overflow-hidden",
  track: "",
  slide: "",
  controls: "flex items-center gap-4",
  pager: "flex flex-1 items-center gap-4",
};

/** Slide carousel with round outline arrows and an index + progress pager (aboutUs, Mijonju). */
export function CarouselPlayful(props: CarouselPlayfulProps) {
  return (
    <CarouselBase
      {...props}
      classes={CLASSES}
      renderButton={({ direction, label, disabled, onClick }) => (
        <IconButtonPlayful aria-label={label} variant="outline" disabled={disabled} onClick={onClick}>
          {direction === "prev" ? "←" : "→"}
        </IconButtonPlayful>
      )}
    />
  );
}
