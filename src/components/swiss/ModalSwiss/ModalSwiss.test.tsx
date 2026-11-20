import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonSwiss } from "../ButtonSwiss/ButtonSwiss";
import { ModalSwiss } from "./ModalSwiss";

const panelOf = () => screen.getByRole("dialog").closest(".bg-bh-paper-white") as HTMLElement;

it("opens from ButtonSwiss and returns focus to it on Escape", async () => {
  render(
    <ModalSwiss title="Edit" trigger={<ButtonSwiss>Open</ButtonSwiss>}>
      Body
    </ModalSwiss>,
  );
  const trigger = screen.getByRole("button", { name: "Open" });
  await userEvent.click(trigger);
  expect(screen.getByRole("dialog", { name: "Edit" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("panel is paper-white with a 2px ink top rule, no rounding or shadow", () => {
  render(<ModalSwiss title="T" defaultOpen>Body</ModalSwiss>);
  const panel = panelOf();
  expect(panel).not.toBeNull();
  expect(panel).toHaveClass("border-t-2", "border-bh-ink");
  expect([...panel.classList].filter((t) => /^(rounded|shadow)/.test(t))).toEqual([]);
});

it("scrim is solid ink at 40% with no blur", () => {
  render(<ModalSwiss title="T" defaultOpen>Body</ModalSwiss>);
  expect(document.body.querySelector(".bg-bh-ink\\/40")).not.toBeNull();
  expect(document.body.querySelector('[class*="backdrop-"]')).toBeNull();
});

it("title is set in the grotesk face, not the display face", () => {
  render(<ModalSwiss title="Edit profile" defaultOpen>Body</ModalSwiss>);
  const title = screen.getByRole("heading", { name: "Edit profile" });
  expect(title.className).toMatch(/font-bh-grotesk/);
  expect(title.className).not.toMatch(/font-bh-display/);
});

it("forwards className and ref to the panel", () => {
  const ref = createRef<HTMLDivElement>();
  render(<ModalSwiss title="T" defaultOpen className="extra" ref={ref}>Body</ModalSwiss>);
  expect(panelOf()).toHaveClass("extra");
  expect(ref.current).toBe(panelOf());
});
