import { render, screen } from "@testing-library/react";
import { SectionLabel } from "./SectionLabel";

it("wraps the marker in parentheses before the label", () => {
  render(<SectionLabel marker="P">Projects</SectionLabel>);
  const marker = screen.getByText("(P)");
  const label = screen.getByText("Projects");
  expect(marker.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

it("merges className onto the root", () => {
  const { container } = render(<SectionLabel marker="B" className="x" />);
  expect(container.firstElementChild).toHaveClass("x");
});
