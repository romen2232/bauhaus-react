import { render, screen } from "@testing-library/react";
import { MediaBlock } from "./MediaBlock";

it("renders a grayscale image with its alt text", () => {
  render(<MediaBlock src="b.jpg" alt="Building" />);
  expect(screen.getByRole("img", { name: "Building" })).toHaveClass("grayscale");
});

it("merges className onto the root", () => {
  const { container } = render(<MediaBlock src="b.jpg" alt="Building" className="x" />);
  expect(container.firstElementChild).toHaveClass("x");
});
