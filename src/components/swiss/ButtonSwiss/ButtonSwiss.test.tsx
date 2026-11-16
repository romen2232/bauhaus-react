import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { ButtonSwiss } from "./ButtonSwiss";

it("renders a button with its name", () => {
  render(<ButtonSwiss>Transfer</ButtonSwiss>);
  expect(screen.getByRole("button", { name: "Transfer" })).toBeInTheDocument();
});

it("color variant is the accent fill with ink text, never accent text", () => {
  render(<ButtonSwiss variant="color">Pay</ButtonSwiss>);
  expect(screen.getByRole("button")).toHaveClass("bg-bh-accent", "text-bh-ink");
  expect(screen.getByRole("button").className).not.toMatch(/text-bh-accent/);
});

it("outline variant has a 1px ink border and no fill", () => {
  render(<ButtonSwiss variant="outline">Later</ButtonSwiss>);
  expect(screen.getByRole("button")).toHaveClass("border", "border-bh-ink", "bg-transparent");
});

it("is square except at size sm", () => {
  render(
    <>
      <ButtonSwiss size="sm">S</ButtonSwiss>
      <ButtonSwiss size="md">M</ButtonSwiss>
    </>,
  );
  expect(screen.getByRole("button", { name: "S" })).toHaveClass("rounded-full");
  expect(screen.getByRole("button", { name: "M" }).className).not.toMatch(/rounded/);
});

it("a disabled button keeps no hover classes", () => {
  render(<ButtonSwiss disabled>Closed</ButtonSwiss>);
  expect(screen.getByRole("button")).toBeDisabled();
  expect(screen.getByRole("button").className).not.toMatch(/hover:/);
  expect(screen.getByRole("button")).toHaveClass("cursor-not-allowed", "opacity-50");
});

it("renders a link with href and forwards className and ref", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <ButtonSwiss href="/transfer" className="mt-4" ref={ref}>
      Transfer
    </ButtonSwiss>,
  );
  const link = screen.getByRole("link", { name: "Transfer" });
  expect(link).toHaveAttribute("href", "/transfer");
  expect(link).toHaveClass("mt-4");
  expect(ref.current).toBe(link);
});

it("forwards ref to the button", () => {
  const ref = createRef<HTMLButtonElement>();
  render(<ButtonSwiss ref={ref}>Transfer</ButtonSwiss>);
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});
