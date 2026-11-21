import { createRef } from "react";
import { act, render, screen } from "@testing-library/react";
import { createToastQueue } from "../../../lib/toast";
import { HEX, TEXT_ON } from "../../../lib/palette";
import { ToastRegionPlayful } from "./ToastRegionPlayful";

const setup = (props: Partial<Parameters<typeof ToastRegionPlayful>[0]> = {}) => {
  const q = createToastQueue();
  const utils = render(<ToastRegionPlayful queue={q} {...props} />);
  return { q, ...utils };
};
const toastEl = () => screen.getByRole("alertdialog");

it("shows a toast with its text in a Notifications region", () => {
  const { q } = setup();
  expect(screen.queryByRole("region")).toBeNull();
  act(() => {
    q({ title: "Message sent", description: "We will reply soon" });
  });
  expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
  expect(screen.getByRole("alertdialog", { name: "Message sent" })).toBeInTheDocument();
  expect(screen.getByText("We will reply soon")).toBeInTheDocument();
});

it("default colour is blue with paper text; color='yellow' gives yellow with ink text", () => {
  const { q } = setup();
  act(() => {
    q({ title: "Blue" });
  });
  expect(toastEl()).toHaveClass("bg-bh-blue", "text-bh-paper");
  act(() => {
    q({ title: "Yellow", color: "yellow" });
  });
  const yellow = screen.getByRole("alertdialog", { name: "Yellow" });
  expect(yellow).toHaveClass("bg-bh-yellow", "text-bh-ink");
  expect(yellow).not.toHaveClass("text-bh-yellow");
});

it("has a 2px ink border, the hard shadow and uppercase text", () => {
  const { q } = setup();
  act(() => {
    q({ title: "x" });
  });
  expect(toastEl()).toHaveClass("border-2", "border-bh-ink", "shadow-bh-hard", "uppercase");
});

it("ignores tone", () => {
  const { q } = setup();
  act(() => {
    q({ title: "x", tone: "red" });
  });
  expect(toastEl().className).not.toMatch(/bh-red/);
});

it("enters with a motion-safe starting-style transition and has no exit animation", () => {
  const { q } = setup();
  act(() => {
    q({ title: "x" });
  });
  expect(toastEl()).toHaveClass("motion-safe:starting:opacity-0", "motion-safe:starting:-translate-y-3");
  expect(toastEl().className).not.toMatch(/data-\[(entering|exiting)\]/);
});

it("the toast root keeps the ink focus ring", () => {
  const { q } = setup();
  act(() => {
    q({ title: "x" });
  });
  expect(toastEl()).toHaveClass("focus-visible:outline-bh-ink", "focus-visible:outline-2");
});

it("inner controls keep a visible ring in the toast's own text colour", () => {
  const { q } = setup();
  act(() => {
    q({ title: "x", action: { label: "Undo", onAction: () => {} } });
  });
  for (const name of ["Undo", "Close"]) {
    const btn = screen.getByRole("button", { name });
    expect(btn).toHaveClass("data-[focus-visible]:outline-current", "data-[focus-visible]:outline-solid", "data-[focus-visible]:outline-2");
    expect(btn.className).not.toMatch(/outline-bh-/);
  }
});

it.each(Object.keys(TEXT_ON) as (keyof typeof TEXT_ON)[])("on %s the currentColor ring is the text colour and reaches 3:1", (c) => {
  // currentColor resolves to TEXT_ON[c]; recompute its contrast against the fill from the real hex values.
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [lum(HEX[TEXT_ON[c]]), lum(HEX[c])].sort((a, b) => b - a) as [number, number];
  expect((hi + 0.05) / (lo + 0.05)).toBeGreaterThanOrEqual(3);
});

it("forwards className and ref to the region", () => {
  const ref = createRef<HTMLDivElement>();
  const { q } = setup({ className: "extra", ref });
  act(() => {
    q({ title: "x" });
  });
  const region = screen.getByRole("region");
  expect(region).toHaveClass("extra");
  expect(ref.current).toBe(region);
});
