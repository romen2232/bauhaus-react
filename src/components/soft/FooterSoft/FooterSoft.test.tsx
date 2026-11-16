import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { FooterSoft } from "./FooterSoft";

it("is a contentinfo with one element per column and the bottom row", () => {
  render(<FooterSoft columns={["About", "Help", "Legal"]} bottom="© 2026" />);
  const footer = screen.getByRole("contentinfo");
  expect(footer).toHaveClass("rounded-t-bh-soft", "bg-bh-charcoal");
  for (const c of ["About", "Help", "Legal", "© 2026"]) expect(screen.getByText(c)).toBeInTheDocument();
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<FooterSoft columns={["About"]} className="mt-8" ref={ref} />);
  expect(screen.getByRole("contentinfo")).toHaveClass("mt-8");
  expect(ref.current).toBe(screen.getByRole("contentinfo"));
});

it("turns focus rings of nested links paper, since ink is invisible on charcoal", () => {
  render(<FooterSoft columns={["About"]} />);
  expect(screen.getByRole("contentinfo")).toHaveClass("[&_:focus-visible]:outline-bh-paper");
});
