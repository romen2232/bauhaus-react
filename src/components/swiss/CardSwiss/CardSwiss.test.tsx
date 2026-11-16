import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { CardSwiss } from "./CardSwiss";

it("is a hairline article without href", () => {
  render(<CardSwiss header="Account summary">Available balance</CardSwiss>);
  expect(screen.getByRole("article")).toHaveClass("border-bh-rule", "bg-transparent");
});

it("becomes one colour-changing link with href", () => {
  render(
    <CardSwiss href="/account" header="Account summary">
      Available balance
    </CardSwiss>,
  );
  const link = screen.getByRole("link");
  expect(link).toHaveTextContent("Account summaryAvailable balance");
  expect(link).toHaveClass("hover:border-bh-ink");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(
    <CardSwiss className="mt-4" ref={ref}>
      Body
    </CardSwiss>,
  );
  expect(screen.getByRole("article")).toHaveClass("mt-4");
  expect(ref.current).toBe(screen.getByRole("article"));
});
