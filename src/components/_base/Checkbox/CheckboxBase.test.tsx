import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckboxBase } from "./CheckboxBase";

const t = {
  root: "r",
  label: "",
  required: "",
  description: "",
  error: "",
  errorMarker: "",
  button: "",
  box: "b",
  indicator: "",
};

it("is a named checkbox with a visible (required) marker", () => {
  render(<CheckboxBase classes={t} label="Subscribe" isRequired />);
  expect(screen.getByRole("checkbox", { name: /Subscribe/ })).toBeRequired();
  expect(screen.getByText("(required)")).toBeInTheDocument();
});

it("toggles with Space and reports isSelected", async () => {
  const onChange = vi.fn();
  render(<CheckboxBase classes={t} label="Subscribe" onChange={onChange} />);
  await userEvent.tab();
  await userEvent.keyboard(" ");
  expect(onChange).toHaveBeenLastCalledWith(true);
  expect(screen.getByRole("checkbox")).toBeChecked();
});

it("is controlled by isSelected", async () => {
  const onChange = vi.fn();
  render(<CheckboxBase classes={t} label="Subscribe" isSelected={false} onChange={onChange} />);
  await userEvent.click(screen.getByRole("checkbox"));
  expect(onChange).toHaveBeenLastCalledWith(true);
  expect(screen.getByRole("checkbox")).not.toBeChecked();
});

it("marks the box data-checked and shows a check when selected, a dash when indeterminate", () => {
  const { rerender, container } = render(<CheckboxBase classes={t} label="All" defaultSelected />);
  expect(container.querySelector(".b")).toHaveAttribute("data-checked");
  expect(container.querySelector(".b")).toHaveTextContent("✓");
  rerender(<CheckboxBase classes={t} label="All" isIndeterminate />);
  expect(container.querySelector(".b")).toHaveAttribute("data-checked");
  expect(container.querySelector(".b")).toHaveTextContent("—");
  expect(screen.getByRole("checkbox")).toBePartiallyChecked();
});

it("has no data-checked and no glyph when unchecked", () => {
  const { container } = render(<CheckboxBase classes={t} label="All" />);
  expect(container.querySelector(".b")).not.toHaveAttribute("data-checked");
  expect(container.querySelector(".b")!.textContent).toBe("");
});

it("hides the box and its glyph from assistive tech", () => {
  const { container } = render(<CheckboxBase classes={t} label="All" defaultSelected />);
  expect(container.querySelector(".b")).toHaveAttribute("aria-hidden", "true");
});

it("shows an error under the control only when invalid, linked to the input", () => {
  const { unmount } = render(
    <CheckboxBase classes={t} label="Terms" isInvalid errorMessage="Accept to continue" />,
  );
  const input = screen.getByRole("checkbox");
  expect(input).toBeInvalid();
  const described = input
    .getAttribute("aria-describedby")!
    .split(" ")
    .map((id) => document.getElementById(id)?.textContent);
  expect(described).toEqual(expect.arrayContaining([expect.stringContaining("Accept to continue")]));
  unmount();
  render(<CheckboxBase classes={t} label="Terms" errorMessage="Accept to continue" />);
  expect(screen.queryByText("Accept to continue")).toBeNull();
});

it("links the description to the input", () => {
  render(<CheckboxBase classes={t} label="Terms" description="Read them first" />);
  const ids = screen.getByRole("checkbox").getAttribute("aria-describedby")!.split(" ");
  expect(ids.map((id) => document.getElementById(id)?.textContent)).toContain("Read them first");
});

it("disabled blocks toggling", async () => {
  const onChange = vi.fn();
  render(<CheckboxBase classes={t} label="Terms" isDisabled onChange={onChange} />);
  await userEvent.click(screen.getByRole("checkbox"));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("checkbox")).toBeDisabled();
});

it("posts name and value in a form only when checked", () => {
  const first = render(
    <form>
      <CheckboxBase classes={t} label="News" name="news" value="yes" />
    </form>,
  );
  expect(new FormData(first.container.querySelector("form")!).get("news")).toBeNull();
  first.unmount();
  const second = render(
    <form>
      <CheckboxBase classes={t} label="News" name="news" value="yes" defaultSelected />
    </form>,
  );
  expect(new FormData(second.container.querySelector("form")!).get("news")).toBe("yes");
});

it("shows keyboard focus on the label wrapper", async () => {
  render(<CheckboxBase classes={t} label="Terms" />);
  await userEvent.tab();
  expect(screen.getByRole("checkbox").closest("label")).toHaveAttribute("data-focus-visible");
});

it("hideLabel keeps the accessible name", () => {
  render(<CheckboxBase classes={t} label="Terms" hideLabel />);
  expect(screen.getByRole("checkbox", { name: "Terms" })).toBeInTheDocument();
  expect(screen.getByText("Terms")).toHaveClass("sr-only");
});

it("merges className onto the root and forwards ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<CheckboxBase classes={t} label="Terms" className="mt-4" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toHaveClass("r", "mt-4");
  expect(ref.current!.contains(screen.getByRole("checkbox"))).toBe(true);
});

it("does not nest a label element inside the button label", () => {
  const { container } = render(<CheckboxBase classes={t} label="Terms" />);
  expect(container.querySelectorAll("label")).toHaveLength(1);
});

it("marks the button data-disabled when disabled so the disabled styling applies", () => {
  render(<CheckboxBase classes={t} label="Terms" isDisabled />);
  expect(screen.getByRole("checkbox").closest("label")).toHaveAttribute("data-disabled");
});
