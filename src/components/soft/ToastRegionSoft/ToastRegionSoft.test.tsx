import { createRef } from "react";
import { act, render, screen } from "@testing-library/react";
import { createToastQueue } from "../../../lib/toast";
import { ToastRegionSoft } from "./ToastRegionSoft";

const setup = (props: Partial<Parameters<typeof ToastRegionSoft>[0]> = {}) => {
  const q = createToastQueue();
  render(<ToastRegionSoft queue={q} {...props} />);
  return q;
};
const toastEl = () => screen.getByRole("alertdialog");
const dot = () => toastEl().querySelector('span[aria-hidden="true"]:not(:has(*))') as HTMLElement;

it("shows a charcoal pill with paper text", () => {
  const q = setup();
  act(() => {
    q({ title: "Saved" });
  });
  expect(toastEl()).toHaveClass("rounded-full", "bg-bh-charcoal", "text-bh-paper");
  expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
});

it("tone selects the dot colour and the dot is aria-hidden decoration; default tone is neutral", () => {
  const q = setup();
  act(() => {
    q({ title: "Plain" });
  });
  expect(dot()).toHaveClass("bg-bh-paper", "size-2", "rounded-full");
  expect(dot()).toHaveAttribute("aria-hidden", "true");
  act(() => {
    q({ title: "Failed", tone: "red" });
  });
  const red = screen.getByRole("alertdialog", { name: "Failed" });
  const redDot = red.querySelector("span.size-2") as HTMLElement;
  expect(redDot).toHaveClass("bg-bh-red");
  expect(redDot).toHaveAttribute("aria-hidden", "true");
  // the meaning is in the accessible name, not the dot
  expect(red).toHaveAccessibleName("Failed");
});

it("ignores color", () => {
  const q = setup();
  act(() => {
    q({ title: "x", color: "yellow" });
  });
  expect(toastEl().className).not.toMatch(/bh-yellow/);
  expect(toastEl()).toHaveClass("bg-bh-charcoal");
});

it("inner controls use a paper ring, the toast root keeps the ink ring", () => {
  const q = setup();
  act(() => {
    q({ title: "x", action: { label: "Undo", onAction: () => {} } });
  });
  for (const name of ["Undo", "Close"]) {
    const btn = screen.getByRole("button", { name });
    expect(btn).toHaveClass("data-[focus-visible]:outline-bh-paper", "data-[focus-visible]:outline-solid", "data-[focus-visible]:outline-2");
    expect(btn.className).not.toMatch(/outline-bh-ink/);
  }
  expect(toastEl()).toHaveClass("focus-visible:outline-bh-ink");
});

it("has no borders and no hard shadow", () => {
  const q = setup();
  act(() => {
    q({ title: "x", action: { label: "Undo", onAction: () => {} } });
  });
  for (const el of document.body.querySelectorAll("*")) {
    expect(el.getAttribute("class") ?? "").not.toMatch(/(^|\s)(border|shadow)/);
  }
});

it("enters with a motion-safe starting-style slide and fade and has no exit animation", () => {
  const q = setup();
  act(() => {
    q({ title: "x" });
  });
  expect(toastEl()).toHaveClass("motion-safe:starting:opacity-0", "motion-safe:starting:translate-y-2");
  expect(toastEl().className).not.toMatch(/data-\[(entering|exiting)\]/);
});

it("forwards className and ref to the region", () => {
  const ref = createRef<HTMLDivElement>();
  const q = setup({ className: "extra", ref });
  act(() => {
    q({ title: "x" });
  });
  const region = screen.getByRole("region");
  expect(region).toHaveClass("extra");
  expect(ref.current).toBe(region);
});
