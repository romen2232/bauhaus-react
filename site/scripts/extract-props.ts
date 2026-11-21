// Stub; Task 8 replaces this with the real extractor.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const out = resolve(import.meta.dirname, "../src/generated/props.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, "{}\n");
