import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TagBase } from "./TagBase";

it("renders a span with the root slot and className merged last", () => {
  render(
    <TagBase classes={{ root: "r" }} className="x">
      New
    </TagBase>,
  );
  const tag = screen.getByText("New");
  expect(tag.tagName).toBe("SPAN");
  expect(tag).toHaveClass("r", "x");
});

it("forwards ref", () => {
  const ref = createRef<HTMLSpanElement>();
  render(
    <TagBase classes={{ root: "" }} ref={ref}>
      New
    </TagBase>,
  );
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
});
