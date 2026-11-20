import { createRef } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectBase } from "./SelectBase";

const t = {
  root: "r",
  label: "",
  required: "",
  description: "",
  error: "",
  errorMarker: "",
  control: "ctl",
  trigger: "tr",
  value: "val",
  chevron: "chev",
  popover: "pop",
  listbox: "lb",
  option: "opt",
  check: "chk",
  empty: "emp",
};

const items = [
  { id: "banana", label: "Banana" },
  { id: "cherry", label: "Cherry", isDisabled: true },
  { id: "apple", label: "Apple" },
];
const trigger = () => screen.getByRole("button", { name: /Fruit/ });

it("shows the placeholder, named by its label, until something is picked", () => {
  render(<SelectBase classes={t} label="Fruit" items={items} placeholder="Choose a fruit" />);
  expect(trigger()).toHaveTextContent("Choose a fruit");
  expect(trigger()).toHaveAttribute("aria-haspopup", "listbox");
});

it("falls back to a default placeholder", () => {
  render(<SelectBase classes={t} label="Fruit" items={items} />);
  expect(trigger()).toHaveTextContent("Select an option");
});

it("opens a listbox on click and selects with the pointer", async () => {
  const onSelectionChange = vi.fn();
  render(<SelectBase classes={t} label="Fruit" items={items} onSelectionChange={onSelectionChange} />);
  await userEvent.click(trigger());
  await userEvent.click(screen.getByRole("option", { name: "Apple" }));
  expect(onSelectionChange).toHaveBeenLastCalledWith("apple");
  expect(trigger()).toHaveTextContent("Apple");
  expect(screen.queryByRole("listbox")).toBeNull();
});

it("opens with ArrowDown and picks with Enter, skipping the disabled option", async () => {
  const onSelectionChange = vi.fn();
  render(<SelectBase classes={t} label="Fruit" items={items} onSelectionChange={onSelectionChange} />);
  await userEvent.tab();
  expect(trigger()).toHaveFocus();
  await userEvent.keyboard("{ArrowDown}");
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  await userEvent.keyboard("{ArrowDown}");
  await userEvent.keyboard("{Enter}");
  expect(onSelectionChange).toHaveBeenLastCalledWith("apple");
  expect(trigger()).toHaveTextContent("Apple");
  expect(screen.queryByRole("listbox")).toBeNull();
});

it("jumps by typeahead", async () => {
  const onSelectionChange = vi.fn();
  render(<SelectBase classes={t} label="Fruit" items={items} onSelectionChange={onSelectionChange} />);
  await userEvent.click(trigger());
  await userEvent.keyboard("a");
  expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("data-focused");
  await userEvent.keyboard("{Enter}");
  expect(onSelectionChange).toHaveBeenLastCalledWith("apple");
});

it("Escape closes and returns focus to the trigger", async () => {
  render(<SelectBase classes={t} label="Fruit" items={items} />);
  await userEvent.click(trigger());
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("listbox")).toBeNull();
  await waitFor(() => expect(trigger()).toHaveFocus());
});

it("marks the selected option with a check and aria-selected", async () => {
  render(<SelectBase classes={t} label="Fruit" items={items} defaultSelectedKey="banana" />);
  await userEvent.click(trigger());
  const banana = screen.getByRole("option", { name: /Banana/ });
  expect(banana).toHaveAttribute("aria-selected", "true");
  expect(banana.querySelector(".chk")).toHaveTextContent("✓");
  expect(banana.querySelector(".chk")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByRole("option", { name: "Apple" }).querySelector(".chk")).toBeNull();
});

it("does not select a disabled option", async () => {
  const onSelectionChange = vi.fn();
  render(<SelectBase classes={t} label="Fruit" items={items} onSelectionChange={onSelectionChange} />);
  await userEvent.click(trigger());
  const cherry = screen.getByRole("option", { name: "Cherry" });
  expect(cherry).toHaveAttribute("aria-disabled", "true");
  await userEvent.click(cherry);
  expect(onSelectionChange).not.toHaveBeenCalled();
});

it("is controlled by selectedKey", async () => {
  const onSelectionChange = vi.fn();
  render(
    <SelectBase classes={t} label="Fruit" items={items} selectedKey="banana" onSelectionChange={onSelectionChange} />,
  );
  await userEvent.click(trigger());
  await userEvent.click(screen.getByRole("option", { name: "Apple" }));
  expect(onSelectionChange).toHaveBeenLastCalledWith("apple");
  expect(trigger()).toHaveTextContent("Banana");
});

it("shows the placeholder for a null controlled selectedKey", () => {
  render(<SelectBase classes={t} label="Fruit" items={items} selectedKey={null} placeholder="Choose" />);
  expect(trigger()).toHaveTextContent("Choose");
});

it("reports null through onSelectionChange when a form reset clears an uncontrolled selection", async () => {
  const onSelectionChange = vi.fn();
  const { container } = render(
    <form>
      <SelectBase classes={t} label="Fruit" items={items} name="fruit" onSelectionChange={onSelectionChange} />
    </form>,
  );
  await userEvent.click(trigger());
  await userEvent.click(screen.getByRole("option", { name: "Apple" }));
  expect(onSelectionChange).toHaveBeenLastCalledWith("apple");
  act(() => container.querySelector("form")!.reset());
  await waitFor(() => expect(onSelectionChange).toHaveBeenLastCalledWith(null));
  expect(trigger()).toHaveTextContent("Select an option");
});

it("shows the placeholder for a selectedKey that matches no item", () => {
  render(<SelectBase classes={t} label="Fruit" items={items} selectedKey="zzz" placeholder="Choose a fruit" />);
  expect(trigger()).toHaveTextContent("Choose a fruit");
});

it("opens with empty items without throwing", async () => {
  render(<SelectBase classes={t} label="Fruit" items={[]} />);
  await userEvent.click(trigger());
  expect(screen.getByRole("listbox")).toBeInTheDocument();
  expect(screen.getByText("No options")).toHaveClass("emp");
  expect(screen.queryByRole("option", { name: "Banana" })).toBeNull();
});

it("shows no empty-state text while there are options", async () => {
  render(<SelectBase classes={t} label="Fruit" items={items} />);
  await userEvent.click(trigger());
  expect(screen.queryByText("No options")).toBeNull();
});

it("names the opened listbox by the field label", async () => {
  render(<SelectBase classes={t} label="Fruit" items={items} />);
  await userEvent.click(trigger());
  expect(screen.getByRole("listbox", { name: /Fruit/ })).toBeInTheDocument();
});

it("disabled select does not open", async () => {
  render(<SelectBase classes={t} label="Fruit" items={items} isDisabled />);
  expect(trigger()).toBeDisabled();
  await userEvent.click(trigger());
  expect(screen.queryByRole("listbox")).toBeNull();
});

it("links the description to the trigger", () => {
  render(<SelectBase classes={t} label="Fruit" items={items} description="Pick your favourite" />);
  const ids = trigger().getAttribute("aria-describedby")!.split(" ");
  expect(ids.map((id) => document.getElementById(id)?.textContent)).toContain("Pick your favourite");
});

it("links the error to the trigger only while invalid", () => {
  const { unmount } = render(<SelectBase classes={t} label="Fruit" items={items} isInvalid errorMessage="Pick one" />);
  const ids = trigger().getAttribute("aria-describedby")!.split(" ");
  expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual(
    expect.arrayContaining([expect.stringContaining("Pick one")]),
  );
  unmount();
  render(<SelectBase classes={t} label="Fruit" items={items} errorMessage="Pick one" />);
  expect(screen.queryByText("Pick one")).toBeNull();
});

it("falls back to React Aria's own validation errors", () => {
  render(
    <SelectBase classes={t} label="Fruit" items={items} validate={() => "Not allowed"} defaultSelectedKey="apple" />,
  );
  expect(screen.getByText("Not allowed")).toBeInTheDocument();
});

it("passes the validation result to an errorMessage function", () => {
  render(
    <SelectBase
      classes={t}
      label="Fruit"
      items={items}
      isInvalid
      errorMessage={(v) => `fn:${String(v.isInvalid)}`}
    />,
  );
  expect(screen.getByText("fn:true")).toBeInTheDocument();
});

it("marks required with (required)", () => {
  render(<SelectBase classes={t} label="Fruit" items={items} isRequired />);
  expect(screen.getByText("(required)")).toBeInTheDocument();
  expect(trigger()).toBeInTheDocument();
});

it("hides the chevron from assistive tech", () => {
  const { container } = render(<SelectBase classes={t} label="Fruit" items={items} />);
  expect(container.querySelector(".chev")).toHaveAttribute("aria-hidden", "true");
});

it("posts the chosen key in a form under name", () => {
  const { container } = render(
    <form>
      <SelectBase classes={t} label="Fruit" items={items} name="fruit" defaultSelectedKey="apple" />
    </form>,
  );
  expect(new FormData(container.querySelector("form")!).get("fruit")).toBe("apple");
});

it("posts nothing under name while nothing is chosen", () => {
  const { container } = render(
    <form>
      <SelectBase classes={t} label="Fruit" items={items} name="fruit" />
    </form>,
  );
  expect(new FormData(container.querySelector("form")!).get("fruit")).toBeFalsy();
});

it("shows keyboard focus on the trigger", async () => {
  render(<SelectBase classes={t} label="Fruit" items={items} />);
  await userEvent.tab();
  expect(trigger()).toHaveAttribute("data-focus-visible");
});

it("merges className onto the root and forwards ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<SelectBase classes={t} label="Fruit" items={items} className="mt-4" ref={ref} />);
  const root = trigger().closest(".r");
  expect(root).toHaveClass("r", "mt-4");
  expect(ref.current).toBe(root);
});

it("applies the popover, listbox and option slots when open", async () => {
  render(<SelectBase classes={t} label="Fruit" items={items} />);
  await userEvent.click(trigger());
  expect(screen.getByRole("listbox")).toHaveClass("lb");
  expect(screen.getByRole("listbox").closest(".pop")).not.toBeNull();
  expect(screen.getByRole("option", { name: "Apple" })).toHaveClass("opt");
});

describe("validate wrapper", () => {
  it("receives the string key after a selection and surfaces its message", async () => {
    const validate = vi.fn((key: string | null) => (key === "apple" ? "No apples today" : null));
    render(<SelectBase classes={t} label="Fruit" items={items} validate={validate} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(validate).toHaveBeenLastCalledWith("apple");
    expect(screen.getByText("No apples today")).toBeInTheDocument();
  });

  it("shows no error when validate returns null", async () => {
    const validate = vi.fn((key: string | null) => (key === "apple" ? "No apples today" : null));
    render(<SelectBase classes={t} label="Fruit" items={items} validate={validate} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect(validate).toHaveBeenLastCalledWith("banana");
    expect(screen.queryByText("No apples today")).toBeNull();
    expect(trigger().closest(".r")).not.toHaveAttribute("data-invalid");
  });
});

describe("required", () => {
  it("blocks an empty submit with validationBehavior native and allows it once chosen", async () => {
    const onSubmit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    const { container } = render(
      <form onSubmit={onSubmit}>
        <SelectBase classes={t} label="Fruit" items={items} name="fruit" isRequired validationBehavior="native" />
      </form>,
    );
    const form = container.querySelector("form")!;
    act(() => form.requestSubmit());
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.checkValidity()).toBe(false);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: "Apple" }));
    act(() => form.requestSubmit());
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("does not block a submit with the default aria behavior", () => {
    const onSubmit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    const { container } = render(
      <form onSubmit={onSubmit}>
        <SelectBase classes={t} label="Fruit" items={items} name="fruit" isRequired />
      </form>,
    );
    act(() => container.querySelector("form")!.requestSubmit());
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
