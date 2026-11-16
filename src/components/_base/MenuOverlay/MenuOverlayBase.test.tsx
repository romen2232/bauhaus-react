import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MenuOverlayBase } from "./MenuOverlayBase";

const m = { trigger: "t", overlay: "", panel: "", close: "", list: "", item: "", link: "", secondary: "" };
const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About", current: true },
];

it("opens a labelled dialog from the trigger", async () => {
  render(<MenuOverlayBase classes={m} triggerLabel="Menu" title="Site menu" links={links} />);
  expect(screen.queryByRole("dialog")).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Menu" }));
  expect(screen.getByRole("dialog", { name: "Site menu" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Work" })).not.toHaveAttribute("aria-current");
});

it.each(["escape", "close", "link"])("closes via %s and returns focus to the trigger", async (how) => {
  render(<MenuOverlayBase classes={m} triggerLabel="Menu" title="Site menu" links={links} />);
  const trigger = screen.getByRole("button", { name: "Menu" });
  await userEvent.click(trigger);
  if (how === "escape") await userEvent.keyboard("{Escape}");
  if (how === "close") await userEvent.click(screen.getByRole("button", { name: "Close menu" }));
  if (how === "link") await userEvent.click(screen.getByRole("link", { name: "Work" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  // React Aria restores focus on the next animation frame.
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("is controllable", async () => {
  const onOpenChange = vi.fn();
  render(
    <MenuOverlayBase
      classes={m}
      triggerLabel="Menu"
      title="Site menu"
      links={links}
      isOpen
      onOpenChange={onOpenChange}
    />,
  );
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

it("renders secondary content and merges className onto the trigger", async () => {
  render(
    <MenuOverlayBase
      classes={m}
      triggerLabel="Menu"
      title="Site menu"
      links={links}
      secondary={<p>Social</p>}
      className="x"
    />,
  );
  const trigger = screen.getByRole("button", { name: "Menu" });
  expect(trigger).toHaveClass("t", "x");
  await userEvent.click(trigger);
  expect(screen.getByText("Social")).toBeInTheDocument();
});
