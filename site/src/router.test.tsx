import { createAppRouter } from "./router";

describe("createAppRouter", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  test("keeps the trailing slash of the base path when the query changes", async () => {
    window.history.replaceState(null, "", "/bauhaus-react/");
    const router = createAppRouter("/bauhaus-react/");
    await router.navigate("/?look=soft", { replace: true });
    expect(window.location.pathname).toBe("/bauhaus-react/");
    expect(window.location.search).toBe("?look=soft");
    router.dispose();
  });

  test("works at the root base too", async () => {
    window.history.replaceState(null, "", "/");
    const router = createAppRouter("/");
    await router.navigate("/docs/colour");
    expect(window.location.pathname).toBe("/docs/colour");
    router.dispose();
  });
});
