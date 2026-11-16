import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { CardSoft } from "./CardSoft";

it("is a rounded charcoal article without href", () => {
  render(<CardSoft header={<h3>Today</h3>}>Two rooms free</CardSoft>);
  expect(screen.getByRole("article")).toHaveClass("rounded-bh-soft", "bg-bh-charcoal", "text-bh-paper");
});

it("becomes one link with href", () => {
  render(<CardSoft href="/today" header={<h3>Today</h3>}>Two rooms free</CardSoft>);
  expect(screen.getByRole("link")).toHaveTextContent("TodayTwo rooms free");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<CardSoft className="mt-4" ref={ref}>Body</CardSoft>);
  expect(screen.getByRole("article")).toHaveClass("mt-4");
  expect(ref.current).toBe(screen.getByRole("article"));
});
