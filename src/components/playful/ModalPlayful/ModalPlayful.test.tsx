import { createRef } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonPlayful } from "../ButtonPlayful/ButtonPlayful";
import { ModalPlayful } from "./ModalPlayful";

it("opens from ButtonPlayful and returns focus to it on Escape", async () => {
  render(
    <ModalPlayful title="Edit" trigger={<ButtonPlayful>Open</ButtonPlayful>}>
      Body
    </ModalPlayful>,
  );
  const trigger = screen.getByRole("button", { name: "Open" });
  await userEvent.click(trigger);
  expect(screen.getByRole("dialog", { name: "Edit" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("alertdialog role with a footer action that closes it", async () => {
  render(
    <ModalPlayful
      title="Delete?"
      role="alertdialog"
      trigger={<ButtonPlayful>Open</ButtonPlayful>}
      footer={({ close }) => <ButtonPlayful onClick={close}>Cancel</ButtonPlayful>}
    >
      Cannot be undone
    </ModalPlayful>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("alertdialog", { name: "Delete?" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("alertdialog")).toBeNull();
});

it("panel has the hard lg shadow, a 2px ink border and the paper fill", () => {
  render(<ModalPlayful title="T" defaultOpen>Body</ModalPlayful>);
  const panel = screen.getByRole("dialog").closest(".shadow-bh-hard-lg");
  expect(panel).not.toBeNull();
  expect(panel).toHaveClass("border-2", "border-bh-ink", "bg-bh-paper");
});

it("scrim is solid ink at 60% with no blur", () => {
  render(<ModalPlayful title="T" defaultOpen>Body</ModalPlayful>);
  expect(document.body.querySelector(".bg-bh-ink\\/60")).not.toBeNull();
  expect(document.body.querySelector('[class*="backdrop-"]')).toBeNull();
});

it("forwards className and ref to the panel", () => {
  const ref = createRef<HTMLDivElement>();
  render(<ModalPlayful title="T" defaultOpen className="extra" ref={ref}>Body</ModalPlayful>);
  const panel = screen.getByRole("dialog").closest(".shadow-bh-hard-lg");
  expect(panel).toHaveClass("extra");
  expect(ref.current).toBe(panel);
});

describe("disabled ButtonPlayful trigger", () => {
  it.each([
    ["button", <ButtonPlayful disabled>Open</ButtonPlayful>],
    ["link", <ButtonPlayful href="/x" disabled>Open</ButtonPlayful>],
  ])("a disabled %s trigger cannot open the dialog by click or keyboard", async (_n, trigger) => {
    render(<ModalPlayful title="Edit" trigger={trigger}>Body</ModalPlayful>);
    const el = screen.getByText("Open").closest("button, a") as HTMLElement;
    await userEvent.click(el);
    expect(screen.queryByRole("dialog")).toBeNull();
    act(() => el.focus());
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard(" ");
    fireEvent.click(el);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
