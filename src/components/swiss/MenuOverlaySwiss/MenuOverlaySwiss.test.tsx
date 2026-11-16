import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuOverlaySwiss } from "./MenuOverlaySwiss";

const links = [
  { href: "#accounts", label: "Accounts" },
  { href: "#payments", label: "Payments", current: true },
];

it("opens a labelled dialog and marks the current link with an underline", async () => {
  render(<MenuOverlaySwiss triggerLabel="Menu" title="Account menu" links={links} />);
  await userEvent.click(screen.getByRole("button", { name: "Menu" }));
  expect(screen.getByRole("dialog", { name: "Account menu" })).toBeInTheDocument();
  const current = screen.getByRole("link", { name: "Payments" });
  expect(current).toHaveAttribute("aria-current", "page");
  expect(current).toHaveClass("aria-[current=page]:underline");
});

it("closes on Escape and returns focus to the trigger", async () => {
  render(<MenuOverlaySwiss triggerLabel="Menu" title="Account menu" links={links} />);
  const trigger = screen.getByRole("button", { name: "Menu" });
  await userEvent.click(trigger);
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("uses a square paper-white overlay with links divided by hairlines", () => {
  render(<MenuOverlaySwiss triggerLabel="Menu" title="Account menu" links={links} defaultOpen />);
  const dialog = screen.getByRole("dialog");
  expect(document.querySelector(".fixed.inset-0.z-50")).toHaveClass("bg-bh-paper-white");
  expect(dialog.querySelector('[class*="backdrop-blur"], [class*="rounded"]')).toBeNull();
  expect(dialog.querySelector("ul")).toHaveClass("border-t", "border-bh-rule");
});

it("puts className on the trigger", () => {
  render(<MenuOverlaySwiss triggerLabel="Menu" title="Account menu" links={links} className="ml-auto" />);
  expect(screen.getByRole("button", { name: "Menu" })).toHaveClass("ml-auto");
});

it("forwards ref to the trigger", () => {
  const ref = createRef<HTMLButtonElement>();
  render(<MenuOverlaySwiss triggerLabel="Menu" title="Account menu" links={links} ref={ref} />);
  expect(ref.current).toBe(screen.getByRole("button", { name: "Menu" }));
});
