import { cn } from "./cn";

it.each([
  [["bg-bh-red", "bg-bh-blue"], "bg-bh-blue"],
  [["text-bh-ink", "text-bh-paper"], "text-bh-paper"],
  [["border-bh-ink", "border-bh-red"], "border-bh-red"],
  [["font-bh-display", "font-bh-body"], "font-bh-body"],
  [["shadow-bh-hard", "shadow-none"], "shadow-none"],
  [["animate-bh-spin", "animate-none"], "animate-none"],
])("later class wins: %j", (input, expected) => {
  expect(cn(...input)).toBe(expected);
});

it("does not treat a bh text color and a font size as conflicting", () => {
  expect(cn("text-bh-ink", "text-xl")).toBe("text-bh-ink text-xl");
});

it("drops falsy values", () => {
  expect(cn("a", false, undefined, "b")).toBe("a b");
});

it.each([
  [["bg-bh-red", "bg-bh-sand"], "bg-bh-sand"],
  [["text-bh-ink", "text-bh-accent"], "text-bh-accent"],
  [["rounded-full", "rounded-bh-soft"], "rounded-bh-soft"],
  [["font-bh-display", "font-bh-grotesk"], "font-bh-grotesk"],
  [["animate-bh-spin", "animate-bh-slide"], "animate-bh-slide"],
  [["animate-bh-slide", "animate-bh-grow"], "animate-bh-grow"],
])("0.2 tokens merge: %j", (input, expected) => {
  expect(cn(...input)).toBe(expected);
});
