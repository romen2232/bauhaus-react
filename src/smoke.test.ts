import * as lib from "./index";

it("exposes the package version", () => {
  expect(lib.VERSION).toBe("0.4.0");
});

it("does not export internal bases", () => {
  expect(Object.keys(lib).filter((k) => k.endsWith("Base"))).toEqual([]);
});

it.each([
  "Container",
  "Grid",
  "DisplayHeading",
  "HighlightText",
  "ArrowLink",
  "IndexCounter",
  "SectionLabel",
  "BigNumber",
  "NumberStepper",
  "StatColumns",
  "ProgressRule",
  "RuledList",
  "Timeline",
  "Stepper",
  "Avatar",
  "MediaBlock",
  "QuoteBlock",
  "Wordmark",
  "ButtonPlayful",
  "IconButtonPlayful",
  "TagPlayful",
  "ProjectCardPlayful",
  "TopBarPlayful",
  "FooterPlayful",
  "TextLinkPlayful",
  "ChipPlayful",
  "CardPlayful",
  "StackCardPlayful",
  "BottomNavPlayful",
  "MenuOverlayPlayful",
  "CarouselPlayful",
  "TabsPlayful",
  "DateStripPlayful",
  "AudioPlayerPlayful",
  "Shape",
  "ShapeMosaic",
  "Stamp",
  "Pattern",
  "Ribbon",
  "SkewBar",
  "KineticRule",
  "Composition",
  "cn",
])("exports %s", (name) => {
  expect(typeof (lib as Record<string, unknown>)[name]).toBe("function");
});

it("exports the Soft tone palette", () => {
  expect(lib.SOFT_TONE_CLASSES.neutral).toBe("bg-bh-charcoal text-bh-paper");
});

it.each([
  "Button", "IconButton", "TextLink", "Tag", "Chip", "ProjectCard", "Card", "StackCard",
  "TopBar", "Footer", "BottomNav", "Tabs", "MenuOverlay", "Carousel", "DateStrip", "AudioPlayer",
])("exports %sSoft", (name) => {
  expect(typeof (lib as Record<string, unknown>)[`${name}Soft`]).toBe("function");
});

it("exports the Soft hover classes", () => {
  expect(Object.keys(lib.SOFT_HOVER_CLASSES)).toHaveLength(6);
});

it.each([
  "Button", "IconButton", "TextLink", "Tag", "Chip", "ProjectCard", "Card", "StackCard",
  "TopBar", "Footer", "BottomNav", "Tabs", "MenuOverlay", "Carousel", "DateStrip", "AudioPlayer",
])("exports %sSwiss", (name) => {
  expect(typeof (lib as Record<string, unknown>)[`${name}Swiss`]).toBe("function");
});

it("exports the Swiss palette", () => {
  expect(lib.SWISS_HEX.white).toBe("#FFFFFF");
});

it.each(["TextField"])("exports %s in every look", (name) => {
  for (const look of ["Playful", "Soft", "Swiss"]) {
    expect(typeof (lib as Record<string, unknown>)[`${name}${look}`]).toBe("function");
  }
});
