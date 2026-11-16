import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TextLinkSoft } from "./TextLinkSoft";

it("is a link named by its text, with a right arrow by default", () => {
  const { container } = render(<TextLinkSoft href="/x">See times</TextLinkSoft>);
  expect(screen.getByRole("link", { name: "See times" })).toBeInTheDocument();
  expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("→");
});

it("shows the chosen arrow", () => {
  const { container } = render(<TextLinkSoft href="/x" arrow="down">More</TextLinkSoft>);
  expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("↓");
});

it("has no underline", () => {
  render(<TextLinkSoft href="/x">See times</TextLinkSoft>);
  expect(screen.getByRole("link")).toHaveClass("no-underline");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(<TextLinkSoft href="/x" className="mt-2" ref={ref}>See times</TextLinkSoft>);
  expect(screen.getByRole("link")).toHaveClass("mt-2");
  expect(ref.current).toBe(screen.getByRole("link"));
});
