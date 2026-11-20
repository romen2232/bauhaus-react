import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonSoft } from "../ButtonSoft/ButtonSoft";
import { ModalSoft } from "./ModalSoft";

it("opens from ButtonSoft and returns focus to it on Escape", async () => {
  render(
    <ModalSoft title="Edit" trigger={<ButtonSoft>Open</ButtonSoft>}>
      Body
    </ModalSoft>,
  );
  const trigger = screen.getByRole("button", { name: "Open" });
  await userEvent.click(trigger);
  expect(screen.getByRole("dialog", { name: "Edit" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("panel is rounded paper with no border", () => {
  render(<ModalSoft title="T" defaultOpen>Body</ModalSoft>);
  const panel = screen.getByRole("dialog").closest(".rounded-bh-soft");
  expect(panel).not.toBeNull();
  expect(panel).toHaveClass("bg-bh-paper");
  expect([...(panel as HTMLElement).classList].filter((t) => t.startsWith("border"))).toEqual([]);
});

it("scrim is solid charcoal at 60% with no blur", () => {
  render(<ModalSoft title="T" defaultOpen>Body</ModalSoft>);
  expect(document.body.querySelector(".bg-bh-charcoal\\/60")).not.toBeNull();
  expect(document.body.querySelector('[class*="backdrop-"]')).toBeNull();
});

it("size maps to a max width", () => {
  const { rerender } = render(<ModalSoft title="T" defaultOpen size="sm">B</ModalSoft>);
  expect(screen.getByRole("dialog").closest(".rounded-bh-soft")).toHaveClass("max-w-sm");
  rerender(<ModalSoft title="T" defaultOpen size="lg">B</ModalSoft>);
  expect(screen.getByRole("dialog").closest(".rounded-bh-soft")).toHaveClass("max-w-2xl");
});

it("forwards className and ref to the panel", () => {
  const ref = createRef<HTMLDivElement>();
  render(<ModalSoft title="T" defaultOpen className="extra" ref={ref}>Body</ModalSoft>);
  const panel = screen.getByRole("dialog").closest(".rounded-bh-soft");
  expect(panel).toHaveClass("extra");
  expect(ref.current).toBe(panel);
});
