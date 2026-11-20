import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextFieldBase } from "./TextFieldBase";

const t = {
  root: "r",
  label: "",
  required: "",
  description: "",
  error: "",
  errorMarker: "",
  control: "",
  input: "",
};

it("names the input by its label and links description and error", () => {
  render(
    <TextFieldBase
      classes={t}
      label="Email"
      description="We never share it"
      isInvalid
      errorMessage="Enter a valid email"
    />,
  );
  const input = screen.getByRole("textbox", { name: /Email/ });
  expect(input).toBeInvalid();
  const described = input
    .getAttribute("aria-describedby")!
    .split(" ")
    .map((id) => document.getElementById(id)?.textContent);
  expect(described).toEqual(
    expect.arrayContaining(["We never share it", expect.stringContaining("Enter a valid email")]),
  );
});

it("marks a required field with the word (required), not an asterisk", () => {
  render(<TextFieldBase classes={t} label="Name" isRequired />);
  expect(screen.getByText("(required)")).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /Name/ })).toBeRequired();
  expect(screen.queryByText("*")).toBeNull();
});

it("does not render a stale errorMessage while the field is valid", () => {
  render(<TextFieldBase classes={t} label="Name" errorMessage="Required" />);
  expect(screen.queryByText("Required")).toBeNull();
});

it("hideLabel keeps the label as the accessible name but visually hidden", () => {
  render(<TextFieldBase classes={t} label="Search" hideLabel />);
  expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  expect(screen.getByText("Search")).toHaveClass("sr-only");
});

it("is controlled: reports the typed value and keeps the given one", async () => {
  const onChange = vi.fn();
  render(<TextFieldBase classes={t} label="Name" value="x" onChange={onChange} />);
  await userEvent.type(screen.getByRole("textbox"), "a");
  expect(onChange).toHaveBeenLastCalledWith("xa");
  expect(screen.getByRole("textbox")).toHaveValue("x");
});

it("is uncontrolled with defaultValue", async () => {
  render(<TextFieldBase classes={t} label="Name" defaultValue="ab" />);
  await userEvent.type(screen.getByRole("textbox"), "yz");
  expect(screen.getByRole("textbox")).toHaveValue("abyz");
});

it.each(["email", "password", "search", "url", "tel"] as const)("renders type %s", (type) => {
  const { container } = render(<TextFieldBase classes={t} label="Field" type={type} />);
  expect(container.querySelector(`input[type=${type}]`)).not.toBeNull();
});

it("supports disabled and read-only", () => {
  const { rerender } = render(<TextFieldBase classes={t} label="Name" isDisabled />);
  expect(screen.getByRole("textbox")).toBeDisabled();
  rerender(<TextFieldBase classes={t} label="Name" isReadOnly />);
  expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
});

it("validates live by default (aria behaviour) with a validate function", async () => {
  render(
    <TextFieldBase
      classes={t}
      label="Email"
      validate={(v) => (v.includes("@") ? true : "Needs @")}
    />,
  );
  await userEvent.type(screen.getByRole("textbox"), "abc");
  expect(screen.getByText("Needs @")).toBeInTheDocument();
});

it("two fields with the same label stay labelled by their own label", () => {
  render(
    <>
      <TextFieldBase classes={t} label="Name" defaultValue="a" />
      <TextFieldBase classes={t} label="Name" defaultValue="b" />
    </>,
  );
  const [a, b] = screen.getAllByRole("textbox", { name: "Name" }) as [HTMLElement, HTMLElement];
  expect(a).toHaveValue("a");
  expect(b).toHaveValue("b");
  expect(a.getAttribute("aria-labelledby")).not.toBe(b.getAttribute("aria-labelledby"));
});

it("posts its value in a form under name", () => {
  const { container } = render(
    <form>
      <TextFieldBase classes={t} label="Email" name="email" defaultValue="a@b.c" />
    </form>,
  );
  expect(new FormData(container.querySelector("form")!).get("email")).toBe("a@b.c");
});

it("sets data-focus-visible on keyboard focus", async () => {
  render(<TextFieldBase classes={t} label="Name" />);
  await userEvent.tab();
  expect(screen.getByRole("textbox")).toHaveAttribute("data-focus-visible");
});

it("merges className onto the root and forwards ref to it", () => {
  const ref = createRef<HTMLDivElement>();
  render(<TextFieldBase classes={t} label="Name" className="mt-4" ref={ref} />);
  const root = screen.getByRole("textbox").closest(".r")!;
  expect(root).toHaveClass("mt-4");
  expect(ref.current).toBe(root);
});
