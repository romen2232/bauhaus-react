import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { StackCardSwiss } from "./StackCardSwiss";

it("has a decorative 2px accent spine", () => {
  const { container } = render(<StackCardSwiss>Account A</StackCardSwiss>);
  expect(container.querySelector('[aria-hidden="true"]')).toHaveClass("bg-bh-accent", "w-0.5");
});

it("renders the action", () => {
  render(<StackCardSwiss action={<button type="button">Add</button>}>Account A</StackCardSwiss>);
  expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <StackCardSwiss className="mb-2" ref={ref}>
      Account A
    </StackCardSwiss>,
  );
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toHaveClass("mb-2", "border-bh-rule");
});
