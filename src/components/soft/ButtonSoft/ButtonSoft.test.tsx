import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { ButtonSoft } from "./ButtonSoft";

it("renders a button with its name", () => {
  render(<ButtonSoft>Book</ButtonSoft>);
  expect(screen.getByRole("button", { name: "Book" })).toBeInTheDocument();
});

it("color variant uses the tone pair", () => {
  render(<ButtonSoft variant="color" tone="red">Cancel</ButtonSoft>);
  expect(screen.getByRole("button")).toHaveClass("bg-bh-red", "text-bh-ink", "rounded-full");
});

it("color variant defaults to the blue tone", () => {
  render(<ButtonSoft variant="color">Confirm</ButtonSoft>);
  expect(screen.getByRole("button")).toHaveClass("bg-bh-blue", "text-bh-paper");
});

it("outline variant is a sand fill without a border", () => {
  render(<ButtonSoft variant="outline">Later</ButtonSoft>);
  expect(screen.getByRole("button")).toHaveClass("bg-bh-sand");
  expect(screen.getByRole("button").className).not.toMatch(/border/);
});

it("renders a link with href and forwards className and ref", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(<ButtonSoft href="/book" className="mt-4" ref={ref}>Book</ButtonSoft>);
  const link = screen.getByRole("link", { name: "Book" });
  expect(link).toHaveClass("mt-4");
  expect(ref.current).toBe(link);
});

it("forwards ref to the button", () => {
  const ref = createRef<HTMLButtonElement>();
  render(<ButtonSoft ref={ref}>Book</ButtonSoft>);
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});
