/**
 * This modules provides the {@linkcode expand} function, which recursively
 * expands bash-style brace expressions into an array of strings. It supports
 * various types of brace expressions, including comma-separated options, both
 * numeric and alpha sequences, nested braces expressions, and more.
 *
 * @module expand
 */

import {
  embrace,
  ESC_CLOSE,
  gte,
  isPadded,
  lte,
  numeric,
  parseCommaParts,
} from "./_internal.ts";
import { balanced } from "./balanced.ts";

/**
 * Recursively expands brace expressions in a string.
 *
 * @param str - The string to expand.
 * @param isTop - Whether this is the top-level expansion.
 * @returns An array of expanded strings.
 */
export function expand(str: string, isTop = false): string[] {
  const expansions: string[] = [];
  const m = balanced("{", "}", str);
  if (!m) return [str];

  const pre = m.pre;
  const post = m.post.length ? expand(m.post, false) : [""];

  // If the pre ends with '$', treat it as a literal brace set.
  if (/\$$/.test(m.pre)) {
    for (let k = 0; k < post.length; k++) {
      expansions.push(pre + "{" + m.body + "}" + post[k]);
    }
  } else {
    const isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    const isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    const isSequence = isNumericSequence || isAlphaSequence;
    const isOptions = m.body.indexOf(",") >= 0;

    if (!isSequence && !isOptions) {
      // Handle cases like "{a},b}"
      if (m.post.match(/,.*\}/)) {
        str = m.pre + "{" + m.body + ESC_CLOSE + m.post;
        return expand(str);
      }
      return [str];
    }

    let n: string[];
    if (isSequence) {
      n = m.body.split(/\.\./);
    } else {
      n = parseCommaParts(m.body);
      if (n.length === 1) {
        // Expand nested braces, e.g. x{{a,b}}y → [x{a}y, x{b}y]
        n = expand(n[0], false).map(embrace);
        if (n.length === 1) return post.map((p) => m.pre + n[0] + p);
      }
    }

    let N: string[];
    if (isSequence) {
      const x = numeric(n[0]), y = numeric(n[1]);
      const width = Math.max(n[0].length, n[1].length);
      let incr = n.length === 3 ? Math.abs(numeric(n[2])) : 1;
      let test = lte;
      const reverse = y < x;
      if (reverse) {
        incr *= -1;
        test = gte;
      }
      const pad = n.some(isPadded);
      N = [];

      for (let i = x; test(i, y); i += incr) {
        let c: string;
        if (isAlphaSequence) {
          c = String.fromCharCode(i);
          if (c === "\\") c = "";
        } else {
          c = String(i);
          if (pad) {
            const need = width - c.length;
            if (need > 0) {
              const z = "0".repeat(need);
              c = i < 0 ? "-" + z + c.slice(1) : z + c;
            }
          }
        }
        N.push(c);
      }
    } else {
      N = [];
      for (let j = 0; j < n.length; j++) {
        N.push(...expand(n[j], false));
      }
    }

    for (let j = 0; j < N.length; j++) {
      for (let k = 0; k < post.length; k++) {
        const expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion) expansions.push(expansion);
      }
    }
  }
  return expansions;
}
