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
import { CHECKBOX_CLASSES, PLAYFUL_CHECKED, SOFT_CHECKED, SOFT_OFF, SWITCH_CLASSES, RADIO_CLASSES } from "./fields";

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

it("switch classes define every slot and markers follow the look", () => {
  for (const look of looks) {
    for (const slot of ["root", "button", "track", "thumb", "label", "error"] as const) {
      expect(SWITCH_CLASSES[look][slot]).toBeTypeOf("string");
    }
    expect(SWITCH_CLASSES[look].track).toContain("group-data-[focus-visible]:outline-bh-ink");
    expect(SWITCH_CLASSES[look].error).not.toMatch(/text-bh-(red|accent)/);
  }
  expect(SWITCH_CLASSES.playful.errorMarker).toContain("bg-bh-red");
  expect(SWITCH_CLASSES.soft.errorMarker).toContain("rounded-full");
  expect(SWITCH_CLASSES.swiss.errorMarker).toContain("bg-bh-accent");
});

it("switch tracks follow the look and only Swiss avoids translate", () => {
  expect(SWITCH_CLASSES.playful.track).toContain("border-2 border-bh-ink");
  expect(SWITCH_CLASSES.soft.track).toContain(SOFT_OFF.track);
  expect(SWITCH_CLASSES.soft.thumb).toContain(SOFT_OFF.thumb);
  expect(SWITCH_CLASSES.soft.thumb).toContain("border border-bh-charcoal");
  expect(SWITCH_CLASSES.swiss.track).toContain("data-[checked]:bg-bh-ink");
  expect(SWITCH_CLASSES.swiss.thumb).not.toMatch(/translate|rounded/);
  expect(SWITCH_CLASSES.soft.thumb).not.toContain("translate");
});

it("radio classes define every slot and markers follow the look", () => {
  for (const look of looks) {
    for (const slot of ["root", "options", "radio", "circle", "dot", "optionLabel", "label", "error"] as const) {
      expect(RADIO_CLASSES[look][slot]).toBeTypeOf("string");
    }
    expect(RADIO_CLASSES[look].circle).toContain("group-data-[focus-visible]:outline-bh-ink");
    expect(RADIO_CLASSES[look].circle).toContain("rounded-full");
    expect(RADIO_CLASSES[look].dot.split(" ")).toEqual(expect.arrayContaining(["hidden", "data-[checked]:block"]));
    expect(RADIO_CLASSES[look].dot).toContain("bg-current");
    expect(RADIO_CLASSES[look].error).not.toMatch(/text-bh-(red|accent)/);
    expect(RADIO_CLASSES[look].options).toContain("group-data-[orientation=horizontal]:flex-row");
  }
  expect(RADIO_CLASSES.playful.circle).toContain("border-2 border-bh-ink");
  expect(RADIO_CLASSES.soft.circle).toContain(SOFT_OFF.radio);
  expect(RADIO_CLASSES.swiss.circle).toContain("border border-bh-ink");
  expect(RADIO_CLASSES.swiss.circle).toContain("data-[checked]:bg-bh-ink");
  expect(RADIO_CLASSES.playful.errorMarker).toContain("bg-bh-red");
  expect(RADIO_CLASSES.soft.errorMarker).toContain("rounded-full");
  expect(RADIO_CLASSES.swiss.errorMarker).toContain("bg-bh-accent");
});
