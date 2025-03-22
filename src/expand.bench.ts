import { expand } from "./expand.ts";

const tests = [
  {
    input: "{a,b,c}",
    expected: ["a", "b", "c"],
  },
  {
    input: "{a,b,c}{1,2,3}",
    expected: ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"],
  },
  {
    input: "{{a,b},c}{1,2,3}",
    expected: ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"],
  },
  {
    input: "{a,b,c}{1,2,3}{x,y,z}",
    expected: [
      "a1x", "a1y", "a1z",
      "a2x", "a2y", "a2z",
      "a3x", "a3y", "a3z",
      "b1x", "b1y", "b1z",
      "b2x", "b2y", "b2z",
      "b3x", "b3y", "b3z",
      "c1x", "c1y", "c1z",
      "c2x", "c2y", "c2z",
      "c3x", "c3y", "c3z",
    ],
  },
  {
    input: "{a,b,c}{1,2,3}{x,y,z}{!}",
    expected: [
      "a1x", "a1y", "a1z",
      "a2x", "a2y", "a2z",
      "a3x", "a3y", "a3z",
      "b1x", "b1y", "b1z",
      "b2x", "b2y", "b2z",
      "b3x", "b3y", "b3z",
      "c1x", "c1y", "c1z",
      "c2x", "c2y", "c2z",
      "c3x", "c3y", "c3z",
    ],
  },
  {
    input: "lib/{core,util}/{alpha,beta,gamma}",
    expected: [
      "lib/core/alpha",
      "lib/core/beta",
      "lib/core/gamma",
      "lib/util/alpha",
      "lib/util/beta",
      "lib/util/gamma",
    ],
  },
  {
    input: "module-{a..z}",
    expected: [
      "module-a", "module-b", "module-c", "module-d", "module-e",
      "module-f", "module-g", "module-h", "module-i", "module-j",
      "module-k", "module-l", "module-m", "module-n", "module-o",
      "module-p", "module-q", "module-r", "module-s", "module-t",
      "module-u", "module-v", "module-w", "module-x", "module-y",
      "module-z",
    ],
  },
  {
    input: "path/{to,from}/{A,B,C}{1,2}",
    expected: [
      "path/to/A1",
      "path/to/A2",
      "path/to/B1",
      "path/to/B2",
      "path/to/C1",
      "path/to/C2",
      "path/from/A1",
      "path/from/A2",
      "path/from/B1",
      "path/from/B2",
      "path/from/C1",
      "path/from/C2",
    ],
  },
] as const;

const iterations = [50, 100, 500, 1_000] as const;

let i = 0;
for (const { input } of tests) {
  for (const n of iterations) {
    Deno.bench({
      group: `[expand] [n=${n}]`,
      name: `[bench=${i}] ${JSON.stringify(input)}`,
      n,
      baseline: n === iterations[0] && i === 0,
      fn() {
        expand(input);
      },
    });
  }
  i++;
}
