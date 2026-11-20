import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuOverlayPlayful } from "./MenuOverlayPlayful/MenuOverlayPlayful";
import { TabsPlayful } from "./TabsPlayful/TabsPlayful";
import { TextFieldPlayful } from "./TextFieldPlayful/TextFieldPlayful";
import { TextAreaPlayful } from "./TextAreaPlayful/TextAreaPlayful";
import { CheckboxPlayful } from "./CheckboxPlayful/CheckboxPlayful";
import { SwitchPlayful } from "./SwitchPlayful/SwitchPlayful";
import { RadioGroupPlayful } from "./RadioGroupPlayful/RadioGroupPlayful";
import { SelectPlayful } from "./SelectPlayful/SelectPlayful";

// In Tailwind 4.3, both `outline-none` and `outline-hidden` set --tw-outline-style: none, and
// `data-[focus-visible]:outline-2` reads that variable, so the ring never shows (WCAG 2.4.7).
// Any React Aria control that hides the default outline must restore the style on focus.
const killsFocusRing = (el: Element) =>
  (el.classList.contains("outline-none") || el.classList.contains("outline-hidden")) &&
  !el.classList.contains("data-[focus-visible]:outline-solid");

it("Tabs keep a visible focus ring on tabs and panels", () => {
  render(
    <TabsPlayful
      label="Sections"
      items={[
        { id: "a", title: "One", content: "P1" },
        { id: "b", title: "Two", content: "P2" },
      ]}
    />,
  );
  for (const tab of screen.getAllByRole("tab")) expect(killsFocusRing(tab)).toBe(false);
  expect(killsFocusRing(screen.getByRole("tabpanel"))).toBe(false);
});

it("MenuOverlay trigger and close button keep a visible focus ring", async () => {
  render(<MenuOverlayPlayful triggerLabel="Menu" title="Site menu" links={[{ href: "#a", label: "A" }]} />);
  const trigger = screen.getByRole("button", { name: "Menu" });
  expect(killsFocusRing(trigger)).toBe(false);
  await userEvent.click(trigger);
  expect(killsFocusRing(screen.getByRole("button", { name: "Close menu" }))).toBe(false);
});

it("TextFieldPlayful keeps a visible focus ring", () => {
  render(<TextFieldPlayful label="Name" />);
  expect(killsFocusRing(screen.getByRole("textbox"))).toBe(false);
});

it("TextAreaPlayful keeps a visible focus ring", () => {
  render(<TextAreaPlayful label="Notes" />);
  expect(killsFocusRing(screen.getByRole("textbox"))).toBe(false);
});

it("CheckboxPlayful keeps a visible focus ring on its box", () => {
  const { container } = render(<CheckboxPlayful label="Terms" />);
  const box = container.querySelector("[aria-hidden]")!;
  expect(box.className).toContain("group-data-[focus-visible]:outline-bh-ink");
  expect(killsFocusRing(screen.getByRole("checkbox").closest("label")!)).toBe(false);
});

it("SwitchPlayful keeps a visible focus ring on its track", () => {
  const { container } = render(<SwitchPlayful label="Alerts" />);
  const track = container.querySelector("[aria-hidden]")!;
  expect(track.className).toContain("group-data-[focus-visible]:outline-bh-ink");
  expect(killsFocusRing(screen.getByRole("switch").closest("label")!)).toBe(false);
});

it("RadioGroupPlayful keeps a visible focus ring on its circles", () => {
  const { container } = render(<RadioGroupPlayful label="Via" options={[{ value: "a", label: "Email" }]} />);
  const circle = container.querySelector("[aria-hidden]")!;
  expect(circle.className).toContain("group-data-[focus-visible]:outline-bh-ink");
  expect(killsFocusRing(screen.getByRole("radio").closest("label")!)).toBe(false);
});

it("SelectPlayful keeps a visible focus ring on its trigger and options", async () => {
  render(<SelectPlayful label="Fruit" items={[{ id: "a", label: "Apple" }]} />);
  const trigger = screen.getByRole("button", { name: /Fruit/ });
  expect(killsFocusRing(trigger)).toBe(false);
  expect(trigger.className).toContain("data-[focus-visible]:outline-bh-ink");
  await userEvent.click(trigger);
  expect(killsFocusRing(screen.getByRole("option", { name: "Apple" }))).toBe(false);
  expect(killsFocusRing(screen.getByRole("listbox"))).toBe(false);
});
