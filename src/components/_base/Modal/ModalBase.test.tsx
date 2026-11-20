import { createRef, useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ModalBase } from "./ModalBase";

const c = { overlay: "scrim", modal: "panel", header: "header", title: "title", body: "body", footer: "footer" };

const opener = <button type="button">Open</button>;

it("opens a dialog named by title from a plain <button> trigger", async () => {
  render(<ModalBase classes={c} title="Edit profile" trigger={opener}>Body text</ModalBase>);
  expect(screen.queryByRole("dialog")).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog", { name: "Edit profile" })).toBeInTheDocument();
  expect(screen.getByText("Body text")).toBeInTheDocument();
});

it("closes on Escape and returns focus to the trigger", async () => {
  render(<ModalBase classes={c} title="Edit" trigger={opener}>Body</ModalBase>);
  const trigger = screen.getByRole("button", { name: "Open" });
  await userEvent.click(trigger);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  await waitFor(() => expect(trigger).toHaveFocus());
});

it("traps Tab focus inside the dialog", async () => {
  render(
    <ModalBase
      classes={c}
      title="Trap"
      trigger={opener}
      footer={
        <>
          <button type="button">One</button>
          <button type="button">Two</button>
        </>
      }
    >
      Body
    </ModalBase>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  const dialog = screen.getByRole("dialog");
  for (let i = 0; i < 6; i++) {
    await userEvent.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  }
  await userEvent.tab({ shift: true });
  expect(dialog.contains(document.activeElement)).toBe(true);
});

it("scrim click closes a dismissable dialog", async () => {
  const { container } = render(<ModalBase classes={c} title="Edit" trigger={opener}>Body</ModalBase>);
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  const scrim = document.body.querySelector(".scrim") as HTMLElement;
  expect(container.contains(scrim)).toBe(false); // portalled
  await userEvent.click(scrim);
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});

it("isDismissable={false} ignores scrim clicks", async () => {
  render(<ModalBase classes={c} title="Edit" trigger={opener} isDismissable={false}>Body</ModalBase>);
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await userEvent.click(document.body.querySelector(".scrim") as HTMLElement);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
});

it("isDismissable={false} still closes on Escape", async () => {
  render(<ModalBase classes={c} title="Edit" trigger={opener} isDismissable={false}>Body</ModalBase>);
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("alertdialog is named by title, and scrim clicks never close it even with isDismissable", async () => {
  render(
    <ModalBase classes={c} title="Delete project?" role="alertdialog" isDismissable trigger={opener}>
      Cannot be undone
    </ModalBase>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("alertdialog", { name: "Delete project?" })).toBeInTheDocument();
  await userEvent.click(document.body.querySelector(".scrim") as HTMLElement);
  expect(screen.getByRole("alertdialog", { name: "Delete project?" })).toBeInTheDocument();
});

it("controlled isOpen: Escape calls onOpenChange(false) and the dialog stays until the parent flips it", async () => {
  const onOpenChange = vi.fn();
  function Harness() {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button type="button" onClick={() => setOpen(false)}>Parent close</button>
        <ModalBase classes={c} title="Edit" isOpen={open} onOpenChange={onOpenChange}>Body</ModalBase>
      </>
    );
  }
  render(<Harness />);
  expect(screen.getByRole("dialog", { name: "Edit" })).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(screen.getByRole("dialog", { name: "Edit" })).toBeInTheDocument();
  // The parent's button is outside the modal (aria-hidden), so flip via the DOM click.
  fireEvent.click(screen.getByText("Parent close"));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});

it("works without a trigger (defaultOpen) and without a footer", () => {
  render(<ModalBase classes={c} title="Standalone" defaultOpen>Body</ModalBase>);
  expect(screen.getByRole("dialog", { name: "Standalone" })).toBeInTheDocument();
  expect(document.body.querySelector(".footer")).toBeNull();
});

it("renders the footer slot when provided", () => {
  render(<ModalBase classes={c} title="T" defaultOpen footer={<span>Foot</span>}>Body</ModalBase>);
  expect(document.body.querySelector(".footer")).toHaveTextContent("Foot");
});

it("a render-function footer receives close() and closes the dialog (onOpenChange(false))", async () => {
  const onOpenChange = vi.fn();
  render(
    <ModalBase
      classes={c}
      title="Confirm"
      trigger={opener}
      onOpenChange={onOpenChange}
      footer={({ close }) => <button type="button" onClick={close}>Cancel</button>}
    >
      Body
    </ModalBase>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("a render-function body receives close() too", async () => {
  render(
    <ModalBase classes={c} title="Confirm" trigger={opener}>
      {({ close }) => <button type="button" onClick={close}>Done</button>}
    </ModalBase>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  await userEvent.click(screen.getByRole("button", { name: "Done" }));
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("a disabled trigger cannot open the dialog", async () => {
  render(
    <ModalBase classes={c} title="Edit" trigger={<button type="button" disabled>Open</button>}>
      Body
    </ModalBase>,
  );
  await userEvent.click(screen.getByRole("button", { name: "Open" }));
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("body scrolls, header and footer do not", () => {
  render(<ModalBase classes={c} title="T" defaultOpen footer={<span>f</span>}>Body</ModalBase>);
  const body = document.body.querySelector(".body") as HTMLElement;
  expect(body).toHaveClass("overflow-y-auto", "min-h-0");
  expect(document.body.querySelector(".header")).toHaveClass("shrink-0");
  expect(document.body.querySelector(".footer")).toHaveClass("shrink-0");
  expect(document.body.querySelector(".panel")).toHaveClass("max-h-full");
});

it("size maps to a max width and className and ref land on the panel", () => {
  const ref = createRef<HTMLDivElement>();
  const { rerender } = render(
    <ModalBase classes={c} title="T" defaultOpen className="extra" ref={ref}>B</ModalBase>,
  );
  const panel = document.body.querySelector(".panel") as HTMLElement;
  expect(panel).toHaveClass("max-w-lg", "extra");
  expect(ref.current).toBe(panel);
  rerender(<ModalBase classes={c} title="T" defaultOpen size="sm">B</ModalBase>);
  expect(document.body.querySelector(".panel")).toHaveClass("max-w-sm");
  rerender(<ModalBase classes={c} title="T" defaultOpen size="lg">B</ModalBase>);
  expect(document.body.querySelector(".panel")).toHaveClass("max-w-2xl");
});
