import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { ModalSoft } from "./soft/ModalSoft/ModalSoft";
import { ModalPlayful } from "./playful/ModalPlayful/ModalPlayful";

type Look = "playful" | "soft" | "swiss";
type LookCase = [string, ReactElement];

const footer = <span>Footer</span>;

const cases: Record<Look, LookCase[]> = {
  playful: [
    ["ModalPlayful", <ModalPlayful title="T" defaultOpen footer={footer}>Body</ModalPlayful>],
  ],
  soft: [
    ["ModalSoft", <ModalSoft title="T" defaultOpen footer={footer}>Body</ModalSoft>],
  ],
  swiss: [],
};

// Overlays portal into document.body, so scan the whole body, not the render container.
const tokensOf = (ui: ReactElement): string[] => {
  const { unmount } = render(ui);
  const out = new Set<string>();
  for (const el of document.body.querySelectorAll("*")) {
    for (const token of (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean)) {
      out.add(token.split(":").pop() as string);
    }
  }
  unmount();
  return [...out];
};

const FORBIDDEN: Record<Look, RegExp> = {
  playful: /^(rounded(-(?!none$).*)?|font-(medium|semibold|bold)|backdrop-.*|text-bh-yellow)$/,
  soft: /^(border(-.*)?|shadow-bh-hard.*|backdrop-.*|text-bh-yellow)$/,
  // `border-t-2` is the one allowed 2px rule (the panel's top rule); see plan call 7.
  swiss:
    /^(shadow(-.*)?|-?translate-.*|rounded(-.*)?|backdrop-.*|border-(2|4|8)|border-[xrbl]-(2|4|8)|text-bh-accent|(bg|text|border|divide)-bh-(red|yellow|blue|navy|sky|pink|orange|sand|paper|charcoal))$/,
};

for (const look of ["playful", "soft", "swiss"] as const) {
  if (cases[look].length === 0) continue; // temporary until every look has a case
  describe(`${look} overlay look rules`, () => {
    it.each(cases[look])("%s", (_name, ui) => {
      const tokens = tokensOf(ui);
      expect(tokens.length).toBeGreaterThan(0);
      expect(tokens.filter((t) => FORBIDDEN[look].test(t))).toEqual([]);
    });
  });
}
