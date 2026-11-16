import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuOverlaySoft } from "./MenuOverlaySoft";

const links = [
  { href: "#today", label: "Today" },
  { href: "#rooms", label: "Rooms", current: true },
];

it("opens a labelled dialog and marks the current link", async () => {
  render(<MenuOverlaySoft triggerLabel="Menu" title="Site menu" links={links} />);
  await userEvent.click(screen.getByRole("button", { name: "Menu" }));
  expect(screen.getByRole("dialog", { name: "Site menu" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Rooms" })).toHaveAttribute("aria-current", "page");
});

it("closes on Escape and returns focus to the trigger", async () => {
  render(<MenuOverlaySoft triggerLabel="Menu" title="Site menu" links={links} />);
  const trigger = screen.getByRole("button", { name: "Menu" });
  await userEvent.click(trigger);
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  // React Aria restores focus on the next animation frame.
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("uses a rounded sheet with no backdrop blur", async () => {
  render(<MenuOverlaySoft triggerLabel="Menu" title="Site menu" links={links} defaultOpen />);
  const dialog = screen.getByRole("dialog");
  expect(dialog.closest(".rounded-bh-soft")).not.toBeNull();
  expect(document.querySelector('[class*="backdrop-blur"]')).toBeNull();
});

it("puts className on the trigger", () => {
  render(<MenuOverlaySoft triggerLabel="Menu" title="Site menu" links={links} className="ml-auto" />);
  expect(screen.getByRole("button", { name: "Menu" })).toHaveClass("ml-auto");
});
