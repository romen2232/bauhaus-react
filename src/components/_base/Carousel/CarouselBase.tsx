"use client";
import { Children, useState, type ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { IndexCounter } from "../../primitives/IndexCounter/IndexCounter.js";
import { ProgressRule } from "../../primitives/ProgressRule/ProgressRule.js";

export type CarouselButtonProps = {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
};

export type CarouselBaseClasses = {
  root: string;
  viewport: string;
  track: string;
  slide: string;
  controls: string;
  pager: string;
};

export type CarouselBaseProps = {
  /** Accessible name of the carousel region. */
  label: string;
  /** One child per slide. */
  children: ReactNode;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Renders the previous/next control with the look's icon button. */
  renderButton: (props: CarouselButtonProps) => ReactNode;
  className?: string;
  classes: CarouselBaseClasses;
};

/**
 * Internal: WAI-ARIA APG carousel. Previous/next buttons (no wrap, no autoplay), a polite live
 * region announcing "Slide n of m", hidden + inert off-screen slides, and an index + progress pager.
 */
export function CarouselBase({
  label,
  children,
  index,
  defaultIndex = 0,
  onIndexChange,
  renderButton,
  className,
  classes,
}: CarouselBaseProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [inner, setInner] = useState(defaultIndex);
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(count - 1, 0));

  const go = (next: number) => {
    if (index === undefined) setInner(next);
    onIndexChange?.(next);
  };

  return (
    <section aria-roledescription="carousel" aria-label={label} className={cn(classes.root, className)}>
      <div className={classes.viewport}>
        <div
          className={cn("flex motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out", classes.track)}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i === current ? undefined : true}
              inert={i !== current}
              className={cn("w-full shrink-0", classes.slide)}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className={classes.controls}>
        {renderButton({ direction: "prev", label: "Previous slide", disabled: current <= 0, onClick: () => go(current - 1) })}
        <div className={classes.pager}>
          <IndexCounter current={count === 0 ? 0 : current + 1} total={count} />
          <ProgressRule value={count === 0 ? 0 : (current + 1) / count} color="ink" className="flex-1" />
        </div>
        {renderButton({
          direction: "next",
          label: "Next slide",
          disabled: current >= count - 1,
          onClick: () => go(current + 1),
        })}
      </div>
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {`Slide ${count === 0 ? 0 : current + 1} of ${count}`}
      </p>
    </section>
  );
}
