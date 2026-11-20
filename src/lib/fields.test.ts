import { FIELD_CLASSES, SELECT_CLASSES } from "./fields";

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

it("select classes define every slot and the Playful look follows the spec", () => {
  for (const look of looks) {
    for (const slot of [
      "root", "label", "required", "description", "error", "errorMarker",
      "control", "trigger", "value", "chevron", "popover", "listbox", "option", "check", "empty",
    ] as const) {
      expect(SELECT_CLASSES[look][slot]).toBeTypeOf("string");
      // Only the wrapper `control` (Soft, Swiss) and the Swiss `errorMarker` are legitimately unstyled.
      const unstyled =
        (slot === "control" && look !== "playful") || (slot === "errorMarker" && look === "swiss");
      if (!unstyled) expect(SELECT_CLASSES[look][slot]).not.toBe("");
    }
  }
  const p = SELECT_CLASSES.playful;
  expect(p.trigger).toContain(FIELD_CLASSES.playful.input);
  expect(p.trigger).toContain("justify-between");
  expect(p.value).toContain("data-[placeholder]:text-bh-muted-text");
  for (const c of ["border-2", "border-bh-ink", "shadow-bh-hard", "bg-bh-paper-white", "min-w-(--trigger-width)"]) {
    expect(p.popover).toContain(c);
  }
  expect(p.option).toContain("data-[focused]:bg-bh-yellow");
  expect(p.option).toContain("data-[focus-visible]:outline-bh-ink");
  expect(p.error).not.toMatch(/text-bh-(red|accent)/);
  expect(p.errorMarker).toContain("bg-bh-red");
});

it("select popovers: Soft is borderless, Swiss has a 1px rule, neither has a shadow", () => {
  expect(SELECT_CLASSES.soft.popover).not.toContain("shadow");
  expect(SELECT_CLASSES.swiss.popover).not.toContain("shadow");
  expect(SELECT_CLASSES.soft.popover).not.toMatch(/(^|\s)border/);
  for (const c of ["rounded-bh-soft", "bg-bh-sand", "min-w-(--trigger-width)"]) {
    expect(SELECT_CLASSES.soft.popover).toContain(c);
  }
  for (const c of ["rounded-none", "border", "border-bh-rule", "bg-bh-paper-white", "min-w-(--trigger-width)"]) {
    expect(SELECT_CLASSES.swiss.popover).toContain(c);
  }
});

it("select triggers share one layout and reuse the look's field surface", () => {
  for (const look of looks) {
    expect(SELECT_CLASSES[look].trigger).toContain("flex items-center justify-between text-left");
  }
  expect(SELECT_CLASSES.soft.trigger).toContain(FIELD_CLASSES.soft.input);
  for (const c of ["border-b", "border-bh-ink", "bg-transparent", "rounded-none"]) {
    expect(SELECT_CLASSES.swiss.trigger).toContain(c);
  }
});

it("Swiss select trigger signals invalid through the root group, with exactly one accent token", () => {
  const { trigger } = SELECT_CLASSES.swiss;
  expect(trigger).toContain("group-data-[invalid]:border-bh-accent");
  // The trigger button never emits data-invalid (RAC 1.22.1); a plain data-[invalid]: variant would never fire.
  expect(trigger).not.toMatch(/(^|\s)data-\[invalid\]:/);
  expect(trigger.split(/\s+/).filter((t) => t.includes("bh-accent"))).toHaveLength(1);
  expect(SELECT_CLASSES.swiss.option).not.toContain("bh-accent");
});

it("Soft select options and empty state avoid muted-text on sand, and no select slot uses yellow text", () => {
  expect(SELECT_CLASSES.soft.empty).not.toContain("muted-text");
  expect(SELECT_CLASSES.soft.value).not.toContain("muted-text");
  expect(SELECT_CLASSES.soft.option).toContain("data-[focused]:bg-bh-charcoal");
  expect(SELECT_CLASSES.soft.option).toContain("data-[focused]:text-bh-paper");
  for (const look of looks) {
    for (const v of Object.values(SELECT_CLASSES[look])) expect(v).not.toMatch(/text-bh-yellow/);
  }
});
