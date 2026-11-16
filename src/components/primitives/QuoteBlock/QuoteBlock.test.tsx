import { render, screen } from "@testing-library/react";
import { QuoteBlock } from "./QuoteBlock";

it("is a blockquote with a decorative mark and a citation", () => {
  const { container } = render(<QuoteBlock cite="Lorem Ipsum">Dolor sit amet</QuoteBlock>);
  expect(container.querySelector("blockquote")).toHaveTextContent("Dolor sit amet");
  expect(screen.getByText("Lorem Ipsum").tagName).toBe("CITE");
  expect(screen.getByText("“")).toHaveAttribute("aria-hidden", "true");
});

it("omits the footer without a citation", () => {
  const { container } = render(<QuoteBlock>Dolor</QuoteBlock>);
  expect(container.querySelector("cite")).toBeNull();
});
