import { createRef } from "react";
import type { Mock } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import { ChartFrame, type ChartFrameProps } from "./ChartFrame";

const classes = { root: "root", caption: "caption", plot: "plot", tooltip: "tip" };
const table = { headers: ["Label", "Value"], rows: [["Jan", "12"]] };

const frame = (props: Partial<ChartFrameProps> = {}) => (
  <ChartFrame
    title="Visits"
    height={200}
    table={table}
    classes={classes}
    {...props}
  >
    {() => <g data-testid="inner" />}
  </ChartFrame>
);
const renderFrame = (props: Partial<ChartFrameProps> = {}) => render(frame(props));

afterEach(() => {
  vi.unstubAllGlobals();
});

it("names the figure after the title and shows the caption", () => {
  renderFrame({ title: "Visits per month" });
  expect(screen.getByRole("figure", { name: "Visits per month" })).toBeInTheDocument();
  expect(screen.getByText("Visits per month", { selector: "figcaption" })).not.toHaveClass("sr-only");
});

it("hideTitle keeps the name but hides the caption visually", () => {
  renderFrame({ title: "Visits", hideTitle: true });
  expect(screen.getByRole("figure", { name: "Visits" })).toBeInTheDocument();
  expect(screen.getByText("Visits", { selector: "figcaption" })).toHaveClass("sr-only");
});

it("exposes a visually hidden data table to assistive tech", () => {
  renderFrame({
    table: { headers: ["Label", "Value"], rows: [["Jan", "12"], ["Feb", "40"]], footer: ["Total", "52"] },
  });
  const tbl = screen.getByRole("table", { name: "Visits" });
  expect(tbl).toHaveClass("sr-only");
  expect(tbl).not.toHaveAttribute("aria-hidden");
  expect(
    within(tbl)
      .getAllByRole("row")
      .map((r) => [...r.querySelectorAll("th, td")].map((c) => c.textContent)),
  ).toEqual([["Label", "Value"], ["Jan", "12"], ["Feb", "40"], ["Total", "52"]]);
  expect(within(tbl).getByRole("rowheader", { name: "Jan" })).toBeInTheDocument();
});

it("hides the svg from assistive tech and keeps it free of focusable elements", () => {
  const { container } = renderFrame();
  const svg = container.querySelector("svg")!;
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg.querySelectorAll("a, button, [tabindex]")).toHaveLength(0);
});

it("uses the 320px fallback when nothing can be measured (jsdom)", () => {
  const { container } = renderFrame({ height: 200 });
  expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 320 200");
  expect(container.querySelector("svg")).toHaveAttribute("width", "320");
});

function stubObserver() {
  const state: { cb: ResizeObserverCallback | null; disconnect: Mock<() => void> } = {
    cb: null,
    disconnect: vi.fn<() => void>(),
  };
  class FakeObserver {
    constructor(cb: ResizeObserverCallback) {
      state.cb = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {
      state.disconnect();
    }
  }
  vi.stubGlobal("ResizeObserver", FakeObserver);
  return state;
}
const resize = (state: ReturnType<typeof stubObserver>, width: number) =>
  act(() => {
    state.cb?.([{ contentRect: { width } } as ResizeObserverEntry], {} as ResizeObserver);
  });

it("re-renders at the measured width instead of scaling", () => {
  const state = stubObserver();
  const { container } = renderFrame({ height: 200 });
  resize(state, 600);
  expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 600 200");
  expect(container.querySelector("svg")).toHaveAttribute("width", "600");
});

it("ignores a measured width of 0 and disconnects on unmount", () => {
  const state = stubObserver();
  const { container, unmount } = renderFrame({ height: 200 });
  resize(state, 0);
  expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 320 200");
  unmount();
  expect(state.disconnect).toHaveBeenCalledTimes(1);
});

it("renders the tooltip only when given, as aria-hidden", () => {
  const { rerender } = renderFrame({ tooltip: null });
  expect(screen.queryByText("Feb: 40")).toBeNull();
  rerender(frame({ tooltip: { x: 40, y: 20, text: "Feb: 40" } }));
  expect(screen.getByText("Feb: 40")).toHaveAttribute("aria-hidden", "true");
});

it("forwards className (merged last) and ref to the figure", () => {
  const ref = createRef<HTMLElement>();
  renderFrame({ className: "x", ref });
  const figure = screen.getByRole("figure");
  expect(figure).toHaveClass("root", "x");
  expect(ref.current).toBeInstanceOf(HTMLElement);
  expect(ref.current?.tagName).toBe("FIGURE");
});
