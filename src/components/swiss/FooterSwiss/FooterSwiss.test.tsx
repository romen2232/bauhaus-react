import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { FooterSwiss } from "./FooterSwiss";

it("is a hairline grid with one element per column and a bottom row", () => {
  render(<FooterSwiss columns={["Accounts", "Support", "Legal"]} bottom="© 2026" />);
  const footer = screen.getByRole("contentinfo");
  const grid = footer.firstElementChild;
  expect(grid?.childElementCount).toBe(3);
  expect(grid).toHaveClass("bg-bh-rule", "[&>*]:bg-bh-paper-white");
  for (const text of ["Accounts", "Support", "Legal", "© 2026"]) {
    expect(screen.getByText(text)).toBeInTheDocument();
  }
});

it("clamps seven columns to six at the md breakpoint", () => {
  render(<FooterSwiss columns={["1", "2", "3", "4", "5", "6", "7"]} />);
  expect(screen.getByRole("contentinfo").firstElementChild).toHaveClass("md:grid-cols-6");
});

it("renders zero columns with a single-column grid", () => {
  expect(() => render(<FooterSwiss columns={[]} />)).not.toThrow();
  const grid = screen.getByRole("contentinfo").firstElementChild;
  expect(grid?.childElementCount).toBe(0);
  expect(grid).toHaveClass("md:grid-cols-1");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<FooterSwiss columns={["Accounts"]} className="mt-8" ref={ref} />);
  expect(screen.getByRole("contentinfo")).toHaveClass("mt-8");
  expect(ref.current).toBe(screen.getByRole("contentinfo"));
});
