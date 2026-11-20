import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createToastQueue, getRacQueue, toast, type ToastQueueHandle } from "./toast";

// React Aria starts a toast's timer when its <Toast> mounts, and a region pauses/resumes it.
// There is no region here, so `resumeAll()` stands in for "a region is mounted".
// Real mounted-timer behaviour is covered in ToastBase.test.tsx.
const visible = (h: ToastQueueHandle) => getRacQueue(h).visibleToasts;
const mount = (h: ToastQueueHandle) => getRacQueue(h).resumeAll();

let h: ToastQueueHandle;
beforeEach(() => {
  vi.useFakeTimers();
  h = createToastQueue();
});
afterEach(() => {
  vi.useRealTimers();
});

it("returns an id and shows the toast", () => {
  const id = h({ title: "Saved" });
  expect(typeof id).toBe("string");
  expect(visible(h).map((t) => t.key)).toContain(id);
  expect(visible(h)[0]?.content).toMatchObject({ title: "Saved" });
});

it("auto-dismisses at 5000ms by default", () => {
  h({ title: "Saved" });
  mount(h);
  vi.advanceTimersByTime(4999);
  expect(visible(h)).toHaveLength(1);
  vi.advanceTimersByTime(1);
  expect(visible(h)).toHaveLength(0);
});

it("honours a custom timeout", () => {
  h({ title: "Quick", timeout: 1000 });
  mount(h);
  vi.advanceTimersByTime(999);
  expect(visible(h)).toHaveLength(1);
  vi.advanceTimersByTime(1);
  expect(visible(h)).toHaveLength(0);
});

it("a toast with an action never auto-dismisses, even with a timeout", () => {
  h({ title: "Undo?", action: { label: "Undo", onAction() {} }, timeout: 1000 });
  mount(h);
  vi.advanceTimersByTime(60_000);
  expect(visible(h)).toHaveLength(1);
});

it("toast.close removes by id", () => {
  const a = h({ title: "A" });
  const b = h({ title: "B" });
  h.close(a);
  expect(visible(h).map((t) => t.key)).toEqual([b]);
});

it("close with an unknown id is a no-op", () => {
  h({ title: "A" });
  expect(() => h.close("nope")).not.toThrow();
  expect(visible(h)).toHaveLength(1);
});

it("shows at most 3 and queues the rest, revealing one when a visible toast closes", () => {
  const ids = ["A", "B", "C", "D"].map((title) => h({ title, timeout: 60_000 }));
  expect(visible(h)).toHaveLength(3);
  const shown = visible(h).map((t) => t.key);
  const hidden = ids.find((id) => !shown.includes(id))!;
  h.close(shown[0] as string);
  expect(visible(h)).toHaveLength(3);
  expect(visible(h).map((t) => t.key)).toContain(hidden);
});

it("createToastQueue handles are independent of each other and of the default toast", () => {
  const other = createToastQueue();
  const id = h({ title: "Mine" });
  expect(visible(other)).toHaveLength(0);
  expect(visible(toast)).toHaveLength(0);
  other.close(id);
  expect(visible(h)).toHaveLength(1);
  const sharedId = toast({ title: "Shared" });
  expect(visible(toast).map((t) => t.key)).toEqual([sharedId]);
  expect(visible(h)).toHaveLength(1);
  toast.close(sharedId);
});

it("stores color, tone, description and action as content but not the timeout", () => {
  const action = { label: "Undo", onAction() {} };
  h({ title: "T", description: "D", action, color: "red", tone: "blue", timeout: 10 });
  expect(visible(h)[0]?.content).toEqual({ title: "T", description: "D", action, color: "red", tone: "blue" });
});

it("getRacQueue rejects a foreign function", () => {
  expect(() => getRacQueue((() => "x") as unknown as ToastQueueHandle)).toThrow();
});
