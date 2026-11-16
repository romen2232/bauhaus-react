"use client";
import { CarouselBase, type CarouselBaseProps } from "../../_base/Carousel/CarouselBase.js";
import { IconButtonSwiss } from "../IconButtonSwiss/IconButtonSwiss.js";

export type CarouselSwissProps = Omit<CarouselBaseProps, "classes" | "renderButton">;

const CLASSES = {
  root: "flex flex-col gap-4",
  viewport: "overflow-hidden",
  track: "",
  slide: "",
  controls: "flex items-center gap-4",
  pager: "flex flex-1 items-center gap-4 [&>span]:font-bh-grotesk [&>div]:h-px",
};

/** Swiss carousel with outlined round arrows and a grotesk index plus hairline progress rule. */
export function CarouselSwiss(props: CarouselSwissProps) {
  return (
    <CarouselBase
      {...props}
      classes={CLASSES}
      renderButton={({ direction, label, disabled, onClick }) => (
        <IconButtonSwiss
          aria-label={label}
          variant="outline"
          size="md"
          disabled={disabled}
          onClick={onClick}
        >
          {direction === "prev" ? "←" : "→"}
        </IconButtonSwiss>
      )}
    />
  );
}
