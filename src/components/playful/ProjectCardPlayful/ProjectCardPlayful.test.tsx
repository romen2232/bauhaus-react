import { render, screen } from "@testing-library/react";
import { ProjectCardPlayful } from "./ProjectCardPlayful";

const renderCard = (props: Partial<Parameters<typeof ProjectCardPlayful>[0]> = {}) =>
  render(
    <ProjectCardPlayful
      href="/tools"
      initial="T"
      title="Tools"
      description="Scripts, plugins, generators."
      tag={{ label: "New", color: "yellow" }}
      media={<img src="x.png" alt="" />}
      {...props}
    />,
  );

it("is exactly one link named by its title, not the initial", () => {
  renderCard();
  const links = screen.getAllByRole("link");
  expect(links).toHaveLength(1);
  expect(links[0]).toHaveAccessibleName("Tools");
  expect(links[0]).toHaveAttribute("href", "/tools");
});

it("contains a level-3 heading by default", () => {
  renderCard();
  expect(screen.getByRole("heading", { level: 3, name: "Tools" })).toBeInTheDocument();
});

it("respects headingLevel", () => {
  renderCard({ headingLevel: 2 });
  expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
});

it("hides the initial and the media from assistive tech", () => {
  renderCard();
  expect(screen.getByText("T")).toHaveAttribute("aria-hidden", "true");
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
