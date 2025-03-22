import { braces } from "./braces.ts";

const tests = [
  { input: "server/{node,deno}/{v1,v2,v3}/app.{js,ts}" },
  { input: "static/{index,about,contact}.{html,htm}" },
  { input: "image-{001..050}.png" },
] as const;

const iterations = [100, 250, 500, 1000] as const;

for (const { input } of tests) {
  for (const n of iterations) {
    Deno.bench({
      group: `[n=${n}]`,
      name: `[braces] [input=${JSON.stringify(input)}]`,
      n,
      fn: () => void braces(input),
    });
  }
}
