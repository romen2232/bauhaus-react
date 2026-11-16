import { render, screen } from "@testing-library/react";
import { Stamp } from "./Stamp";

it("exposes its text as an image label", () => {
  render(<Stamp text="Open source mindset" />);
  expect(screen.getByRole("img", { name: "Open source mindset" })).toBeInTheDocument();
});

it("hides the inner svg from assistive tech", () => {
  render(<Stamp text="Open source mindset" />);
  expect(screen.getByRole("img").querySelector("svg")).toHaveAttribute("aria-hidden", "true");
});

it("gives each stamp a unique text path id", () => {
  const { container } = render(
    <>
      <Stamp text="One" />
      <Stamp text="Two" />
    </>,
  );
  const ids = Array.from(container.querySelectorAll("path")).map((p) => p.id);
  expect(new Set(ids).size).toBe(2);
  const hrefs = Array.from(container.querySelectorAll("textPath")).map((t) => t.getAttribute("href"));
  expect(hrefs).toEqual(ids.map((id) => `#${id}`));
});

it("spin animates the svg only behind motion-safe", () => {
  render(<Stamp text="Spin" spin />);
  const classes = Array.from(screen.getByRole("img").querySelector("svg")!.classList);
  expect(classes).toContain("motion-safe:animate-bh-spin");
  expect(classes.filter((c) => c.startsWith("animate-"))).toEqual([]);
});
