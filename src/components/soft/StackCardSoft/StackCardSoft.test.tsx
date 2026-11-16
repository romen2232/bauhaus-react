import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { StackCardSoft } from "./StackCardSoft";

const spineOf = (container: HTMLElement) => container.querySelector('[aria-hidden="true"]');

it("defaults to a red spine", () => {
  const { container } = render(<StackCardSoft>Room A</StackCardSoft>);
  expect(spineOf(container)).toHaveClass("bg-bh-red");
});

it("uses the tone for the spine", () => {
  const { container } = render(<StackCardSoft tone="blue">Room A</StackCardSoft>);
  expect(spineOf(container)).toHaveClass("bg-bh-blue");
});

it("renders the action", () => {
  render(<StackCardSoft action={<button type="button">Add</button>}>Room A</StackCardSoft>);
  expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<StackCardSoft className="mb-2" ref={ref}>Room A</StackCardSoft>);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toHaveClass("mb-2", "rounded-bh-soft");
});
