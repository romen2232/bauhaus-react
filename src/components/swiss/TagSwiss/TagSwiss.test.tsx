import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TagSwiss } from "./TagSwiss";

it("renders an outlined uppercase label without a fill", () => {
  render(<TagSwiss>Open</TagSwiss>);
  const tag = screen.getByText("Open");
  expect(tag).toHaveClass("border", "border-bh-ink", "uppercase", "tracking-[0.1em]");
  expect(tag.className).not.toMatch(/(^| )bg-bh-/);
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLSpanElement>();
  render(
    <TagSwiss className="ml-1" ref={ref}>
      Open
    </TagSwiss>,
  );
  expect(screen.getByText("Open")).toHaveClass("ml-1");
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
});
