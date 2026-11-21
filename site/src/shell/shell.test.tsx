import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "../routes";
import { TileMark } from "./TileMark";

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("TileMark", () => {
  test("obeys the form-colour pairing", () => {
    const { container } = render(<TileMark />);
    expect(container.querySelector('rect[fill="#ea4535"]')).toHaveAttribute("width", "50");
    expect(container.querySelector('path[fill="#1f5fd8"]')).toHaveAttribute("d", "M50 50 V0 A50 50 0 0 1 100 50z");
    expect(container.querySelector('polygon[fill="#f5b62a"]')).toHaveAttribute("points", "0,100 25,50 50,100");
    const circle = container.querySelector('circle[fill="#111"]');
    expect(circle).toHaveAttribute("cx", "75");
    expect(circle).toHaveAttribute("r", "18");
  });

  test("uses a paper circle on dark grounds", () => {
    const { container } = render(<TileMark onDark />);
    expect(container.querySelector('circle[fill="#f4efe6"]')).toBeInTheDocument();
    expect(container.querySelector('circle[fill="#111"]')).toBeNull();
  });
});

describe("site shell", () => {
  test("look select changes the look", async () => {
    const router = renderAt("/");
    await userEvent.click(screen.getByRole("button", { name: /Look/ }));
    await userEvent.click(screen.getByRole("option", { name: "Swiss" }));
    expect(router.state.location.search).toContain("look=swiss");
    expect(screen.getByRole("button", { name: /Look/ })).toHaveTextContent("Swiss");
  });

  test("look select is keyboard operable", async () => {
    const router = renderAt("/");
    const trigger = screen.getByRole("button", { name: /Look/ });
    for (let i = 0; i < 12 && document.activeElement !== trigger; i++) await userEvent.tab();
    expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    expect(router.state.location.search).toMatch(/look=(playful|swiss|soft)/);
  });

  test("header nav links", () => {
    renderAt("/");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs/getting-started/install");
    expect(screen.getByRole("link", { name: "Colour" })).toHaveAttribute("href", "/docs/colour");
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/romen2232/bauhaus-react",
    );
  });

  test.each(["/docs/components/nope", "/zzz"])("unknown route %s renders NotFound", (path) => {
    renderAt(path);
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
  });

  test("keeps the look in the URL while navigating", async () => {
    const router = renderAt("/?look=swiss");
    await userEvent.click(screen.getByRole("link", { name: "Docs" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/docs/getting-started/install"));
    await waitFor(() => expect(router.state.location.search).toContain("look=swiss"));
  });

  test("does not add a look param to the URL in mix", async () => {
    const router = renderAt("/");
    await userEvent.click(screen.getByRole("link", { name: "Docs" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/docs/getting-started/install"));
    expect(router.state.location.search).toBe("");
  });

  test("removes an invalid look param from the URL", async () => {
    const router = renderAt("/?look=neon");
    await waitFor(() => expect(router.state.location.search).toBe(""));
  });
});
