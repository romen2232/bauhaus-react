import * as lib from "./index";

it("exposes the package version", () => {
  expect(lib.VERSION).toBe("0.1.0");
});

it.each([
  "Container",
  "Grid",
  "DisplayHeading",
  "HighlightText",
  "ArrowLink",
  "ButtonPlayful",
  "IconButtonPlayful",
  "TagPlayful",
  "ProjectCardPlayful",
  "TopBarPlayful",
  "FooterPlayful",
  "Shape",
  "ShapeMosaic",
  "Stamp",
  "cn",
])("exports %s", (name) => {
  expect(typeof (lib as Record<string, unknown>)[name]).toBe("function");
});
