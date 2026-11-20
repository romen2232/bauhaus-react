import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SwitchBase } from "./SwitchBase";

const t = {
  root: "r",
  label: "",
  required: "",
  description: "",
  error: "",
  errorMarker: "",
  button: "",
  track: "tr",
  thumb: "th",
};

it("is a named switch with a visible (required) marker", () => {
  render(<SwitchBase classes={t} label="Notifications" isRequired />);
  expect(screen.getByRole("switch", { name: /Notifications/ })).toBeRequired();
  expect(screen.getByText("(required)")).toBeInTheDocument();
});

it("toggles with Space and reports isSelected", async () => {
  const onChange = vi.fn();
  render(<SwitchBase classes={t} label="Notifications" onChange={onChange} />);
  await userEvent.tab();
  await userEvent.keyboard(" ");
  expect(onChange).toHaveBeenLastCalledWith(true);
  expect(screen.getByRole("switch")).toBeChecked();
});

it("toggles with a click", async () => {
  const onChange = vi.fn();
  render(<SwitchBase classes={t} label="Notifications" onChange={onChange} />);
  await userEvent.click(screen.getByRole("switch"));
  expect(onChange).toHaveBeenLastCalledWith(true);
});

it("is controlled by isSelected", async () => {
  const onChange = vi.fn();
  render(<SwitchBase classes={t} label="Notifications" isSelected={false} onChange={onChange} />);
  await userEvent.click(screen.getByRole("switch"));
  expect(onChange).toHaveBeenLastCalledWith(true);
  expect(screen.getByRole("switch")).not.toBeChecked();
});

it("marks track and thumb data-checked only when on", () => {
  const { rerender, container } = render(<SwitchBase classes={t} label="N" isSelected={false} />);
  expect(container.querySelector(".tr")).not.toHaveAttribute("data-checked");
  expect(container.querySelector(".th")).not.toHaveAttribute("data-checked");
  rerender(<SwitchBase classes={t} label="N" isSelected />);
  expect(container.querySelector(".tr")).toHaveAttribute("data-checked");
  expect(container.querySelector(".th")).toHaveAttribute("data-checked");
  expect(screen.getByRole("switch")).toBeChecked();
});

it("hides the track from assistive tech", () => {
  const { container } = render(<SwitchBase classes={t} label="N" />);
  expect(container.querySelector(".tr")).toHaveAttribute("aria-hidden", "true");
});

it("shows an error under the control only when invalid, linked to the input", () => {
  const { unmount } = render(
    <SwitchBase classes={t} label="Terms" isInvalid errorMessage="Turn on to continue" />,
  );
  const input = screen.getByRole("switch");
  expect(input).toBeInvalid();
  const described = input
    .getAttribute("aria-describedby")!
    .split(" ")
    .map((id) => document.getElementById(id)?.textContent);
  expect(described).toEqual(expect.arrayContaining([expect.stringContaining("Turn on to continue")]));
  unmount();
  render(<SwitchBase classes={t} label="Terms" errorMessage="Turn on to continue" />);
  expect(screen.queryByText("Turn on to continue")).toBeNull();
});

it("links the description to the input", () => {
  render(<SwitchBase classes={t} label="Terms" description="Sent by email" />);
  const ids = screen.getByRole("switch").getAttribute("aria-describedby")!.split(" ");
  expect(ids.map((id) => document.getElementById(id)?.textContent)).toContain("Sent by email");
});

it("disabled blocks toggling and marks the button data-disabled", async () => {
  const onChange = vi.fn();
  render(<SwitchBase classes={t} label="Terms" isDisabled onChange={onChange} />);
  await userEvent.click(screen.getByRole("switch"));
  expect(onChange).not.toHaveBeenCalled();
  expect(screen.getByRole("switch")).toBeDisabled();
  expect(screen.getByRole("switch").closest("label")).toHaveAttribute("data-disabled");
});

it("posts name and value in a form only when on", () => {
  const first = render(
    <form>
      <SwitchBase classes={t} label="News" name="news" value="yes" />
    </form>,
  );
  expect(new FormData(first.container.querySelector("form")!).get("news")).toBeNull();
  first.unmount();
  const second = render(
    <form>
      <SwitchBase classes={t} label="News" name="news" value="yes" defaultSelected />
    </form>,
  );
  expect(new FormData(second.container.querySelector("form")!).get("news")).toBe("yes");
});

it("shows keyboard focus on the label wrapper", async () => {
  render(<SwitchBase classes={t} label="Terms" />);
  await userEvent.tab();
  expect(screen.getByRole("switch").closest("label")).toHaveAttribute("data-focus-visible");
});

it("hideLabel keeps the accessible name", () => {
  render(<SwitchBase classes={t} label="Terms" hideLabel />);
  expect(screen.getByRole("switch", { name: "Terms" })).toBeInTheDocument();
  expect(screen.getByText("Terms")).toHaveClass("sr-only");
});

it("merges className onto the root and forwards ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<SwitchBase classes={t} label="Terms" className="mt-4" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toHaveClass("r", "mt-4");
  expect(ref.current!.contains(screen.getByRole("switch"))).toBe(true);
});

it("does not nest a label element inside the button label", () => {
  const { container } = render(<SwitchBase classes={t} label="Terms" />);
  expect(container.querySelectorAll("label")).toHaveLength(1);
});
