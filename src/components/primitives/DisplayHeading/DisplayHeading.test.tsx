import { render, screen } from "@testing-library/react";
import { DisplayHeading } from "./DisplayHeading";

it("renders an h2 by default with display type", () => {
  render(<DisplayHeading>Bauhaus</DisplayHeading>);
  const h = screen.getByRole("heading", { level: 2, name: "Bauhaus" });
  expect(h).toHaveClass("font-bh-display", "uppercase");
});

it("renders the level given in `as`", () => {
  render(<DisplayHeading as="h1">Bauhaus</DisplayHeading>);
  expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
});

it("maps size to a literal text class", () => {
  render(<DisplayHeading size="4xl">Big</DisplayHeading>);
  expect(screen.getByRole("heading")).toHaveClass("text-7xl", "md:text-9xl");
});

it("echo is read once by screen readers", () => {
  render(<DisplayHeading as="h1" echo>School</DisplayHeading>);
  const headings = screen.getAllByRole("heading", { level: 1 });
  expect(headings).toHaveLength(1);
  expect(headings[0]).toHaveAccessibleName("School");
});

it("echo copy is hidden from assistive tech", () => {
  const { container } = render(<DisplayHeading echo>School</DisplayHeading>);
  const echo = container.querySelector('[aria-hidden="true"]');
  expect(echo).toHaveTextContent("School");
  expect(echo).toHaveClass("text-bh-sky");
});
