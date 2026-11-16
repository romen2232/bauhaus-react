import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { ChipBase } from "./ChipBase";

const classes = { root: "r", icon: "i" };

it("renders the label with a decorative icon before it", () => {
  render(
    <ChipBase classes={classes} icon={<svg data-testid="ic" />}>
      Double Room
    </ChipBase>,
  );
  const wrapper = screen.getByTestId("ic").parentElement!;
  expect(wrapper).toHaveAttribute("aria-hidden", "true");
  expect(wrapper).toHaveClass("i");
  expect(screen.getByText("Double Room")).toBeInTheDocument();
});

it("omits the icon wrapper when there is no icon; merges className; forwards ref", () => {
  const ref = createRef<HTMLSpanElement>();
  const { container } = render(
    <ChipBase classes={classes} className="x" ref={ref}>
      1 Day
    </ChipBase>,
  );
  expect(container.querySelector("[aria-hidden]")).toBeNull();
  expect(container.firstElementChild).toHaveClass("r", "x");
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
});
