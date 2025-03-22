import { balanced, range } from "./balanced.ts";

const creativeInputs = [
  { input: "((start) middle (end))", a: "(", b: ")" },
  { input: "alpha {beta {gamma} delta} epsilon", a: "{", b: "}" },
  { input: "no tokens here", a: "{", b: "}" },
] as const;

const iterations = [50, 100, 250] as const;

for (const { input, a, b } of creativeInputs) {
  for (const n of iterations) {
    Deno.bench({
      group: `Balanced - N=${n}`,
      name: `INPUT=${JSON.stringify(input)} Tokens=${a}${b}`,
      n,
      baseline: n === iterations[0] && input === creativeInputs[0].input,
      fn() {
        balanced(a, b, input);
      },
    });
    Deno.bench({
      group: `Range - N=${n}`,
      name: `INPUT=${JSON.stringify(input)} Tokens=${a}${b}`,
      n,
      baseline: n === iterations[0] && input === creativeInputs[0].input,
      fn() {
        range(a, b, input);
      },
    });
  }
}
