import { render, screen } from "@testing-library/react";
import { BigNumber } from "./BigNumber";

const follows = (a: Element, b: Element) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

it("orders label, value, caption", () => {
  render(<BigNumber label="Days" value="23" caption="left" />);
  const [a, b, c] = ["Days", "23", "left"].map((t) => screen.getByText(t)) as [HTMLElement, HTMLElement, HTMLElement];
  expect(follows(a, b)).toBe(true);
  expect(follows(b, c)).toBe(true);
});

it("renders only the value when nothing else is given", () => {
  const { container } = render(<BigNumber value="07" className="x" />);
  expect(container.firstElementChild).toHaveTextContent(/^07$/);
  expect(container.firstElementChild).toHaveClass("x");
});
