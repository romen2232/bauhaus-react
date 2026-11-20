import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectSoft } from "./SelectSoft";

const items = [
  { id: "banana", label: "Banana" },
  { id: "apple", label: "Apple" },
];
const trigger = () => screen.getByRole("button", { name: /Fruit/ });
const root = () => trigger().closest(".group")!;

it("renders a named trigger with a rounded sand fill and a 1px charcoal outline", () => {
  render(<SelectSoft label="Fruit" items={items} />);
  for (const c of ["rounded-full", "border", "border-bh-charcoal", "bg-bh-sand"]) {
    expect(trigger()).toHaveClass(c);
  }
});

it("picks an option with the pointer and reports the key", async () => {
  const onSelectionChange = vi.fn();
  render(<SelectSoft label="Fruit" items={items} onSelectionChange={onSelectionChange} />);
  await userEvent.click(trigger());
  await userEvent.click(screen.getByRole("option", { name: "Apple" }));
  expect(onSelectionChange).toHaveBeenLastCalledWith("apple");
  expect(trigger()).toHaveTextContent("Apple");
});

it("shows an invalid message in non-red text with a red dot marker; the trigger does not change", () => {
  const valid = render(<SelectSoft label="Fruit" items={items} />);
  const validClass = trigger().className;
  valid.unmount();
  render(<SelectSoft label="Fruit" items={items} isInvalid errorMessage="Pick one" />);
  const msg = screen.getByText("Pick one");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  expect(msg.closest("[class]")!.querySelector("[aria-hidden]")).toHaveClass("bg-bh-red", "rounded-full");
  expect(trigger().className).toBe(validClass);
  expect(root()).toHaveAttribute("data-invalid");
});

it("opens a borderless, shadowless sand popover with the soft radius", async () => {
  render(<SelectSoft label="Fruit" items={items} />);
  await userEvent.click(trigger());
  const popover = screen.getByRole("listbox").closest("[data-trigger]") as HTMLElement;
  expect(popover).toHaveClass("rounded-bh-soft", "bg-bh-sand");
  expect(popover.className).not.toMatch(/shadow-|border/);
});

it("fills the focused option charcoal with paper text and marks the selected one with a check", async () => {
  render(<SelectSoft label="Fruit" items={items} defaultSelectedKey="banana" />);
  await userEvent.click(trigger());
  const banana = screen.getByRole("option", { name: /Banana/ });
  expect(banana).toHaveClass("rounded-full", "data-[focused]:bg-bh-charcoal", "data-[focused]:text-bh-paper");
  expect(banana).toHaveTextContent("✓");
});

it("uses charcoal, never muted-text, for the placeholder and the empty state on sand", async () => {
  render(<SelectSoft label="Fruit" items={[]} />);
  expect(trigger().querySelector("[data-placeholder]")).toHaveClass("data-[placeholder]:text-bh-charcoal");
  await userEvent.click(trigger());
  expect(screen.getByText("No options")).toHaveClass("text-bh-charcoal");
});

it("merges className onto the root", () => {
  render(<SelectSoft label="Fruit" items={items} className="mt-4" />);
  expect(root()).toHaveClass("mt-4");
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<SelectSoft label="Fruit" items={items} ref={ref} />);
  expect(ref.current).toBe(root());
});
