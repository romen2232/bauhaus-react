import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarDate } from "@internationalized/date";
import { MenuOverlaySoft } from "./MenuOverlaySoft/MenuOverlaySoft";
import { TabsSoft } from "./TabsSoft/TabsSoft";
import { DateStripSoft } from "./DateStripSoft/DateStripSoft";
import { TextFieldSoft } from "./TextFieldSoft/TextFieldSoft";
import { TextAreaSoft } from "./TextAreaSoft/TextAreaSoft";

// Same guard as playful/focusRing.test.tsx: in Tailwind 4.3, `outline-none`/`outline-hidden` set
// --tw-outline-style: none, so a React Aria control that hides the outline must restore the style.
const killsFocusRing = (el: Element) =>
  (el.classList.contains("outline-none") || el.classList.contains("outline-hidden")) &&
  !el.classList.contains("data-[focus-visible]:outline-solid");

it("MenuOverlaySoft trigger and close button keep a visible focus ring", async () => {
  render(<MenuOverlaySoft triggerLabel="Menu" title="Site menu" links={[{ href: "#a", label: "A" }]} />);
  const trigger = screen.getByRole("button", { name: "Menu" });
  expect(killsFocusRing(trigger)).toBe(false);
  await userEvent.click(trigger);
  expect(killsFocusRing(screen.getByRole("button", { name: "Close menu" }))).toBe(false);
});

it("TabsSoft keeps a visible focus ring on tabs and panels", () => {
  render(
    <TabsSoft
      label="View"
      items={[
        { id: "a", title: "Day", content: "P1" },
        { id: "b", title: "Week", content: "P2" },
      ]}
    />,
  );
  for (const tab of screen.getAllByRole("tab")) expect(killsFocusRing(tab)).toBe(false);
  expect(killsFocusRing(screen.getByRole("tabpanel"))).toBe(false);
});

it("DateStripSoft keeps a visible focus ring on every day", () => {
  render(<DateStripSoft label="Pick" start={new CalendarDate(2026, 11, 16)} />);
  for (const radio of screen.getAllByRole("radio")) expect(killsFocusRing(radio.closest("label")!)).toBe(false);
});

it("TextFieldSoft keeps a visible focus ring", () => {
  render(<TextFieldSoft label="Name" />);
  expect(killsFocusRing(screen.getByRole("textbox"))).toBe(false);
});

it("TextAreaSoft keeps a visible focus ring", () => {
  render(<TextAreaSoft label="Notes" />);
  expect(killsFocusRing(screen.getByRole("textbox"))).toBe(false);
});
