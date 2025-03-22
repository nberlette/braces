import * as js from "./braces.ts";
import * as wasm from "../wasm/lib/braces.js";
import * as wasm_sync from "../wasm/lib/braces_sync.js";
import * as wasm_old from "../wasm/lib-old-2/braces.js";
import * as wasm_old_sync from "../wasm/lib-old-2/braces.js";

const targets = [
  ["js", js],
  ["wasm", wasm],
  ["wasm_old", wasm_old],
  ["wasm_sync", wasm_sync],
  ["wasm_old_sync", wasm_old_sync],
] as const;

const tests = [
  { input: "server/{node,deno}/{v1,v2,v3}/app.{js,ts}" },
  { input: "static/{index,about,contact}.{html,htm}" },
  { input: "image-{001..050}.png" },
] as const;

const iterations = [100, 250, 500, 1000] as const;

for (const [name, { braces }] of targets) {
  for (const { input } of tests) {
    for (const n of iterations) {
      Deno.bench({
        group: `[n=${n}] [input=${JSON.stringify(input)}]`,
        name: `[${name}]`,
        n,
        baseline: name === "js",
        fn: () => void braces(input),
      });
    }
  }
}
