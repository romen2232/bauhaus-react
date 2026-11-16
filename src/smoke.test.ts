import * as lib from "./index";

it("exposes the package version", () => {
  expect(lib.VERSION).toBe("0.1.0");
});
