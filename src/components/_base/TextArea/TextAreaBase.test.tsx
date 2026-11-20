import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextAreaBase } from "./TextAreaBase";

const t = {
  root: "r",
  label: "",
  required: "",
  description: "",
  error: "",
  errorMarker: "",
  control: "",
  textarea: "",
};

it("names the input by its label and links description and error", () => {
  render(
    <TextAreaBase
      classes={t}
      label="Notes"
      description="We never share it"
      isInvalid
      errorMessage="Enter a valid email"
    />,
  );
  const input = screen.getByRole("textbox", { name: /Notes/ });
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
  render(<TextAreaBase classes={t} label="Notes" isRequired />);
  expect(screen.getByText("(required)")).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /Notes/ })).toBeRequired();
  expect(screen.queryByText("*")).toBeNull();
});

it("does not render a stale errorMessage while the field is valid", () => {
  render(<TextAreaBase classes={t} label="Notes" errorMessage="Required" />);
  expect(screen.queryByText("Required")).toBeNull();
});

it("hideLabel keeps the label as the accessible name but visually hidden", () => {
  render(<TextAreaBase classes={t} label="Notes" hideLabel />);
  expect(screen.getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
  expect(screen.getByText("Notes")).toHaveClass("sr-only");
});

it("is controlled: reports the typed value and keeps the given one", async () => {
  const onChange = vi.fn();
  render(<TextAreaBase classes={t} label="Notes" value="x" onChange={onChange} />);
  await userEvent.type(screen.getByRole("textbox"), "a");
  expect(onChange).toHaveBeenLastCalledWith("xa");
  expect(screen.getByRole("textbox")).toHaveValue("x");
});

it("is uncontrolled with defaultValue", async () => {
  render(<TextAreaBase classes={t} label="Notes" defaultValue="ab" />);
  await userEvent.type(screen.getByRole("textbox"), "yz");
  expect(screen.getByRole("textbox")).toHaveValue("abyz");
});

it("supports disabled and read-only", () => {
  const { rerender } = render(<TextAreaBase classes={t} label="Notes" isDisabled />);
  expect(screen.getByRole("textbox")).toBeDisabled();
  rerender(<TextAreaBase classes={t} label="Notes" isReadOnly />);
  expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
});

it("validates live by default (aria behaviour) with a validate function", async () => {
  render(
    <TextAreaBase
      classes={t}
      label="Notes"
      validate={(v) => (v.includes("@") ? true : "Needs @")}
    />,
  );
  await userEvent.type(screen.getByRole("textbox"), "abc");
  expect(screen.getByText("Needs @")).toBeInTheDocument();
});

it("two fields with the same label stay labelled by their own label", () => {
  render(
    <>
      <TextAreaBase classes={t} label="Notes" defaultValue="a" />
      <TextAreaBase classes={t} label="Notes" defaultValue="b" />
    </>,
  );
  const [a, b] = screen.getAllByRole("textbox", { name: "Notes" }) as [HTMLElement, HTMLElement];
  expect(a).toHaveValue("a");
  expect(b).toHaveValue("b");
  expect(a.getAttribute("aria-labelledby")).not.toBe(b.getAttribute("aria-labelledby"));
});

it("posts its value in a form under name", () => {
  const { container } = render(
    <form>
      <TextAreaBase classes={t} label="Notes" name="notes" defaultValue="a@b.c" />
    </form>,
  );
  expect(new FormData(container.querySelector("form")!).get("notes")).toBe("a@b.c");
});

it("sets data-focus-visible on keyboard focus", async () => {
  render(<TextAreaBase classes={t} label="Notes" />);
  await userEvent.tab();
  expect(screen.getByRole("textbox")).toHaveAttribute("data-focus-visible");
});

it("merges className onto the root and forwards ref to it", () => {
  const ref = createRef<HTMLDivElement>();
  render(<TextAreaBase classes={t} label="Notes" className="mt-4" ref={ref} />);
  const root = screen.getByRole("textbox").closest(".r")!;
  expect(root).toHaveClass("mt-4");
  expect(ref.current).toBe(root);
});

it("renders a textarea and sets the number of rows", () => {
  render(<TextAreaBase classes={t} label="Notes" rows={6} />);
  const el = screen.getByRole("textbox");
  expect(el.tagName).toBe("TEXTAREA");
  expect(el).toHaveAttribute("rows", "6");
});

it("defaults to 3 rows", () => {
  render(<TextAreaBase classes={t} label="Notes" />);
  expect(screen.getByRole("textbox")).toHaveAttribute("rows", "3");
});

it("resolves conflicting height utilities so the later one wins", () => {
  render(<TextAreaBase classes={{ ...t, textarea: "h-11 w-full h-auto" }} label="Notes" />);
  const el = screen.getByRole("textbox");
  expect(el).toHaveClass("h-auto");
  expect(el).not.toHaveClass("h-11");
});
