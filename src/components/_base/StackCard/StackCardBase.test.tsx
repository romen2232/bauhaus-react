import { render, screen } from "@testing-library/react";
import { StackCardBase } from "./StackCardBase";

const classes = { root: "r", spine: "s", body: "b", action: "a" };

it("renders body, a decorative spine and the action", () => {
  const { container } = render(
    <StackCardBase classes={classes} action={<button type="button">Add</button>}>
      Room
    </StackCardBase>,
  );
  expect(container.querySelector(".s")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByText("Room")).toHaveClass("b");
  expect(screen.getByRole("button", { name: "Add" }).parentElement).toHaveClass("a");
});

it("omits the action cell without an action and merges className", () => {
  const { container } = render(
    <StackCardBase classes={classes} className="x">
      Room
    </StackCardBase>,
  );
  expect(container.querySelector(".a")).toBeNull();
  expect(container.firstElementChild).toHaveClass("r", "x");
});
