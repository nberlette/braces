/**
 * This module provides {@linkcode balanced} and {@linkcode range} functions
 * for finding balanced substrings within a string. These functions are useful
 * for parsing and manipulating strings that contain nested / paired tokens,
 * such as braces, brackets, or parentheses.
 *
 * This is a direct port of the original JavaScript from `balanced-match`,
 * licensed under the MIT license, by Julian Gruber. It can be found at:
 *
 *      https://github.com/juliangruber/balanced-match
 *
 * @module balanced
 */
/**
 * Represents the result of a balanced substring search.
 */
export interface BalancedResult {
  start: number;
  end: number;
  pre: string;
  body: string;
  post: string;
}

/**
 * Returns the first balanced substring delimited by `a` and `b`.
 *
 * @param a - A string or regular expression representing the opening token.
 * @param b - A string or regular expression representing the closing token.
 * @param str - The string to search.
 * @returns A balanced result object or null if no balanced tokens are found.
 */
export function balanced(
  a: string | RegExp,
  b: string | RegExp,
  str: string,
): BalancedResult | null {
  const tryMatch = (r: RegExp, s: string) => s.match(r)?.[0] ?? null;
  if (a instanceof RegExp) a = tryMatch(a, str)!;
  if (b instanceof RegExp) b = tryMatch(b, str)!;
  if (a === null || b === null) return null;

  const rng = range(a, b, str);
  if (!rng) return null;

  const [startIdx, endIdx] = rng;
  return {
    start: startIdx,
    end: endIdx,
    pre: str.slice(0, startIdx),
    body: str.slice(startIdx + a.length, endIdx),
    post: str.slice(endIdx + b.length),
  };
}


/**
 * Finds the range of the first balanced pair of tokens.
 *
 * @param a - The opening token.
 * @param b - The closing token.
 * @param str - The string to search.
 * @returns A tuple of the start and end indices, or null if not found.
 */
export function range(
  a: string,
  b: string,
  str: string,
): [start: number, end: number] | null {
  let ai = str.indexOf(a), bi = str.indexOf(b, ai + 1);
  let i = ai;
  let result: [number, number] | undefined;
  const begs: number[] = [];
  let left = str.length, right = 0;

  if (ai >= 0 && bi > 0) {
    if (a === b) return [ai, bi];

    while (i >= 0 && !result) {
      if (i === ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length === 1) {
        result = [begs.pop()!, bi];
      } else {
        const beg = begs.pop();
        if (beg != null && beg < left) {
          left = beg;
          right = bi;
        }
        bi = str.indexOf(b, i + 1);
      }
      i = ai >= 0 && (ai < bi || bi < 0) ? ai : bi;
    }
    if (begs.length) result = [left, right];
  }
  return result ?? null;
}
