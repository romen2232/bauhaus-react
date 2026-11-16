import { render, screen, within } from "@testing-library/react";
import { ProjectCardBase } from "./ProjectCardBase";

const classes = { root: "r", initial: "", title: "", description: "", media: "", arrow: "" };

it("the whole card is one link named by its title", () => {
  render(<ProjectCardBase classes={classes} href="/p" initial="T" title="Lorem" description="Ipsum" />);
  const link = screen.getByRole("link", { name: "Lorem" });
  expect(link).toHaveAttribute("href", "/p");
  expect(within(link).getByText("Ipsum")).toBeInTheDocument();
});

it("headingLevel 2 renders an h2 (default h3)", () => {
  const { rerender } = render(<ProjectCardBase classes={classes} href="/p" initial="T" title="Lorem" />);
  expect(screen.getByRole("heading", { level: 3, name: "Lorem" })).toBeInTheDocument();
  rerender(<ProjectCardBase classes={classes} href="/p" initial="T" title="Lorem" headingLevel={2} />);
  expect(screen.getByRole("heading", { level: 2, name: "Lorem" })).toBeInTheDocument();
});

it("renders tag and media nodes inside the link; media and initial are decorative", () => {
  render(
    <ProjectCardBase
      classes={classes}
      href="/p"
      initial="T"
      title="Lorem"
      tag={<span>New</span>}
      media={<span>Art</span>}
    />,
  );
  const link = screen.getByRole("link");
  expect(within(link).getByText("New")).toBeInTheDocument();
  expect(within(link).getByText("Art").closest("[aria-hidden='true']")).not.toBeNull();
  expect(within(link).getByText("T")).toHaveAttribute("aria-hidden", "true");
});

it("merges className after the root slot", () => {
  render(<ProjectCardBase classes={classes} href="/p" initial="T" title="Lorem" className="x" />);
  expect(screen.getByRole("link")).toHaveClass("r", "x");
});
