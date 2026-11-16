import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TopBarSoft } from "./TopBarSoft";

it("is a banner with brand, meta and action", () => {
  render(<TopBarSoft brand="Rooms" meta={["Mon 16 Nov"]} action={<button type="button">Menu</button>} />);
  expect(screen.getByRole("banner")).toHaveClass("rounded-b-bh-soft");
  expect(screen.getByText("Rooms")).toBeInTheDocument();
  expect(screen.getByText("Mon 16 Nov")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Menu" })).toBeInTheDocument();
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<TopBarSoft brand="Rooms" className="sticky" ref={ref} />);
  expect(screen.getByRole("banner")).toHaveClass("sticky");
  expect(ref.current).toBe(screen.getByRole("banner"));
});
