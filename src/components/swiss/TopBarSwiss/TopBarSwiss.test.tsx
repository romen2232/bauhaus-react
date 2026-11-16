import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TopBarSwiss } from "./TopBarSwiss";

it("is a ruled paper-white banner with brand, meta and action", () => {
  render(<TopBarSwiss brand="Konto" meta={["CHF 12,480"]} action={<button type="button">Menu</button>} />);
  expect(screen.getByRole("banner")).toHaveClass(
    "divide-x",
    "divide-bh-rule",
    "bg-bh-paper-white",
  );
  expect(screen.getByText("Konto")).toBeInTheDocument();
  expect(screen.getByText("CHF 12,480")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<TopBarSwiss brand="Konto" className="sticky" ref={ref} />);
  expect(screen.getByRole("banner")).toHaveClass("sticky");
  expect(ref.current).toBe(screen.getByRole("banner"));
});
