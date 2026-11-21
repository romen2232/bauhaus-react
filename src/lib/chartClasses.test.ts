import { CHART_CLASSES } from "./chartClasses";

it("keeps the look rules in the shared maps", () => {
  expect(CHART_CLASSES.playful.baseline).toContain("stroke-bh-ink");
  expect(CHART_CLASSES.playful.grid).toBe("");
  expect(CHART_CLASSES.soft.grid).toBe("");
  expect(CHART_CLASSES.swiss.grid).toContain("stroke-bh-rule");
  expect(CHART_CLASSES.swiss.tick).toContain("fill-bh-muted-text");
});
it("uses no HEX and no interpolated class", () => {
  expect(JSON.stringify(CHART_CLASSES)).not.toMatch(/#[0-9a-f]{3,6}|\$\{/i);
});
it("Swiss strings stay inside the Swiss look", () => {
  const swiss = Object.values(CHART_CLASSES.swiss).join(" ");
  expect(swiss).not.toMatch(/rounded|shadow|font-bh-(display|body)|font-(medium|semibold|bold|extrabold|black)|border-(2|4|8)/);
});
