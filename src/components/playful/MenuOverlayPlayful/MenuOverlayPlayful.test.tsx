import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MenuOverlayPlayful } from "./MenuOverlayPlayful";

const links = [{ href: "#work", label: "Work" }];

it("opens a solid paper overlay dialog", async () => {
  render(<MenuOverlayPlayful triggerLabel="Menu" title="Site menu" links={links} className="x" />);
  const trigger = screen.getByRole("button", { name: "Menu" });
  expect(trigger).toHaveClass("rounded-full", "x");
  await userEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Site menu" });
  expect(dialog.closest(".bg-bh-paper")).not.toBeNull();
  expect(document.querySelector("[class*='backdrop-blur']")).toBeNull();
});
