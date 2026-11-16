import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TextLinkSwiss } from "./TextLinkSwiss";

it("is named by its text and has no arrow by default", () => {
  const { container } = render(<TextLinkSwiss href="/times">See times</TextLinkSwiss>);
  expect(screen.getByRole("link", { name: "See times" })).toBeInTheDocument();
  expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
});

it("shows an optional arrow outside the accessible name", () => {
  const { container } = render(
    <TextLinkSwiss href="/times" arrow="up-right">
      See times
    </TextLinkSwiss>,
  );
  expect(screen.getByRole("link", { name: "See times" })).toBeInTheDocument();
  expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("↗");
});

it("underlines only on hover", () => {
  render(<TextLinkSwiss href="/times">See times</TextLinkSwiss>);
  const link = screen.getByRole("link");
  expect(link).toHaveClass("hover:underline", "decoration-1", "underline-offset-4");
  expect(link.className).not.toMatch(/(^| )underline( |$)/);
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <TextLinkSwiss href="/times" className="mt-2" ref={ref}>
      See times
    </TextLinkSwiss>,
  );
  expect(screen.getByRole("link")).toHaveClass("mt-2");
  expect(ref.current).toBe(screen.getByRole("link"));
});
