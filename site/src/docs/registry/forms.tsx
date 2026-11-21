import { CalendarDate } from "@internationalized/date";
import {
  CheckboxPlayful,
  CheckboxSoft,
  CheckboxSwiss,
  DateStripPlayful,
  DateStripSoft,
  DateStripSwiss,
  NumberStepper,
  RadioGroupPlayful,
  RadioGroupSoft,
  RadioGroupSwiss,
  SelectPlayful,
  SelectSoft,
  SelectSwiss,
  SwitchPlayful,
  SwitchSoft,
  SwitchSwiss,
  TextAreaPlayful,
  TextAreaSoft,
  TextAreaSwiss,
  TextFieldPlayful,
  TextFieldSoft,
  TextFieldSwiss,
} from "bauhaus-react";
import { flag, imports, skins, text } from "./helpers";
import type { DocEntry } from "./types";

const LOOK_ITEMS = [
  { id: "playful", label: "Playful" },
  { id: "swiss", label: "Swiss" },
  { id: "soft", label: "Soft" },
];

export const FORMS: DocEntry[] = [
  {
    slug: "text-field",
    title: "TextField",
    group: "Forms",
    purpose: "A single-line text input with a label, a description and an error message, all linked for assistive tech.",
    principles: ["p2", "p10"],
    looks: skins(
      "TextField",
      { playful: TextFieldPlayful, swiss: TextFieldSwiss, soft: TextFieldSoft },
      (C, v) => (
        <C
          label={text(v, "label")}
          placeholder="you@studio.com"
          description="We never share it."
          isDisabled={flag(v, "disabled")}
          isInvalid={flag(v, "invalid")}
          errorMessage={flag(v, "invalid") ? "Enter a valid email address." : undefined}
        />
      ),
      (n) => `${imports(n)}\n\n<${n} label="Email" type="email" description="We never share it." />`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Email" },
      { prop: "disabled", kind: "boolean", initial: false },
      { prop: "invalid", kind: "boolean", initial: false },
    ],
    dos: ["Always give a visible label; use hideLabel only when context names the field.", "Say what is wrong and how to fix it in errorMessage."],
    donts: ["Do not use placeholder text as the label.", "Do not mark a field invalid before the person has had a chance to type."],
    a11y: ["Label, description and error are associated with the input through React Aria.", "Invalid state is conveyed by text and a state attribute, not colour alone."],
  },
  {
    slug: "text-area",
    title: "TextArea",
    group: "Forms",
    purpose: "A multi-line text input. Same label, description and validation behaviour as TextField.",
    principles: ["p2", "p10"],
    looks: skins(
      "TextArea",
      { playful: TextAreaPlayful, swiss: TextAreaSwiss, soft: TextAreaSoft },
      (C, v) => <C label={text(v, "label")} rows={3} placeholder="Tell us about the project" isDisabled={flag(v, "disabled")} />,
      (n) => `${imports(n)}\n\n<${n} label="Message" rows={4} />`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Message" },
      { prop: "disabled", kind: "boolean", initial: false },
    ],
    dos: ["Set rows to the length you expect, so it does not look empty or cramped."],
    donts: ["Do not rely on a character counter alone to explain a limit."],
    a11y: ["Same label wiring as TextField.", "Resizing is left to the browser; text zooms with the page."],
  },
  {
    slug: "select",
    title: "Select",
    group: "Forms",
    purpose: "Pick one option from a list. Built on React Aria's Select, so it has full keyboard and screen reader support.",
    principles: ["p2", "p10"],
    looks: skins(
      "Select",
      { playful: SelectPlayful, swiss: SelectSwiss, soft: SelectSoft },
      (C, v) => <C label={text(v, "label")} items={LOOK_ITEMS} placeholder="Choose a look" isDisabled={flag(v, "disabled")} className="w-56" />,
      (n) => `${imports(n)}\n\n<${n}\n  label="Look"\n  items={[{ id: "playful", label: "Playful" }, { id: "swiss", label: "Swiss" }]}\n/>`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Look" },
      { prop: "disabled", kind: "boolean", initial: false },
    ],
    dos: ["Use for four or more options; fewer reads better as a radio group."],
    donts: ["Do not nest a select inside another overlay on small screens."],
    a11y: ["Arrow keys move through options; type-ahead jumps to a match.", "The popover traps focus and Escape returns it to the trigger."],
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    group: "Forms",
    purpose: "Toggle one option on or off, or show a mixed state for a parent of several options.",
    principles: ["p2", "p4"],
    looks: skins(
      "Checkbox",
      { playful: CheckboxPlayful, swiss: CheckboxSwiss, soft: CheckboxSoft },
      (C, v) => <C label={text(v, "label")} defaultSelected isDisabled={flag(v, "disabled")} isIndeterminate={flag(v, "indeterminate")} />,
      (n) => `${imports(n)}\n\n<${n} label="Send me the newsletter" defaultSelected />`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Send me the newsletter" },
      { prop: "disabled", kind: "boolean", initial: false },
      { prop: "indeterminate", kind: "boolean", initial: false },
    ],
    dos: ["Make the whole label clickable: it already is."],
    donts: ["Do not use a checkbox for an action that applies immediately; use a switch."],
    a11y: ["Space toggles it. Indeterminate is announced as mixed.", "The box has a 3:1 contrast against its ground."],
  },
  {
    slug: "radio-group",
    title: "RadioGroup",
    group: "Forms",
    purpose: "Choose exactly one option from a short list, all visible at once.",
    principles: ["p2", "p4"],
    looks: skins(
      "RadioGroup",
      { playful: RadioGroupPlayful, swiss: RadioGroupSwiss, soft: RadioGroupSoft },
      (C, v) => (
        <C
          label={text(v, "label")}
          defaultValue="swiss"
          options={LOOK_ITEMS.map((i) => ({ value: i.id, label: i.label }))}
          orientation={text(v, "orientation")}
          isDisabled={flag(v, "disabled")}
        />
      ),
      (n) => `${imports(n)}\n\n<${n}\n  label="Look"\n  options={[{ value: "playful", label: "Playful" }, { value: "swiss", label: "Swiss" }]}\n/>`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Look" },
      { prop: "orientation", kind: "select", options: ["vertical", "horizontal"], initial: "vertical" },
      { prop: "disabled", kind: "boolean", initial: false },
    ],
    dos: ["Preselect the safest option when there is one."],
    donts: ["Do not use more than five options; switch to Select."],
    a11y: ["Arrow keys move and select; Tab leaves the group.", "The group has a name from its label."],
  },
  {
    slug: "switch",
    title: "Switch",
    group: "Forms",
    purpose: "A setting that takes effect immediately when flipped.",
    principles: ["p2", "p4"],
    looks: skins(
      "Switch",
      { playful: SwitchPlayful, swiss: SwitchSwiss, soft: SwitchSoft },
      (C, v) => <C label={text(v, "label")} defaultSelected isDisabled={flag(v, "disabled")} />,
      (n) => `${imports(n)}\n\n<${n} label="Weekly digest" defaultSelected />`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Weekly digest" },
      { prop: "disabled", kind: "boolean", initial: false },
    ],
    dos: ["Label what it turns on, not the action: \"Weekly digest\", not \"Toggle digest\"."],
    donts: ["Do not use a switch inside a form that needs a submit button."],
    a11y: ["Exposed as a switch role; Space flips it.", "State is shown by position and label, not colour alone."],
  },
  {
    slug: "date-strip",
    title: "DateStrip",
    group: "Forms",
    purpose: "A row of consecutive days to pick from, for booking and scheduling screens.",
    principles: ["p8", "p2"],
    looks: skins(
      "DateStrip",
      { playful: DateStripPlayful, swiss: DateStripSwiss, soft: DateStripSoft },
      (C, v) => (
        <C
          label={text(v, "label")}
          start={new CalendarDate(2026, 11, 16)}
          days={Number(text(v, "days")) || 7}
          defaultValue={new CalendarDate(2026, 11, 18)}
        />
      ),
      (n) =>
        `import { CalendarDate } from "@internationalized/date";\n${imports(n)}\n\n<${n} label="Pick a day" start={new CalendarDate(2026, 11, 16)} days={7} />`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Pick a day" },
      { prop: "days", kind: "select", options: ["5", "7", "10"], initial: "7" },
    ],
    dos: ["Limit the range with minValue and maxValue when some days are unavailable."],
    donts: ["Do not use it for dates far from today; use a full calendar."],
    a11y: ["A radio group of days: arrow keys move, each day has a full spoken date.", "Weekday names follow the locale prop."],
  },
  {
    slug: "number-stepper",
    title: "NumberStepper",
    group: "Forms",
    purpose: "The current number in large type, with the next numbers ghosted behind it. Decorative.",
    principles: ["p6", "p9"],
    agnostic: {
      exportNames: ["NumberStepper"],
      demo: (v) => <NumberStepper value={Number(text(v, "value")) || 1} />,
      snippet: `${imports("NumberStepper")}\n\n<NumberStepper value={2} />`,
    },
    controls: [{ prop: "value", kind: "text", initial: "2" }],
    dos: ["Use it to number sections in order; ahead sets how many ghost numbers show."],
    donts: ["Do not use it as an editable number input."],
    a11y: ["Decorative: pair it with text that names the step."],
  },
];
