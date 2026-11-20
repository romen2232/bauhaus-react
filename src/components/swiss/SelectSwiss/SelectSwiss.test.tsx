import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectSwiss } from "./SelectSwiss";

const items = [
  { id: "banana", label: "Banana" },
  { id: "apple", label: "Apple" },
];
const trigger = () => screen.getByRole("button", { name: /Fruit/ });
const root = () => trigger().closest(".group")!;

it("renders a named trigger with a 1px ink bottom rule, transparent and square", () => {
  render(<SelectSwiss label="Fruit" items={items} />);
  for (const c of ["border-b", "border-bh-ink", "bg-transparent", "rounded-none"]) {
    expect(trigger()).toHaveClass(c);
  }
  expect(trigger().className).not.toMatch(/border-2|rounded-(?!none)/);
});

it("picks an option with the pointer and reports the key", async () => {
  const onSelectionChange = vi.fn();
  render(<SelectSwiss label="Fruit" items={items} onSelectionChange={onSelectionChange} />);
  await userEvent.click(trigger());
  await userEvent.click(screen.getByRole("option", { name: "Apple" }));
  expect(onSelectionChange).toHaveBeenLastCalledWith("apple");
  expect(trigger()).toHaveTextContent("Apple");
});

it("turns the trigger rule accent through the root group when invalid; the message stays ink, no marker", () => {
  render(<SelectSwiss label="Fruit" items={items} isInvalid errorMessage="Pick one" />);
  const msg = screen.getByText("Pick one");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  expect(msg.closest("[class]")!.querySelector("[aria-hidden]")).toBeNull();
  expect(root()).toHaveAttribute("data-invalid");
  expect(trigger()).toHaveClass("group-data-[invalid]:border-bh-accent");
  // The trigger button never emits data-invalid, so a data-[invalid]: variant would be dead code.
  expect(trigger()).not.toHaveAttribute("data-invalid");
  expect(trigger().className).not.toMatch(/(^|\s)data-\[invalid\]:/);
});

it("uses exactly one accent token on the trigger", () => {
  render(<SelectSwiss label="Fruit" items={items} isInvalid errorMessage="Pick one" />);
  expect(trigger().className.split(/\s+/).filter((t) => t.includes("bh-accent"))).toHaveLength(1);
});

it("opens a white popover with a 1px rule and no shadow", async () => {
  render(<SelectSwiss label="Fruit" items={items} />);
  await userEvent.click(trigger());
  const popover = screen.getByRole("listbox").closest("[data-trigger]") as HTMLElement;
  expect(popover).toHaveClass("border", "border-bh-rule", "bg-bh-paper-white", "rounded-none");
  expect(popover.className).not.toMatch(/shadow-/);
});

it("inks the selected option and marks it with a check", async () => {
  render(<SelectSwiss label="Fruit" items={items} defaultSelectedKey="banana" />);
  await userEvent.click(trigger());
  const banana = screen.getByRole("option", { name: /Banana/ });
  expect(banana).toHaveClass("data-[selected]:text-bh-ink", "data-[focused]:text-bh-ink");
  expect(banana).toHaveTextContent("✓");
});

it("merges className onto the root", () => {
  render(<SelectSwiss label="Fruit" items={items} className="mt-4" />);
  expect(root()).toHaveClass("mt-4");
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<SelectSwiss label="Fruit" items={items} ref={ref} />);
  expect(ref.current).toBe(root());
});
