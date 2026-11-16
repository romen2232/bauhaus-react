import { render } from "@testing-library/react";
import { Shape } from "./Shape";

const classesOf = (el: Element) => Array.from(el.classList);

it("renders a rotated quarter circle in the given color, hidden from assistive tech", () => {
  const { container } = render(<Shape kind="quarter" rotate={90} color="sky" />);
  const el = container.firstElementChild!;
  expect(el).toHaveClass("rounded-tl-full", "rotate-90", "bg-bh-sky");
  expect(el).toHaveAttribute("aria-hidden", "true");
});

it("defaults to red with no rotation", () => {
  const { container } = render(<Shape kind="circle" />);
  expect(container.firstElementChild).toHaveClass("rounded-full", "bg-bh-red", "rotate-0");
});

it("maps 270 to -rotate-90", () => {
  const { container } = render(<Shape kind="half" rotate={270} />);
  expect(container.firstElementChild).toHaveClass("-rotate-90");
});

it("triangle uses a clip-path polygon", () => {
  const { container } = render(<Shape kind="triangle" />);
  expect(container.firstElementChild!.className).toContain("[clip-path:polygon(50%_0,100%_100%,0_100%)]");
});

it("spin animates only behind motion-safe", () => {
  const { container } = render(<Shape kind="half" spin />);
  const classes = classesOf(container.firstElementChild!);
  expect(classes).toContain("motion-safe:animate-bh-spin");
  expect(classes.filter((c) => c.startsWith("animate-"))).toEqual([]);
});

it("does not animate without spin", () => {
  const { container } = render(<Shape kind="half" />);
  expect(container.firstElementChild!.className).not.toContain("animate");
});
