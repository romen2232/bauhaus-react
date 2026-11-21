import { createRef } from "react";
import { act, render, screen } from "@testing-library/react";
import { createToastQueue } from "../../../lib/toast";
import { ToastRegionSwiss } from "./ToastRegionSwiss";

const setup = (props: Partial<Parameters<typeof ToastRegionSwiss>[0]> = {}) => {
  const q = createToastQueue();
  render(<ToastRegionSwiss queue={q} {...props} />);
  return q;
};
const toastEl = () => screen.getByRole("alertdialog");

it("shows a paper-white toast with a 2px ink top rule", () => {
  const q = setup();
  act(() => {
    q({ title: "Saved" });
  });
  expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
  expect(toastEl()).toHaveClass("bg-bh-paper-white", "text-bh-ink", "border-t-2", "border-bh-ink");
});

it("the action is underlined text, not a filled button", () => {
  const q = setup();
  act(() => {
    q({ title: "x", action: { label: "Undo", onAction: () => {} } });
  });
  const action = screen.getByRole("button", { name: "Undo" });
  expect(action).toHaveClass("underline");
  expect(action.className).not.toMatch(/(^|\s)bg-bh-/);
});

it("ignores color and tone", () => {
  const q = setup();
  act(() => {
    q({ title: "x", color: "red", tone: "blue" });
  });
  expect(document.body.innerHTML).not.toMatch(/bh-(red|blue|yellow)/);
  expect(toastEl().querySelector("span.size-2")).toBeNull();
});

it("uses the Swiss focus ring on action and close", () => {
  const q = setup();
  act(() => {
    q({ title: "x", action: { label: "Undo", onAction: () => {} } });
  });
  for (const name of ["Undo", "Close"]) {
    expect(screen.getByRole("button", { name })).toHaveClass("data-[focus-visible]:outline-solid", "data-[focus-visible]:outline-bh-ink");
  }
});

it("has no radius, shadow or translate, and no accent", () => {
  const q = setup();
  act(() => {
    q({ title: "x", action: { label: "Undo", onAction: () => {} } });
  });
  expect(document.body.innerHTML).not.toMatch(/(^|[\s"])(rounded|shadow|-?translate|bh-accent)/);
});

it("enters with a clip-path wipe, motion-safe, and has no exit animation", () => {
  const q = setup();
  act(() => {
    q({ title: "x" });
  });
  expect(toastEl()).toHaveClass("motion-safe:starting:[clip-path:inset(0_0_100%_0)]");
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
