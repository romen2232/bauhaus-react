import { render, screen } from "@testing-library/react";
import { ProjectCardPlayful } from "./ProjectCardPlayful";

const renderCard = (props: Partial<Parameters<typeof ProjectCardPlayful>[0]> = {}) =>
  render(
    <ProjectCardPlayful
      href="/alpha"
      initial="A"
      title="Alpha"
      description="Lorem ipsum dolor sit amet."
      tag={{ label: "New", color: "yellow" }}
      media={<img src="x.png" alt="" />}
      {...props}
    />,
  );

it("is exactly one link named by its title, not the initial", () => {
  renderCard();
  const links = screen.getAllByRole("link");
  expect(links).toHaveLength(1);
  expect(links[0]).toHaveAccessibleName("Alpha");
  expect(links[0]).toHaveAttribute("href", "/alpha");
});

it("contains a level-3 heading by default", () => {
  renderCard();
  expect(screen.getByRole("heading", { level: 3, name: "Alpha" })).toBeInTheDocument();
});

it("respects headingLevel", () => {
  renderCard({ headingLevel: 2 });
  expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
});

it("hides the initial and the media from assistive tech", () => {
  renderCard();
  expect(screen.getByText("A")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByRole("link").querySelector("img")!.closest('[aria-hidden="true"]')).not.toBeNull();
});

it("uses the contrast-safe fill: blue gets paper text", () => {
  renderCard({ color: "blue" });
  expect(screen.getByRole("link")).toHaveClass("bg-bh-blue", "text-bh-paper", "rounded-none");
});

it("defaults to orange", () => {
  renderCard();
  expect(screen.getByRole("link")).toHaveClass("bg-bh-orange");
});

it("renders the tag label", () => {
  renderCard();
  expect(screen.getByText("New")).toHaveClass("bg-bh-yellow");
});

it("hover lift only animates when the user allows motion", () => {
  renderCard();
  const classes = Array.from(screen.getByRole("link").classList);
  expect(classes.filter((c) => c.startsWith("transition") || c.startsWith("hover:-translate"))).toEqual([]);
});
