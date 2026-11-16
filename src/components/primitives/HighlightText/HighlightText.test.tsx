import { render, screen } from "@testing-library/react";
import { HighlightText } from "./HighlightText";

it("renders muted body text", () => {
  render(<HighlightText>plain text</HighlightText>);
  expect(screen.getByText("plain text")).toHaveClass("text-bh-muted-text", "font-bh-body");
});

it("Mark renders semantic emphasis in ink", () => {
  render(
    <HighlightText>
      Lorem ipsum dolor sit amet, <HighlightText.Mark>consectetur adipiscing</HighlightText.Mark>
    </HighlightText>,
  );
  const mark = screen.getByText("consectetur adipiscing");
  expect(mark.tagName).toBe("STRONG");
  expect(mark).toHaveClass("text-bh-ink");
});
