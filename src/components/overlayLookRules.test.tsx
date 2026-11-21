import type { ReactElement } from "react";
import { act, render } from "@testing-library/react";
import { createToastQueue } from "../lib/toast";
import { ModalSwiss } from "./swiss/ModalSwiss/ModalSwiss";
import { ModalSoft } from "./soft/ModalSoft/ModalSoft";
import { ModalPlayful } from "./playful/ModalPlayful/ModalPlayful";
import { ToastRegionPlayful } from "./playful/ToastRegionPlayful/ToastRegionPlayful";
import { ToastRegionSoft } from "./soft/ToastRegionSoft/ToastRegionSoft";
import { ToastRegionSwiss } from "./swiss/ToastRegionSwiss/ToastRegionSwiss";

type Look = "playful" | "soft" | "swiss";
type LookCase = [string, ReactElement, (() => void)?];

/** A toast skin with one toast (carrying an action, so every part renders) added in an `act`. */
const toastCase = (name: string, Region: (p: { queue: ReturnType<typeof createToastQueue> }) => ReactElement): LookCase => {
  const q = createToastQueue();
  return [
    name,
    <Region queue={q} />,
    () => {
      act(() => {
        q({ title: "Saved", description: "Done", action: { label: "Undo", onAction: () => {} } });
      });
    },
  ];
};

const footer = <span>Footer</span>;

const cases: Record<Look, LookCase[]> = {
  playful: [
    ["ModalPlayful", <ModalPlayful title="T" defaultOpen footer={footer}>Body</ModalPlayful>],
    toastCase("ToastRegionPlayful", ToastRegionPlayful),
  ],
  soft: [
    ["ModalSoft", <ModalSoft title="T" defaultOpen footer={footer}>Body</ModalSoft>],
    toastCase("ToastRegionSoft", ToastRegionSoft),
  ],
  swiss: [
    ["ModalSwiss", <ModalSwiss title="T" defaultOpen footer={footer}>Body</ModalSwiss>],
    toastCase("ToastRegionSwiss", ToastRegionSwiss),
  ],
};

// Overlays portal into document.body, so scan the whole body, not the render container.
const tokensOf = (ui: ReactElement, setup?: () => void): string[] => {
  const { unmount } = render(ui);
  setup?.();
  const out = new Set<string>();
  for (const el of document.body.querySelectorAll("*")) {
    for (const token of (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean)) {
      out.add(token.split(":").pop() as string);
    }
  }
  unmount();
  return [...out];
};

const BORDER_WIDTH = /^border(-([xytrblse]))?(-\d+)?$/;

/** Every `border*` width token (border, border-N, border-{t,r,b,l,x,y,s,e}-N, with or without a width). */
const borderWidthTokens = (tokens: string[]): string[] => tokens.filter((t) => BORDER_WIDTH.test(t));

/**
 * Swiss allow-list of border widths: the panel's single 2px `border-t-2` top rule, plus the 1px
 * `border-b` (header) and `border-t` (footer) hairlines, which are exactly one 1px side each.
 * Any other width (border, border-N, border-t-4, border-y-2, border-s-2, ...) is a violation.
 */
const SWISS_ALLOWED_BORDERS = new Set(["border-t-2", "border-b", "border-t"]);
const swissBorderViolations = (tokens: string[]): string[] =>
  borderWidthTokens(tokens).filter((t) => !SWISS_ALLOWED_BORDERS.has(t));

const FORBIDDEN: Record<Look, RegExp> = {
  playful: /^(rounded(-(?!none$).*)?|font-(medium|semibold|bold)|backdrop-.*|text-bh-yellow)$/,
  // Soft has no border (width) and no shadow at all (spec 6.1), and no blur.
  soft: /^(border(-.*)?|shadow(-.*)?|inset-shadow(-.*)?|drop-shadow(-.*)?|ring(-.*)?|backdrop-.*|blur(-.*)?|text-bh-yellow)$/,
  swiss:
    /^(shadow(-.*)?|-?translate-.*|rounded(-.*)?|backdrop-.*|text-bh-accent|(bg|text|border|divide)-bh-(red|yellow|blue|navy|sky|pink|orange|sand|paper|charcoal))$/,
};

describe("Swiss border allow-list matcher", () => {
  it("accepts the single allowed border-t-2 rule and colour-only border tokens", () => {
    expect(swissBorderViolations(["border-t-2", "border-b", "border-t", "border-bh-ink", "border-bh-rule"])).toEqual([]);
  });

  it.each([
    "border", "border-0", "border-2", "border-4", "border-8",
    "border-t-4", "border-t-8", "border-b-4", "border-y", "border-y-2", "border-x-2",
    "border-r-2", "border-b-2", "border-l-2", "border-s-2", "border-e-2", "border-l", "border-s", "border-e",
  ])("flags %s", (token) => {
    expect(swissBorderViolations(["border-t-2", token])).toEqual([token]);
  });
});

describe("Playful and Swiss matchers on toast-relevant tokens", () => {
  it.each(["rounded-full", "rounded-bh-soft", "font-bold", "text-bh-yellow", "backdrop-blur-sm"])("playful flags %s", (t) => {
    expect(FORBIDDEN.playful.test(t)).toBe(true);
  });
  it.each(["rounded-none", "font-black", "shadow-bh-hard", "border-2"])("playful allows %s", (t) => {
    expect(FORBIDDEN.playful.test(t)).toBe(false);
  });
  it.each(["shadow-bh-hard", "-translate-y-3", "translate-y-2", "rounded-full", "bg-bh-blue", "bg-bh-charcoal", "text-bh-paper", "border-bh-red", "text-bh-accent"])(
    "swiss flags %s",
    (t) => {
      expect(FORBIDDEN.swiss.test(t)).toBe(true);
    },
  );
  it.each(["bg-bh-paper-white", "text-bh-ink", "border-bh-ink", "opacity-0", "underline"])("swiss allows %s", (t) => {
    expect(FORBIDDEN.swiss.test(t)).toBe(false);
  });
  it("variant prefixes are stripped, so a translate hidden behind motion-safe:starting: is still caught", () => {
    expect("motion-safe:starting:-translate-y-3".split(":").pop()).toBe("-translate-y-3");
    expect(FORBIDDEN.swiss.test("motion-safe:starting:-translate-y-3".split(":").pop() as string)).toBe(true);
  });
});

describe("Soft look matcher", () => {
  it.each([
    "shadow", "shadow-sm", "shadow-lg", "shadow-bh-hard", "shadow-bh-hard-lg",
    "inset-shadow-sm", "drop-shadow-md", "ring-2", "backdrop-blur-sm", "blur-sm", "border", "border-2", "border-t-2",
  ])("flags %s", (token) => {
    expect(FORBIDDEN.soft.test(token)).toBe(true);
  });
});

for (const look of ["playful", "soft", "swiss"] as const) {
  describe(`${look} overlay look rules`, () => {
    it.each(cases[look])("%s", (_name, ui, setup) => {
      const tokens = tokensOf(ui, setup);
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens.filter((t) => FORBIDDEN[look].test(t))).toEqual([]);
      if (look === "swiss") expect(swissBorderViolations(tokens)).toEqual([]);
    });
  });
}
