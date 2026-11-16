import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { ButtonSoft } from "./ButtonSoft/ButtonSoft";
import { IconButtonSoft } from "./IconButtonSoft/IconButtonSoft";

// Soft look rules (spec §6.1): no borders, no hard shadow, no movement, yellow never as text.
const FORBIDDEN = /^(border(-[xytrbl])?(-\d+)?|shadow-bh-hard.*|-?translate-.*|text-bh-yellow)$/;

const cases: [string, ReactElement][] = [
  ["ButtonSoft solid", <ButtonSoft>Go</ButtonSoft>],
  ["ButtonSoft outline", <ButtonSoft variant="outline">Go</ButtonSoft>],
  ["ButtonSoft color", <ButtonSoft variant="color" tone="yellow">Go</ButtonSoft>],
  ["IconButtonSoft solid", <IconButtonSoft aria-label="Add">+</IconButtonSoft>],
  ["IconButtonSoft outline", <IconButtonSoft aria-label="Add" variant="outline">+</IconButtonSoft>],
];

it.each(cases)("%s follows the Soft look rules", (_name, element) => {
  const { container } = render(element);
  const tokens = [...container.querySelectorAll("*")].flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );
  const offending = tokens.filter((t) => FORBIDDEN.test(t.split(":").pop()!));
  expect(offending).toEqual([]);
});
