import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { IconButtonSoft } from "./IconButtonSoft";

it("is named by aria-label", () => {
  render(<IconButtonSoft aria-label="Add booking">+</IconButtonSoft>);
  expect(screen.getByRole("button", { name: "Add booking" })).toHaveClass("rounded-full");
});

it("outline variant is a sand fill without a border", () => {
  render(<IconButtonSoft aria-label="Next" variant="outline">→</IconButtonSoft>);
  expect(screen.getByRole("button")).toHaveClass("bg-bh-sand");
  expect(screen.getByRole("button").className).not.toMatch(/border/);
});

it("lg renders the FAB size", () => {
  render(<IconButtonSoft aria-label="Add" size="lg">+</IconButtonSoft>);
  expect(screen.getByRole("button")).toHaveClass("size-14");
});

it("renders a link with href", () => {
  render(<IconButtonSoft aria-label="Home" href="/">⌂</IconButtonSoft>);
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLButtonElement>();
  render(<IconButtonSoft aria-label="Add" className="ml-2" ref={ref}>+</IconButtonSoft>);
  expect(screen.getByRole("button")).toHaveClass("ml-2");
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});
