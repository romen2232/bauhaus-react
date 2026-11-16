import { render } from "@testing-library/react";
import { Pattern, type PatternKind } from "./Pattern";

const kinds: PatternKind[] = ["hatch-vertical", "hatch-horizontal", "checker", "grid-paper", "halftone", "grain"];

it.each(kinds)("%s is decorative and fills its box", (kind) => {
  const { container } = render(<Pattern kind={kind} />);
  const el = container.firstElementChild!;
  expect(el).toHaveAttribute("aria-hidden", "true");
  expect(el).toHaveClass("size-full");
});

it("each kind draws something different", () => {
  const classOf = (kind: PatternKind) => render(<Pattern kind={kind} />).container.firstElementChild!.className;
  expect(new Set(kinds.map(classOf)).size).toBe(kinds.length);
});

it("sets currentColor from the color prop and merges className", () => {
  const { container } = render(<Pattern kind="checker" color="blue" className="x" />);
  expect(container.firstElementChild).toHaveClass("text-bh-blue", "x");
});
