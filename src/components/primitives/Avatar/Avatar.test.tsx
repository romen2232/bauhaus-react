import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

it("exposes the image and hides the rings", () => {
  const { container } = render(<Avatar src="a.jpg" alt="Portrait" rings={2} />);
  expect(screen.getByRole("img", { name: "Portrait" })).toBeInTheDocument();
  expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(2);
});

it("has no rings by default and puts className on the wrapper", () => {
  const { container } = render(<Avatar src="a.jpg" alt="Portrait" className="x" />);
  expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(0);
  expect(container.firstElementChild).toHaveClass("x");
});
