import { resolve } from "node:path";
import { componentNames, extractProps, type PropDoc } from "./extract-props.ts";

const ENTRY = resolve(import.meta.dirname, "../../src/index.ts");

type Own = Extract<PropDoc, { inherited: false }>;
const own = (docs: PropDoc[]): Own[] => docs.filter((d): d is Own => !d.inherited);

describe("extractProps", () => {
  test("extracts own props", () => {
    const docs = own(extractProps(ENTRY, ["ButtonPlayful"]).ButtonPlayful!);
    expect(docs.find((d) => d.name === "href")).toMatchObject({ required: false });
    expect(docs.find((d) => d.name === "color")!.type).toContain('"red"');
  }, 60_000);

  test("collapses inherited DOM props into one entry", () => {
    const all = extractProps(ENTRY, ["ButtonPlayful"]).ButtonPlayful!;
    const inherited = all.filter((d) => d.inherited);
    expect(inherited).toHaveLength(1);
    expect(inherited[0]).toMatchObject({ inherited: true, from: "dom" });
    expect((inherited[0] as { count: number }).count).toBeGreaterThan(0);
    const names = own(all).map((d) => d.name);
    expect(names).not.toContain("onClick");
    expect(names).not.toContain("aria-label");
  }, 60_000);

  test("reads defaults from destructuring", () => {
    const docs = own(extractProps(ENTRY, ["Shape"]).Shape!);
    expect(docs.find((d) => d.name === "rotate")!.defaultValue).toBe("0");
    expect(docs.find((d) => d.name === "color")!.defaultValue).toBe('"red"');
  }, 60_000);

  test("keeps ReactNode readable", () => {
    const docs = own(extractProps(ENTRY, ["ButtonSoft"]).ButtonSoft!);
    expect(docs.find((d) => d.name === "children")!.type).toBe("ReactNode");
  }, 60_000);

  test("reads descriptions from JSDoc", () => {
    const docs = own(extractProps(ENTRY, ["ButtonPlayful"]).ButtonPlayful!);
    expect(docs.find((d) => d.name === "color")!.description).toContain("Fill color");
  }, 60_000);
});

describe("componentNames", () => {
  test("lists PascalCase function exports only", () => {
    const names = componentNames(ENTRY);
    expect(names).toContain("ButtonSoft");
    expect(names).toContain("Shape");
    expect(names).toContain("ToastRegionSwiss");
    expect(names).not.toContain("cn");
    expect(names).not.toContain("VERSION");
    expect(names).not.toContain("toast");
  }, 60_000);
});
