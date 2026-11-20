import { FIELD_CLASSES } from "./fields";

const looks = ["playful", "soft", "swiss"] as const;

it.each(looks)("%s fields define every slot", (look) => {
  for (const slot of [
    "root",
    "label",
    "required",
    "description",
    "control",
    "input",
    "textarea",
    "error",
    "errorMarker",
  ] as const) {
    expect(slot in FIELD_CLASSES[look]).toBe(true);
  }
});

it("never styles an error message in red text", () => {
  for (const look of looks) {
    expect(FIELD_CLASSES[look].error).not.toMatch(/text-bh-(red|accent)/);
  }
});

it("Playful and Soft markers are red, Swiss text fields have no marker", () => {
  expect(FIELD_CLASSES.playful.errorMarker).toContain("bg-bh-red");
  expect(FIELD_CLASSES.soft.errorMarker).toContain("bg-bh-red");
  expect(FIELD_CLASSES.swiss.errorMarker).toBe("");
});

it("Swiss invalid turns the rule to the accent, Playful keeps the ink border", () => {
  expect(FIELD_CLASSES.swiss.input).toContain("data-[invalid]:border-bh-accent");
  expect(FIELD_CLASSES.playful.input).not.toMatch(/data-\[invalid\]:border/);
});

it("Soft textarea is rounded-bh-soft, not a pill", () => {
  expect(FIELD_CLASSES.soft.textarea).toContain("rounded-bh-soft");
  expect(FIELD_CLASSES.soft.textarea).not.toContain("rounded-full");
});
