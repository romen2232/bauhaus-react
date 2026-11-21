import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { mockMatchMedia } from "../../../vitest.setup";
import { LookProvider } from "../../look/LookContext";
import { Hero } from "./Hero";
import { heroLook } from "./heroKit";

const REDUCED = "(prefers-reduced-motion: reduce)";

function renderHero(search = "") {
  return render(
    <MemoryRouter initialEntries={[`/${search}`]}>
      <LookProvider>
        <Hero />
      </LookProvider>
    </MemoryRouter>,
  );
}

const app = () => screen.getByTestId("hero-app");
const tryIt = () => screen.getByRole("button", { name: "Try it" });

beforeEach(() => {
  window.localStorage.clear();
});

test("heroLook maps mix to playful and keeps single looks", () => {
  expect(heroLook("mix")).toBe("playful");
  expect(heroLook("swiss")).toBe("swiss");
  expect(heroLook("soft")).toBe("soft");
});

test("renders the headline", () => {
  renderHero();
  expect(screen.getByRole("heading", { level: 1, name: "One idea. Three looks." })).toBeInTheDocument();
});

test("mini-app follows the look", () => {
  renderHero("?look=soft");
  expect(app()).toHaveAttribute("data-look", "soft");
  expect(app().querySelector(".rounded-bh-soft")).not.toBeNull();
});

test("mix renders the mini-app in the playful look", () => {
  renderHero();
  expect(app()).toHaveAttribute("data-look", "playful");
  expect(app().querySelector(".rounded-bh-soft")).toBeNull();
});

test("skips the wipe under reduced motion", async () => {
  mockMatchMedia({ [REDUCED]: true });
  renderHero("?look=playful");
  await userEvent.click(tryIt());
  expect(screen.queryByTestId("shape-wipe")).toBeNull();
  expect(app()).toHaveAttribute("data-look", "swiss");
});

test("wipes with motion, then shows the new look", async () => {
  renderHero("?look=playful");
  await userEvent.click(tryIt());
  const wipe = screen.getByTestId("shape-wipe");
  expect(app()).toHaveAttribute("data-look", "playful");
  fireEvent.animationEnd(wipe);
  expect(screen.queryByTestId("shape-wipe")).toBeNull();
  expect(app()).toHaveAttribute("data-look", "swiss");
});

test("try it cycles the three visible looks", async () => {
  mockMatchMedia({ [REDUCED]: true });
  renderHero("?look=playful");
  const seen: (string | null)[] = [];
  for (let i = 0; i < 3; i++) {
    await userEvent.click(tryIt());
    seen.push(app().getAttribute("data-look"));
  }
  expect(seen).toEqual(["swiss", "soft", "playful"]);
});

test("shows the install command and copies it", async () => {
  const user = userEvent.setup();
  renderHero();
  expect(screen.getByText("pnpm add bauhaus-react")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /copy/i }));
  expect(await navigator.clipboard.readText()).toBe("pnpm add bauhaus-react");
});
