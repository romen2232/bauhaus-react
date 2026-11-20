import { CalendarDate } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateStripSwiss } from "./DateStripSwiss/DateStripSwiss";
import { MenuOverlaySwiss } from "./MenuOverlaySwiss/MenuOverlaySwiss";
import { TabsSwiss } from "./TabsSwiss/TabsSwiss";
import { TextFieldSwiss } from "./TextFieldSwiss/TextFieldSwiss";
import { TextAreaSwiss } from "./TextAreaSwiss/TextAreaSwiss";
import { CheckboxSwiss } from "./CheckboxSwiss/CheckboxSwiss";

// Tailwind 4.3 hides outlines through --tw-outline-style, so React Aria controls
// that hide their outline must explicitly restore a solid style on focus.
const killsFocusRing = (el: Element) =>
  (el.classList.contains("outline-none") || el.classList.contains("outline-hidden")) &&
  !el.classList.contains("data-[focus-visible]:outline-solid");

it("MenuOverlaySwiss trigger and close button keep a visible focus ring", async () => {
  render(
    <MenuOverlaySwiss triggerLabel="Menu" title="Account menu" links={[{ href: "#a", label: "Accounts" }]} />,
  );
  const trigger = screen.getByRole("button", { name: "Menu" });
  expect(killsFocusRing(trigger)).toBe(false);
  await userEvent.click(trigger);
  expect(killsFocusRing(screen.getByRole("button", { name: "Close menu" }))).toBe(false);
});

it("TabsSwiss keeps a visible focus ring on tabs and panels", () => {
  render(
    <TabsSwiss
      label="Statement period"
      items={[
        { id: "daily", title: "Daily", content: "Daily transactions" },
        { id: "monthly", title: "Monthly", content: "Monthly transactions" },
      ]}
    />,
  );
  for (const tab of screen.getAllByRole("tab")) expect(killsFocusRing(tab)).toBe(false);
  expect(killsFocusRing(screen.getByRole("tabpanel"))).toBe(false);
});

it("DateStripSwiss keeps a visible focus ring on every day", () => {
  render(<DateStripSwiss label="Payment date" start={new CalendarDate(2026, 11, 16)} />);
  for (const radio of screen.getAllByRole("radio")) {
    expect(killsFocusRing(radio.closest("label")!)).toBe(false);
  }
});

it("TextFieldSwiss keeps a visible focus ring", () => {
  render(<TextFieldSwiss label="Name" />);
  expect(killsFocusRing(screen.getByRole("textbox"))).toBe(false);
});

it("TextAreaSwiss keeps a visible focus ring", () => {
  render(<TextAreaSwiss label="Notes" />);
  expect(killsFocusRing(screen.getByRole("textbox"))).toBe(false);
});

it("CheckboxSwiss keeps a visible focus ring on its box", () => {
  const { container } = render(<CheckboxSwiss label="Terms" />);
  const box = container.querySelector("[aria-hidden]")!;
  expect(box.className).toContain("group-data-[focus-visible]:outline-bh-ink");
  expect(killsFocusRing(screen.getByRole("checkbox").closest("label")!)).toBe(false);
});
