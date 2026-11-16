import { render } from "@testing-library/react";
import { HEX } from "../../../lib/palette";
import { Shape, type ShapeKind } from "./Shape";

const kinds: ShapeKind[] = ["circle", "quarter", "half", "triangle", "square", "bar"];

it.each(kinds)("outline %s renders an svg stroke in the fill colour, with no background", (kind) => {
  const { container } = render(<Shape kind={kind} fill="outline" color="red" />);
  const root = container.firstElementChild!;
  expect(root).toHaveAttribute("aria-hidden", "true");
  expect(root).not.toHaveClass("bg-bh-red");
  const stroked = container.querySelector("svg [stroke]");
  expect(stroked).toHaveAttribute("stroke", HEX.red);
});

it("pattern fill renders the pattern clipped to the shape", () => {
  const { container } = render(<Shape kind="circle" fill="pattern" pattern="checker" color="blue" />);
  const root = container.firstElementChild!;
  expect(root).toHaveClass("rounded-full", "overflow-hidden");
  expect(root).not.toHaveClass("bg-bh-blue");
  expect(root.firstElementChild).toHaveClass("text-bh-blue");
});

it("solid stays the default", () => {
  const { container } = render(<Shape kind="square" color="yellow" />);
  expect(container.firstElementChild).toHaveClass("bg-bh-yellow");
  expect(container.querySelector("svg")).toBeNull();
});
