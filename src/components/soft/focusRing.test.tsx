import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuOverlaySoft } from "./MenuOverlaySoft/MenuOverlaySoft";

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
