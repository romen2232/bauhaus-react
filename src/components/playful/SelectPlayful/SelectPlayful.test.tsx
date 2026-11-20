import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectPlayful } from "./SelectPlayful";

const items = [
  { id: "banana", label: "Banana" },
  { id: "apple", label: "Apple" },
];
const trigger = () => screen.getByRole("button", { name: /Fruit/ });
const root = () => trigger().closest(".group")!;

it("renders a named trigger button with a ink 2px border and no radius", () => {
  render(<SelectPlayful label="Fruit" items={items} />);
  for (const c of ["border-2", "border-bh-ink", "rounded-none", "bg-bh-paper-white"]) {
    expect(trigger()).toHaveClass(c);
  }
});

it("shows an invalid message in non-red text with a red square marker; the trigger border stays ink", () => {
  const valid = render(<SelectPlayful label="Fruit" items={items} />);
  const validClass = trigger().className;
  valid.unmount();
  render(<SelectPlayful label="Fruit" items={items} isInvalid errorMessage="Pick one" />);
  const msg = screen.getByText("Pick one");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  expect(trigger().className).toBe(validClass);
  expect(trigger()).toHaveClass("border-bh-ink");
  expect(msg.closest("[class]")!.querySelector("[aria-hidden]")).toHaveClass("bg-bh-red");
  expect(root()).toHaveAttribute("data-invalid");
});

it("opens a popover with a 2px ink border, hard shadow and paper-white fill", async () => {
  render(<SelectPlayful label="Fruit" items={items} />);
  await userEvent.click(trigger());
  const popover = screen.getByRole("listbox").closest("[data-trigger]") as HTMLElement;
  for (const c of ["border-2", "border-bh-ink", "shadow-bh-hard", "bg-bh-paper-white"]) {
    expect(popover).toHaveClass(c);
  }
});

it("lights the focused option yellow with ink text and marks the selected one with a check", async () => {
  render(<SelectPlayful label="Fruit" items={items} defaultSelectedKey="banana" />);
  await userEvent.click(trigger());
  const banana = screen.getByRole("option", { name: /Banana/ });
  expect(banana).toHaveClass("data-[focused]:bg-bh-yellow", "text-bh-ink");
  expect(banana).toHaveTextContent("✓");
});

it("merges className onto the root", () => {
  render(<SelectPlayful label="Fruit" items={items} className="mt-4" />);
  expect(root()).toHaveClass("mt-4");
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<SelectPlayful label="Fruit" items={items} ref={ref} />);
  expect(ref.current).toBe(root());
});
