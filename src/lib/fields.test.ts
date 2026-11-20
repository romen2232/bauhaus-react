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

import { FILL_CLASSES, SOFT_TONE_CLASSES, type FillColor, type SoftTone } from "./palette";
import { CHECKBOX_CLASSES, PLAYFUL_CHECKED, SOFT_CHECKED, SOFT_OFF } from "./fields";

const prefix = (s: string) => s.split(" ").map((t) => `data-[checked]:${t}`).join(" ");

it.each(Object.keys(FILL_CLASSES) as FillColor[])(
  "PLAYFUL_CHECKED.%s mirrors FILL_CLASSES with a data-[checked] prefix",
  (c) => {
    expect(PLAYFUL_CHECKED[c]).toBe(prefix(FILL_CLASSES[c]));
  },
);

it.each(Object.keys(SOFT_TONE_CLASSES) as SoftTone[])(
  "SOFT_CHECKED.%s mirrors SOFT_TONE_CLASSES with a data-[checked] prefix",
  (t) => {
    expect(SOFT_CHECKED[t]).toBe(prefix(SOFT_TONE_CLASSES[t]));
  },
);

it("Soft unchecked controls carry a 1px charcoal outline", () => {
  for (const k of ["checkbox", "radio", "track"] as const) {
    expect(SOFT_OFF[k]).toContain("border border-bh-charcoal");
  }
  expect(SOFT_OFF.thumb).toBe("bg-bh-charcoal");
});

it("checkbox classes define every slot and markers follow the look", () => {
  for (const look of looks) {
    for (const slot of ["root", "button", "box", "indicator", "label", "error"] as const) {
      expect(CHECKBOX_CLASSES[look][slot]).toBeTypeOf("string");
    }
    expect(CHECKBOX_CLASSES[look].box).toContain("group-data-[focus-visible]:outline-bh-ink");
    expect(CHECKBOX_CLASSES[look].error).not.toMatch(/text-bh-(red|accent)/);
  }
  expect(CHECKBOX_CLASSES.playful.errorMarker).toContain("bg-bh-red");
  expect(CHECKBOX_CLASSES.soft.errorMarker).toContain("bg-bh-red");
  expect(CHECKBOX_CLASSES.soft.errorMarker).toContain("rounded-full");
  expect(CHECKBOX_CLASSES.swiss.errorMarker).toContain("bg-bh-accent");
  expect(CHECKBOX_CLASSES.swiss.box).toContain("data-[checked]:bg-bh-ink");
});
