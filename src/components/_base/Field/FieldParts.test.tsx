import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { TextField, Input } from "react-aria-components";
import { FieldDescription, FieldLabel, FieldMessage } from "./FieldParts";

const c = { label: "L", required: "R", description: "D", error: "E", errorMarker: "M" };

const Wrap = ({ children, ...rest }: { children: ReactNode; isInvalid?: boolean; validate?: (v: string) => string | true; defaultValue?: string }) => (
  <TextField validationBehavior="aria" {...rest}>
    {children}
    <Input />
  </TextField>
);

it("FieldLabel appends '(required)' only when required and hides visually on hideLabel", () => {
  const { rerender } = render(
    <Wrap>
      <FieldLabel classes={c}>Name</FieldLabel>
    </Wrap>,
  );
  expect(screen.queryByText("(required)")).toBeNull();
  rerender(
    <Wrap>
      <FieldLabel classes={c} isRequired>
        Name
      </FieldLabel>
    </Wrap>,
  );
  expect(screen.getByText("(required)")).toHaveClass("R");
  rerender(
    <Wrap>
      <FieldLabel classes={c} hideLabel>
        Name
      </FieldLabel>
    </Wrap>,
  );
  expect(screen.getByText("Name")).toHaveClass("sr-only");
  expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
});

it("FieldDescription renders nothing when empty", () => {
  const { container, rerender } = render(
    <Wrap>
      <FieldDescription classes={c}>{null}</FieldDescription>
    </Wrap>,
  );
  expect(container.querySelector(".D")).toBeNull();
  rerender(
    <Wrap>
      <FieldDescription classes={c}>Help</FieldDescription>
    </Wrap>,
  );
  expect(screen.getByText("Help")).toHaveClass("D");
});

it("FieldMessage shows nothing while valid, the message while invalid, and falls back to validationErrors", () => {
  const { rerender } = render(
    <Wrap>
      <FieldMessage classes={c} errorMessage="Bad" />
    </Wrap>,
  );
  expect(screen.queryByText("Bad")).toBeNull();
  rerender(
    <Wrap isInvalid>
      <FieldMessage classes={c} errorMessage="Bad" />
    </Wrap>,
  );
  expect(screen.getByText("Bad")).toBeInTheDocument();
  rerender(
    <Wrap isInvalid>
      <FieldMessage classes={c} errorMessage={(v) => `n:${v.isInvalid}`} />
    </Wrap>,
  );
  expect(screen.getByText("n:true")).toBeInTheDocument();
  rerender(
    <Wrap validate={() => "Needs @"} defaultValue="x">
      <FieldMessage classes={c} />
    </Wrap>,
  );
  expect(screen.getByText("Needs @")).toBeInTheDocument();
});

it("FieldMessage marker is aria-hidden and omitted for an empty marker class", () => {
  const { container, rerender } = render(
    <Wrap isInvalid>
      <FieldMessage classes={c} errorMessage="Bad" />
    </Wrap>,
  );
  expect(container.querySelector(".M")).toHaveAttribute("aria-hidden", "true");
  rerender(
    <Wrap isInvalid>
      <FieldMessage classes={{ ...c, errorMarker: "" }} errorMessage="Bad" />
    </Wrap>,
  );
  expect(container.querySelector("[aria-hidden]")).toBeNull();
});
