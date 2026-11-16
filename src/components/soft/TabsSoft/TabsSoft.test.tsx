import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TabsSoft } from "./TabsSoft";

const items = [
  { id: "day", title: "Day", content: "Day view" },
  { id: "week", title: "Week", content: "Week view" },
];

it("is a named tab list whose arrow keys move the selection", async () => {
  const onSelectionChange = vi.fn();
  render(<TabsSoft label="View" items={items} onSelectionChange={onSelectionChange} />);
  expect(screen.getByRole("tablist", { name: "View" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("tab", { name: "Day" }));
  await userEvent.keyboard("{ArrowRight}");
  expect(onSelectionChange).toHaveBeenLastCalledWith("week");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Week view");
});

it("selected tab is a charcoal pill", () => {
  render(<TabsSoft label="View" items={items} />);
  expect(screen.getByRole("tab", { name: "Day" })).toHaveClass(
    "rounded-full",
    "data-[selected]:bg-bh-charcoal",
    "data-[selected]:text-bh-paper",
  );
});

it("merges className onto the root", () => {
  render(<TabsSoft label="View" items={items} className="mt-6" />);
  expect(screen.getByRole("tablist").parentElement).toHaveClass("mt-6");
});
