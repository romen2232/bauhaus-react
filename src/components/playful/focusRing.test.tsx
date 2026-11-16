import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuOverlayPlayful } from "./MenuOverlayPlayful/MenuOverlayPlayful";
import { TabsPlayful } from "./TabsPlayful/TabsPlayful";

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
