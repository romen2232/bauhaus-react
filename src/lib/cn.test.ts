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
