import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, useLocation } from "react-router";
import { mockMatchMedia } from "../../vitest.setup";
import { LookProvider, resolveInitialLook, useLook } from "./LookContext";
import { useReducedMotion } from "./useReducedMotion";

const storageWith = (value: string | null) => ({ getItem: () => value });

function wrapperAt(path: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[path]}>
        <LookProvider>{children}</LookProvider>
      </MemoryRouter>
    );
  };
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("resolveInitialLook", () => {
  test("url beats storage", () => {
    expect(resolveInitialLook("?look=swiss", storageWith("soft"))).toBe("swiss");
  });

  test("storage beats default", () => {
    expect(resolveInitialLook("", storageWith("soft"))).toBe("soft");
  });

  test("defaults to mix", () => {
    expect(resolveInitialLook("", null)).toBe("mix");
  });

  test("ignores invalid look values", () => {
    expect(resolveInitialLook("?look=neon", storageWith("garbage"))).toBe("mix");
  });

  test("survives storage that throws", () => {
    const throwing = {
      getItem: () => {
        throw new Error("blocked");
      },
    };
    expect(resolveInitialLook("", throwing)).toBe("mix");
  });
});

describe("LookProvider", () => {
  test("survives storage that throws on write", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { result } = renderHook(() => useLook(), { wrapper: wrapperAt("/") });
    act(() => result.current.setLook("soft"));
    expect(result.current.look).toBe("soft");
    spy.mockRestore();
  });

  test("setLook writes url and storage", () => {
    function Probe() {
      const { look, setLook } = useLook();
      const { search } = useLocation();
      return (
        <>
          <output data-testid="look">{look}</output>
          <output data-testid="search">{search}</output>
          <button onClick={() => setLook("playful")}>playful</button>
          <button onClick={() => setLook("mix")}>mix</button>
        </>
      );
    }
    render(
      <MemoryRouter initialEntries={["/docs?x=1"]}>
        <LookProvider>
          <Probe />
        </LookProvider>
      </MemoryRouter>,
    );
    act(() => screen.getByText("playful").click());
    expect(screen.getByTestId("search").textContent).toContain("look=playful");
    expect(screen.getByTestId("search").textContent).toContain("x=1");
    expect(window.localStorage.getItem("bauhaus-react:look")).toBe("playful");

    act(() => screen.getByText("mix").click());
    expect(screen.getByTestId("search").textContent).not.toContain("look=");
    expect(window.localStorage.getItem("bauhaus-react:look")).toBe("mix");
  });

  test("starts from the url look", () => {
    const { result } = renderHook(() => useLook(), { wrapper: wrapperAt("/?look=swiss") });
    expect(result.current.look).toBe("swiss");
  });
});

describe("useReducedMotion", () => {
  test("follows the media query", () => {
    mockMatchMedia({ "(prefers-reduced-motion: reduce)": true });
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  test("is false by default", () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
});
