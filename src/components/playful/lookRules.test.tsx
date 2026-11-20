import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { TextFieldPlayful } from "./TextFieldPlayful/TextFieldPlayful";
import { TextAreaPlayful } from "./TextAreaPlayful/TextAreaPlayful";

// Playful look rules (spec §6.1): 2px/4px borders only, no soft radius, no grotesk, no blur,
// yellow never as text.
const FORBIDDEN =
  /^(border(-[xytrbl])?|border(-[xytrbl])?-(1|8)|rounded-bh-soft|font-bh-grotesk|text-bh-yellow|backdrop-blur.*)$/;

const cases: [string, ReactElement][] = [
  ["TextFieldPlayful", <TextFieldPlayful label="Name" />],
  ["TextFieldPlayful invalid", <TextFieldPlayful label="Name" isInvalid errorMessage="Required" />],
  ["TextFieldPlayful disabled", <TextFieldPlayful label="Name" isDisabled />],
  ["TextAreaPlayful", <TextAreaPlayful label="Notes" />],
  ["TextAreaPlayful invalid", <TextAreaPlayful label="Notes" isInvalid errorMessage="Required" />],
];

it.each(cases)("%s follows the Playful look rules", (_name, element) => {
  const { container } = render(element);
  const tokens = [...container.ownerDocument.body.querySelectorAll("*")].flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );
  const offending = tokens.filter((token) => FORBIDDEN.test(token.split(":").pop()!));
  expect(offending).toEqual([]);
});
