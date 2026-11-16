import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TabsBase } from "./TabsBase";

const t = { root: "r", list: "", tab: "", panel: "" };
const items = [
  { id: "a", title: "One", content: "P1" },
  { id: "b", title: "Two", content: "P2", disabled: true },
  { id: "c", title: "Three", content: "P3" },
];

it("renders a named tablist with the first panel selected", () => {
  render(<TabsBase classes={t} label="Sections" items={items} />);
  expect(screen.getByRole("tablist", { name: "Sections" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("P1");
});

it("switches panels by arrow key and skips disabled tabs", async () => {
  render(<TabsBase classes={t} label="Sections" items={items} />);
  await userEvent.click(screen.getByRole("tab", { name: "One" }));
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("P3");
});

it("reports selection changes and stays controlled", async () => {
  const onSelectionChange = vi.fn();
  render(
    <TabsBase classes={t} label="Sections" items={items} selectedKey="a" onSelectionChange={onSelectionChange} />,
  );
  await userEvent.click(screen.getByRole("tab", { name: "Three" }));
  expect(onSelectionChange).toHaveBeenCalledWith("c");
  expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
});

it("starts at defaultSelectedKey and merges className onto the root", () => {
  render(<TabsBase classes={t} label="Sections" items={items} defaultSelectedKey="c" className="x" />);
  expect(screen.getByRole("tabpanel")).toHaveTextContent("P3");
  // React Aria renders a <template> for collection building before the root, so find the root via the tablist.
  expect(screen.getByRole("tablist").parentElement).toHaveClass("r", "x");
});
