// Build-time props extraction. Uses the TypeScript 5 compiler API (`typescript5`): the
// repo's TypeScript 7 ships no JS compiler API. Run with `node --experimental-strip-types`.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript5";

export type PropDoc =
  | { name: string; type: string; required: boolean; defaultValue: string | null; description: string; inherited: false }
  | { inherited: true; from: "dom"; count: number };

const REPO = resolve(import.meta.dirname, "../..");
const SRC = `${resolve(REPO, "src")}/`;

const programs = new Map<string, ts.Program>();

function programFor(entry: string): ts.Program {
  let program = programs.get(entry);
  if (!program) {
    program = ts.createProgram([entry], {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      strict: true,
      skipLibCheck: true,
      noEmit: true,
      types: [],
    });
    programs.set(entry, program);
  }
  return program;
}

function moduleExports(entry: string) {
  const program = programFor(entry);
  const checker = program.getTypeChecker();
  const mod = checker.getSymbolAtLocation(program.getSourceFile(entry)!)!;
  const resolveAlias = (s: ts.Symbol) => (s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s);
  return { checker, symbols: checker.getExportsOfModule(mod).map((s) => ({ name: s.getName(), symbol: resolveAlias(s) })) };
}

/** PascalCase function exports of the entry: the library's components. */
export function componentNames(entry: string): string[] {
  return moduleExports(entry)
    .symbols.filter(({ name, symbol }) => /^[A-Z]/.test(name) && symbol.flags & ts.SymbolFlags.Function)
    .map(({ name }) => name)
    .sort();
}

function defaultsOf(decl: ts.Declaration | undefined): Map<string, string> {
  const defaults = new Map<string, string>();
  const first = decl && ts.isFunctionDeclaration(decl) ? decl.parameters[0] : undefined;
  if (first && ts.isObjectBindingPattern(first.name)) {
    for (const el of first.name.elements) {
      if (!el.initializer) continue;
      const prop = el.propertyName ?? el.name;
      if (ts.isIdentifier(prop)) defaults.set(prop.text, el.initializer.getText());
    }
  }
  return defaults;
}

/** `InTypeAlias` expands ReactNode into its full union; show the alias instead. */
const readable = (type: string) => (type.includes("ReactPortal") && type.includes("Iterable<ReactNode>") ? "ReactNode" : type);

const isOwn = (s: ts.Symbol) => (s.declarations ?? []).some((d) => d.getSourceFile().fileName.startsWith(SRC));

export function extractProps(entry: string, names: string[]): Record<string, PropDoc[]> {
  const { checker, symbols } = moduleExports(entry);
  const flags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias;
  const result: Record<string, PropDoc[]> = {};

  for (const name of names) {
    const found = symbols.find((s) => s.name === name)?.symbol;
    const decl = found?.valueDeclaration ?? found?.declarations?.[0];
    if (!found || !decl) continue;
    const param = checker.getTypeOfSymbolAtLocation(found, decl).getCallSignatures()[0]?.getParameters()[0];
    if (!param) {
      result[name] = [];
      continue;
    }
    const paramType = checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration ?? decl);
    const members = paramType.isUnion() ? paramType.types : [paramType];
    const defaults = defaultsOf(decl);

    const merged = new Map<string, { symbols: ts.Symbol[]; required: boolean; types: Set<string> }>();
    for (const member of members) {
      for (const prop of checker.getPropertiesOfType(member)) {
        const entryFor = merged.get(prop.getName()) ?? { symbols: [], required: true, types: new Set<string>() };
        const optional = (prop.flags & ts.SymbolFlags.Optional) !== 0;
        const propType = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration ?? decl);
        entryFor.symbols.push(prop);
        entryFor.required &&= !optional;
        entryFor.types.add(checker.typeToString(optional ? checker.getNonNullableType(propType) : propType, undefined, flags));
        merged.set(prop.getName(), entryFor);
      }
    }
    // A prop missing from some union members is optional for the union as a whole.
    for (const entryFor of merged.values()) if (entryFor.symbols.length < members.length) entryFor.required = false;

    const docs: PropDoc[] = [];
    let inheritedCount = 0;
    for (const [propName, info] of [...merged].sort(([a], [b]) => a.localeCompare(b))) {
      if (!info.symbols.some(isOwn)) {
        inheritedCount++;
        continue;
      }
      const description = info.symbols.map((s) => ts.displayPartsToString(s.getDocumentationComment(checker))).find(Boolean) ?? "";
      docs.push({
        name: propName,
        type: readable([...info.types].join(" | ")),
        required: info.required,
        defaultValue: defaults.get(propName) ?? null,
        description,
        inherited: false,
      });
    }
    if (inheritedCount > 0) docs.push({ inherited: true, from: "dom", count: inheritedCount });
    result[name] = docs;
  }
  return result;
}

function main() {
  const entry = resolve(REPO, "src/index.ts");
  const out = resolve(import.meta.dirname, "../src/generated/props.json");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(extractProps(entry, componentNames(entry)), null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
