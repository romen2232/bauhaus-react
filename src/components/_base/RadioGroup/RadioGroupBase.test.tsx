import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroupBase } from "./RadioGroupBase";

const t = {
  root: "r",
  label: "",
  required: "",
  description: "",
  error: "",
  errorMarker: "",
  options: "o",
  radio: "rd",
  circle: "c",
  dot: "d",
  optionLabel: "ol",
};

const options = [
  { value: "a", label: "Email" },
  { value: "b", label: "Phone", isDisabled: true },
  { value: "c", label: "Post" },
];

it("is a named radio group whose arrow keys move selection and skip disabled options", async () => {
  const onChange = vi.fn();
  render(<RadioGroupBase classes={t} label="Contact by" options={options} onChange={onChange} />);
  expect(screen.getByRole("radiogroup", { name: /Contact by/ })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("radio", { name: "Email" }));
  await userEvent.keyboard("{ArrowDown}");
  expect(onChange).toHaveBeenLastCalledWith("c");
  expect(screen.getByRole("radio", { name: "Post" })).toBeChecked();
});

it("is one tab stop", async () => {
  render(
    <>
      <RadioGroupBase classes={t} label="Contact by" options={options} defaultValue="c" />
      <button type="button">After</button>
    </>,
  );
  await userEvent.tab();
  expect(screen.getByRole("radio", { name: "Post" })).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
});

it("controls selection through value", async () => {
  const onChange = vi.fn();
  render(<RadioGroupBase classes={t} label="Contact by" options={options} value="a" onChange={onChange} />);
  await userEvent.click(screen.getByRole("radio", { name: "Post" }));
  expect(onChange).toHaveBeenLastCalledWith("c");
  expect(screen.getByRole("radio", { name: "Email" })).toBeChecked();
  expect(screen.getByRole("radio", { name: "Post" })).not.toBeChecked();
});

it("exposes orientation", () => {
  const first = render(<RadioGroupBase classes={t} label="L" options={options} />);
  expect(screen.getByRole("radiogroup")).toHaveAttribute("data-orientation", "vertical");
  first.unmount();
  render(<RadioGroupBase classes={t} label="L" options={options} orientation="horizontal" />);
  expect(screen.getByRole("radiogroup")).toHaveAttribute("data-orientation", "horizontal");
});

it("marks the circle and dot data-checked only on the selected option", () => {
  const { container } = render(<RadioGroupBase classes={t} label="L" options={options} defaultValue="c" />);
  const circles = [...container.querySelectorAll(".c")];
  expect(circles).toHaveLength(3);
  expect(circles.map((c) => c.hasAttribute("data-checked"))).toEqual([false, false, true]);
  const dots = [...container.querySelectorAll(".d")];
  expect(dots.map((d) => d.hasAttribute("data-checked"))).toEqual([false, false, true]);
});

it("hides the circle from assistive tech", () => {
  const { container } = render(<RadioGroupBase classes={t} label="L" options={options} />);
  for (const c of container.querySelectorAll(".c")) expect(c).toHaveAttribute("aria-hidden", "true");
});

it("exposes data-disabled and data-checked on the radio element", async () => {
  render(<RadioGroupBase classes={t} label="L" options={options} defaultValue="a" />);
  expect(screen.getByRole("radio", { name: "Phone" }).closest("label")).toHaveAttribute("data-disabled");
  expect(screen.getByRole("radio", { name: "Email" }).closest("label")).toHaveAttribute("data-selected");
  expect(screen.getByRole("radio", { name: "Phone" })).toBeDisabled();
});

it("shows an error below the group only when invalid, linked to the group", () => {
  const { unmount } = render(
    <RadioGroupBase classes={t} label="Contact by" options={options} isInvalid errorMessage="Pick one" />,
  );
  const group = screen.getByRole("radiogroup");
  expect(group).toBeInvalid();
  const described = group
    .getAttribute("aria-describedby")!
    .split(" ")
    .map((id) => document.getElementById(id)?.textContent);
  expect(described).toEqual(expect.arrayContaining([expect.stringContaining("Pick one")]));
  unmount();
  render(<RadioGroupBase classes={t} label="Contact by" options={options} errorMessage="Pick one" />);
  expect(screen.queryByText("Pick one")).toBeNull();
});

it("links the description to the group", () => {
  render(<RadioGroupBase classes={t} label="L" options={options} description="Pick how we reach you" />);
  const ids = screen.getByRole("radiogroup").getAttribute("aria-describedby")!.split(" ");
  expect(ids.map((id) => document.getElementById(id)?.textContent)).toContain("Pick how we reach you");
});

it("marks the group required with (required)", () => {
  render(<RadioGroupBase classes={t} label="Contact by" options={options} isRequired />);
  expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-required", "true");
  expect(screen.getByText("(required)")).toBeInTheDocument();
});

it("renders an empty options array without throwing", () => {
  render(<RadioGroupBase classes={t} label="Contact by" options={[]} />);
  expect(screen.getByRole("radiogroup", { name: /Contact by/ })).toBeInTheDocument();
  expect(screen.queryAllByRole("radio")).toHaveLength(0);
});

it("posts the chosen value under name", () => {
  const { container } = render(
    <form>
      <RadioGroupBase classes={t} label="Via" options={options} name="via" defaultValue="c" />
    </form>,
  );
  expect(new FormData(container.querySelector("form")!).get("via")).toBe("c");
});

it("posts nothing under name while nothing is chosen", () => {
  const { container } = render(
    <form>
      <RadioGroupBase classes={t} label="Via" options={options} name="via" />
    </form>,
  );
  expect(new FormData(container.querySelector("form")!).get("via")).toBeNull();
});

it("disabled group blocks selection", async () => {
  const onChange = vi.fn();
  render(<RadioGroupBase classes={t} label="L" options={options} isDisabled onChange={onChange} />);
  await userEvent.click(screen.getByRole("radio", { name: "Email" }));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("radio", { name: "Email" })).toBeDisabled();
});

it("shows keyboard focus on the focused radio's label", async () => {
  render(<RadioGroupBase classes={t} label="L" options={options} />);
  await userEvent.tab();
  expect(screen.getByRole("radio", { name: "Email" }).closest("label")).toHaveAttribute("data-focus-visible");
});

it("hideLabel keeps the group's accessible name", () => {
  render(<RadioGroupBase classes={t} label="Contact by" hideLabel options={options} />);
  expect(screen.getByRole("radiogroup", { name: "Contact by" })).toBeInTheDocument();
  expect(screen.getByText("Contact by")).toHaveClass("sr-only");
});

it("does not nest label elements: one per option, the group label is not a label", () => {
  const { container } = render(<RadioGroupBase classes={t} label="Contact by" options={options} />);
  expect(container.querySelectorAll("label")).toHaveLength(options.length);
  expect(container.querySelector("label label")).toBeNull();
});

it("merges className onto the root and forwards ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<RadioGroupBase classes={t} label="L" options={options} className="mt-4" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toHaveClass("r", "mt-4");
  expect(ref.current).toBe(screen.getByRole("radiogroup"));
});
