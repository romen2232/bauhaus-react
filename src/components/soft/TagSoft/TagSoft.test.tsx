import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TagSoft } from "./TagSoft";

it("defaults to a neutral pill", () => {
  render(<TagSoft>Open</TagSoft>);
  expect(screen.getByText("Open")).toHaveClass("bg-bh-charcoal", "text-bh-paper", "rounded-full");
});

it("uses the tone pair", () => {
  render(<TagSoft tone="yellow">Pending</TagSoft>);
  expect(screen.getByText("Pending")).toHaveClass("bg-bh-yellow", "text-bh-ink");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLSpanElement>();
  render(<TagSoft className="ml-1" ref={ref}>Open</TagSoft>);
  expect(screen.getByText("Open")).toHaveClass("ml-1");
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
});
