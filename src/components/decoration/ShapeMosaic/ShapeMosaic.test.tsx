import { render } from "@testing-library/react";
import { ShapeMosaic, type MosaicTile } from "./ShapeMosaic";

const tiles: MosaicTile[] = [
  { kind: "quarter", color: "navy" },
  { kind: "half", color: "sky", rotate: 90, background: "orange" },
  { kind: "circle", color: "pink" },
  { kind: "square", color: "paper" },
  { kind: "triangle", color: "yellow" },
  { kind: "bar", color: "ink" },
  { kind: "quarter", color: "orange", rotate: 180 },
  { kind: "half", color: "navy", rotate: 270 },
];

it("renders one square cell per tile with no gap", () => {
  const { container } = render(<ShapeMosaic cols={4} tiles={tiles} />);
  const root = container.firstElementChild!;
  expect(root).toHaveClass("grid", "grid-cols-4", "gap-0");
  expect(root.children).toHaveLength(8);
  expect(root.children[0]).toHaveClass("aspect-square", "bg-bh-paper");
  expect(root.children[1]).toHaveClass("bg-bh-orange");
});

it("is decorative as a whole", () => {
  const { container } = render(<ShapeMosaic cols={4} tiles={tiles} />);
  expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
});
