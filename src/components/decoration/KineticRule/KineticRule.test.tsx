import { render } from "@testing-library/react";
import { KineticRule } from "./KineticRule";

it("is decorative and only animates behind motion-safe", () => {
  const { container } = render(<KineticRule />);
  expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  const classes = Array.from(container.querySelectorAll("*")).flatMap((el) => Array.from(el.classList));
  const animated = classes.filter((c) => c.includes("animate-"));
  expect(animated.sort()).toEqual(["motion-safe:animate-bh-grow", "motion-safe:animate-bh-slide"]);
});

it("colours the rule and dot", () => {
  const { container } = render(<KineticRule color="red" />);
  expect(container.querySelectorAll(".bg-bh-red")).toHaveLength(2);
});
