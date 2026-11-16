import { render, screen } from "@testing-library/react";
import { HighlightText } from "./HighlightText";

it("renders muted body text", () => {
  render(<HighlightText>plain text</HighlightText>);
  expect(screen.getByText("plain text")).toHaveClass("text-bh-muted-text", "font-bh-body");
});

it("Mark renders semantic emphasis in ink", () => {
  render(
    <HighlightText>
      Gropius championed <HighlightText.Mark>the school's mission</HighlightText.Mark>
    </HighlightText>,
  );
  const mark = screen.getByText("the school's mission");
  expect(mark.tagName).toBe("STRONG");
  expect(mark).toHaveClass("text-bh-ink");
});
