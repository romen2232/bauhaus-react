import { createRef } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { createToastQueue, toast } from "../../../lib/toast";
import { ToastBase, type ToastBaseClasses } from "./ToastBase";

const classes: ToastBaseClasses = {
  region: "region",
  list: "list",
  toast: (c) => `toast ${c.color ?? ""}`.trim(),
  content: "content",
  title: "title",
  description: "description",
  action: "action",
  close: "close",
};

afterEach(() => {
  vi.useRealTimers();
});

it("renders nothing while the queue is empty", () => {
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  expect(screen.queryByRole("region")).toBeNull();
});

it("shows title and description in a region named Notifications", () => {
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "Message sent", description: "We will reply soon" });
  });
  expect(screen.getByRole("region", { name: "Notifications" })).toBeInTheDocument();
  expect(screen.getByRole("alertdialog", { name: "Message sent" })).toBeInTheDocument();
  expect(screen.getByText("We will reply soon")).toBeInTheDocument();
});

it("lets the region label be overridden", () => {
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} aria-label="Alerts" />);
  act(() => {
    q({ title: "Hi" });
  });
  expect(screen.getByRole("region", { name: "Alerts" })).toBeInTheDocument();
});

it("the close button is named Close and removes the toast", async () => {
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "Bye" });
  });
  expect(screen.getByText("Bye")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(screen.queryByText("Bye")).toBeNull();
});

it("the action button runs onAction and closes the toast", async () => {
  const q = createToastQueue();
  const onAction = vi.fn();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "Deleted", action: { label: "Undo", onAction } });
  });
  expect(screen.getByText("Deleted")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Undo" }));
  expect(onAction).toHaveBeenCalledTimes(1);
  expect(screen.queryByText("Deleted")).toBeNull();
});

it("auto-dismisses after 5000ms (fake timers)", () => {
  vi.useFakeTimers();
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "Saved" });
  });
  expect(screen.getByText("Saved")).toBeInTheDocument();
  act(() => {
    vi.advanceTimersByTime(4999);
  });
  expect(screen.getByText("Saved")).toBeInTheDocument();
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(screen.queryByText("Saved")).toBeNull();
});

it("pauses the auto-dismiss timer while focus is inside the region", () => {
  vi.useFakeTimers();
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "Saved" });
  });
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  act(() => {
    screen.getByRole("button", { name: "Close" }).focus();
  });
  act(() => {
    vi.advanceTimersByTime(60_000);
  });
  expect(screen.getByText("Saved")).toBeInTheDocument();
  act(() => {
    screen.getByRole("button", { name: "Close" }).blur();
  });
  act(() => {
    vi.advanceTimersByTime(4000);
  });
  expect(screen.queryByText("Saved")).toBeNull();
});

it("an action toast is still there after 60s", () => {
  vi.useFakeTimers();
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "Undo?", action: { label: "Undo", onAction() {} }, timeout: 1000 });
  });
  act(() => {
    vi.advanceTimersByTime(60_000);
  });
  expect(screen.getByText("Undo?")).toBeInTheDocument();
});

it("shows at most 3 toasts and reveals the 4th when one closes", async () => {
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    for (const title of ["One", "Two", "Three", "Four"]) q({ title, timeout: 60_000 });
  });
  expect(screen.getAllByRole("alertdialog")).toHaveLength(3);
  const before = screen.getAllByRole("alertdialog").map((t) => t.getAttribute("aria-labelledby"));
  expect(before).toHaveLength(3);
  expect(screen.queryByText("One")).toBeNull(); // newest first: the oldest is the one that waits
  await userEvent.click(screen.getAllByRole("button", { name: "Close" })[0] as HTMLElement);
  expect(screen.getAllByRole("alertdialog")).toHaveLength(3);
  expect(screen.getByText("One")).toBeInTheDocument();
});

it("three action toasts do not stall the queue: closing one reveals the fourth", async () => {
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    for (const title of ["A1", "A2", "A3"]) q({ title, action: { label: `Do ${title}`, onAction() {} } });
    q({ title: "Plain", timeout: 60_000 });
  });
  // newest first: Plain + A3 + A2 are visible, A1 waits
  expect(screen.queryByText("A1")).toBeNull();
  expect(screen.getAllByRole("alertdialog")).toHaveLength(3);
  act(() => {
    q({ title: "A4", action: { label: "Do A4", onAction() {} } });
  });
  expect(screen.queryByText("A1")).toBeNull();
  await userEvent.click(screen.getByRole("button", { name: "Do A4" }));
  expect(screen.queryByText("A4")).toBeNull();
  await userEvent.click(screen.getAllByRole("button", { name: "Close" })[0] as HTMLElement);
  expect(screen.getAllByRole("alertdialog")).toHaveLength(3);
  expect(screen.getByText("A1")).toBeInTheDocument();
});

it("a toast added before the region mounts appears on mount", () => {
  const q = createToastQueue();
  q({ title: "Early" });
  expect(screen.queryByText("Early")).toBeNull();
  render(<ToastBase classes={classes} queue={q} />);
  expect(screen.getByText("Early")).toBeInTheDocument();
});

it("an early toast still auto-dismisses after the region mounts", () => {
  vi.useFakeTimers();
  const q = createToastQueue();
  q({ title: "Early" });
  act(() => {
    vi.advanceTimersByTime(10_000);
  });
  render(<ToastBase classes={classes} queue={q} />);
  expect(screen.getByText("Early")).toBeInTheDocument();
  act(() => {
    vi.advanceTimersByTime(5000);
  });
  expect(screen.queryByText("Early")).toBeNull();
});

it("two regions on separate queues each show only their own toasts", () => {
  const a = createToastQueue();
  const b = createToastQueue();
  render(
    <>
      <ToastBase classes={classes} queue={a} aria-label="Region A" />
      <ToastBase classes={classes} queue={b} aria-label="Region B" />
    </>,
  );
  act(() => {
    a({ title: "For A" });
  });
  expect(screen.getByRole("region", { name: "Region A" })).toHaveTextContent("For A");
  expect(screen.queryByRole("region", { name: "Region B" })).toBeNull();
  act(() => {
    b({ title: "For B" });
  });
  expect(screen.getByRole("region", { name: "Region A" })).not.toHaveTextContent("For B");
  expect(screen.getByRole("region", { name: "Region B" })).toHaveTextContent("For B");
  expect(screen.getByRole("region", { name: "Region B" })).not.toHaveTextContent("For A");
});

it("uses the shared toast queue by default", () => {
  render(<ToastBase classes={classes} />);
  let id = "";
  act(() => {
    id = toast({ title: "Shared" });
  });
  expect(screen.getByText("Shared")).toBeInTheDocument();
  act(() => {
    toast.close(id);
  });
  expect(screen.queryByText("Shared")).toBeNull();
});

it("placement maps to edge classes", () => {
  const q = createToastQueue();
  const { rerender } = render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "Hi", timeout: 60_000 });
  });
  const region = () => screen.getByRole("region");
  expect(region()).toHaveClass("bottom-0", "end-0", "items-end");
  rerender(<ToastBase classes={classes} queue={q} placement="bottom" />);
  expect(region()).toHaveClass("bottom-0", "inset-x-0", "items-center");
  expect(region()).not.toHaveClass("end-0");
  rerender(<ToastBase classes={classes} queue={q} placement="top-end" />);
  expect(region()).toHaveClass("top-0", "end-0", "items-end");
  rerender(<ToastBase classes={classes} queue={q} placement="top" />);
  expect(region()).toHaveClass("top-0", "inset-x-0", "items-center");
  expect(region()).not.toHaveClass("bottom-0");
});

it("renders classes.marker as an aria-hidden span only when provided, and passes the toast content to classes.toast", () => {
  const q = createToastQueue();
  const toastClass = vi.fn((c: { color?: string }) => `toast-${c.color}`);
  const { unmount } = render(<ToastBase classes={{ ...classes, toast: toastClass }} queue={q} />);
  act(() => {
    q({ title: "Plain", color: "red", timeout: 60_000 });
  });
  expect(screen.getByRole("alertdialog")).toHaveClass("toast-red");
  expect(toastClass).toHaveBeenCalledWith(expect.objectContaining({ title: "Plain", color: "red" }));
  unmount();

  const q2 = createToastQueue();
  render(<ToastBase classes={{ ...classes, marker: (c) => `marker-${c.tone}` }} queue={q2} />);
  act(() => {
    q2({ title: "Dotted", tone: "blue", timeout: 60_000 });
  });
  const marker = document.querySelector(".marker-blue");
  expect(marker).not.toBeNull();
  expect(marker?.tagName).toBe("SPAN");
  expect(marker).toHaveAttribute("aria-hidden", "true");
});

it("forwards className and ref to the region", () => {
  const q = createToastQueue();
  const ref = createRef<HTMLDivElement>();
  render(<ToastBase classes={classes} queue={q} className="extra" ref={ref} />);
  act(() => {
    q({ title: "Hi", timeout: 60_000 });
  });
  expect(ref.current).toBe(screen.getByRole("region"));
  expect(screen.getByRole("region")).toHaveClass("region", "extra");
});

it("applies the class slots to list, content, title, description, action and close", () => {
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "T", description: "D", action: { label: "Go", onAction() {} } });
  });
  expect(screen.getByRole("list")).toHaveClass("list");
  expect(screen.getByRole("alert")).toHaveClass("content");
  expect(screen.getByText("T")).toHaveClass("title");
  expect(screen.getByText("D")).toHaveClass("description");
  expect(screen.getByRole("button", { name: "Go" })).toHaveClass("action");
  expect(screen.getByRole("button", { name: "Close" })).toHaveClass("close");
  expect(screen.getByRole("button", { name: "Close" }).querySelector("[aria-hidden='true']")).toHaveTextContent("×");
});

it("does not render a description or action when omitted", () => {
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "Only title", timeout: 60_000 });
  });
  expect(document.querySelector(".description")).toBeNull();
  expect(screen.getAllByRole("button")).toHaveLength(1);
});

it("pauses the timer on pointer hover (fireEvent)", () => {
  vi.useFakeTimers();
  const q = createToastQueue();
  render(<ToastBase classes={classes} queue={q} />);
  act(() => {
    q({ title: "Hover" });
  });
  const region = screen.getByRole("region");
  act(() => {
    fireEvent.pointerEnter(region, { pointerType: "mouse" });
    fireEvent.pointerMove(region, { pointerType: "mouse" });
  });
  act(() => {
    vi.advanceTimersByTime(60_000);
  });
  expect(screen.getByText("Hover")).toBeInTheDocument();
});
