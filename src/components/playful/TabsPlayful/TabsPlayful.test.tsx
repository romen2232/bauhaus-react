import { render, screen } from "@testing-library/react";
import { TabsPlayful } from "./TabsPlayful";

it("is a named tablist whose tabs are pills", () => {
  render(
    <TabsPlayful
      label="Sections"
      className="x"
      items={[
        { id: "a", title: "One", content: "P1" },
        { id: "b", title: "Two", content: "P2" },
      ]}
    />,
  );
  expect(screen.getByRole("tablist", { name: "Sections" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "One" })).toHaveClass("rounded-full", "data-[selected]:bg-bh-ink");
  expect(screen.getByRole("tablist").parentElement).toHaveClass("x");
});
