import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextFieldPlayful } from "./TextFieldPlayful/TextFieldPlayful";
import { TextAreaPlayful } from "./TextAreaPlayful/TextAreaPlayful";
import { CheckboxPlayful } from "./CheckboxPlayful/CheckboxPlayful";
import { SwitchPlayful } from "./SwitchPlayful/SwitchPlayful";
import { RadioGroupPlayful } from "./RadioGroupPlayful/RadioGroupPlayful";
import { SelectPlayful } from "./SelectPlayful/SelectPlayful";

// Playful look rules (spec §6.1): 2px/4px borders only, no soft radius, no grotesk, no blur,
// yellow never as text.
const FORBIDDEN =
  /^(border(-[xytrbl])?|border(-[xytrbl])?-(1|8)|rounded-bh-soft|font-bh-grotesk|text-bh-yellow|backdrop-blur.*)$/;

const radioOptions = [
  { value: "a", label: "Email" },
  { value: "b", label: "Phone" },
];

const selectItems = [
  { id: "a", label: "Apple" },
  { id: "b", label: "Banana" },
];

const cases: [string, ReactElement][] = [
  ["TextFieldPlayful", <TextFieldPlayful label="Name" />],
  ["TextFieldPlayful invalid", <TextFieldPlayful label="Name" isInvalid errorMessage="Required" />],
  ["TextFieldPlayful disabled", <TextFieldPlayful label="Name" isDisabled />],
  ["TextAreaPlayful", <TextAreaPlayful label="Notes" />],
  ["TextAreaPlayful invalid", <TextAreaPlayful label="Notes" isInvalid errorMessage="Required" />],
  ["CheckboxPlayful", <CheckboxPlayful label="Terms" />],
  ["CheckboxPlayful invalid", <CheckboxPlayful label="Terms" isInvalid errorMessage="Required" />],
  ["CheckboxPlayful selected", <CheckboxPlayful label="Terms" defaultSelected color="yellow" />],
  ["SwitchPlayful", <SwitchPlayful label="Alerts" />],
  ["SwitchPlayful invalid", <SwitchPlayful label="Alerts" isInvalid errorMessage="Required" />],
  ["SwitchPlayful on", <SwitchPlayful label="Alerts" defaultSelected color="yellow" />],
  ["RadioGroupPlayful", <RadioGroupPlayful label="Via" options={radioOptions} />],
  ["RadioGroupPlayful invalid", <RadioGroupPlayful label="Via" options={radioOptions} isInvalid errorMessage="Required" />],
  ["RadioGroupPlayful selected", <RadioGroupPlayful label="Via" options={radioOptions} defaultValue="a" color="yellow" />],
  ["SelectPlayful", <SelectPlayful label="Fruit" items={selectItems} />],
  ["SelectPlayful invalid", <SelectPlayful label="Fruit" items={selectItems} isInvalid errorMessage="Required" />],
  ["SelectPlayful selected", <SelectPlayful label="Fruit" items={selectItems} defaultSelectedKey="a" />],
];

it.each(cases)("%s follows the Playful look rules", (_name, element) => {
  const { container } = render(element);
  const tokens = [...container.ownerDocument.body.querySelectorAll("*")].flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );
  const offending = tokens.filter((token) => FORBIDDEN.test(token.split(":").pop()!));
  expect(offending).toEqual([]);
});

it("SelectPlayful popover follows the Playful look rules when open", async () => {
  render(<SelectPlayful label="Fruit" items={selectItems} defaultSelectedKey="a" />);
  await userEvent.click(screen.getByRole("button", { name: /Fruit/ }));
  const tokens = [...document.body.querySelectorAll("*")].flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );
  expect(tokens.filter((token) => FORBIDDEN.test(token.split(":").pop()!))).toEqual([]);
});
