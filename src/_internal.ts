import { balanced } from "./balanced.ts";

export const create_patterns = <L extends string, C extends string>(
  label: L,
  char: C,
  nonce = Math.random().toString(),
) => {
  const esc = `\0${label.toUpperCase() as Uppercase<L>}_${nonce}\0` as const;
  const escRegExp = new RegExp(esc, "g");
  const escChar = char === "\\" ? "\\\\\\\\" : "\\\\" + char;
  const charRegExp = new RegExp(escChar, "g");

  return [
    [charRegExp, esc],
    [escRegExp, char],
  ] as const;

  // e.g. [[/\\\{/g, "\0OPEN_1234\0"], [/\0OPEN_1234\0/g, "{"]]
};

export const patterns = [
  create_patterns("open", "{"),
  create_patterns("close", "}"),
  create_patterns("comma", ","),
  create_patterns("period", "."),
  create_patterns("slash", "\\"),
] as const;

/**
 * Converts a numeric string to a number; if not numeric, returns the character
 * code of the first character.
 *
 * @param str - The string to convert.
 * @returns A number.
 */
export function numeric(str: string): number {
  return !isNaN(Number(str)) ? parseInt(str, 10) : str.charCodeAt(0);
}

/**
 * Escapes backslashes and brace-related characters in a string.
 *
 * @param str - The string to escape.
 * @returns The escaped string.
 */
export function escapeBraces(str: string): string {
  for (const [, [search, replace]] of patterns) {
    str = str.replace(search, replace);
  }
  return str;
}

/**
 * Reverses the escape operation applied by escapeBraces.
 *
 * @param str - The string to unescape.
 * @returns The unescaped string.
 */
export function unescapeBraces(str: string): string {
  for (const [[search, replace]] of patterns) {
    str = str.replace(search, replace);
  }
  return str;
}

/**
 * Splits a comma-separated string while preserving nested braced sections.
 *
 * @param str - The string to parse.
 * @returns An array of parts.
 */
export function parseCommaParts(str: string): string[] {
  if (!str) return [""];

  const m = balanced("{", "}", str);
  if (!m) return str.split(",");

  const { pre, body, post } = m;
  const parts = pre.split(",");
  parts[parts.length - 1] += "{" + body + "}";
  const postParts = parseCommaParts(post);
  if (post.length) {
    parts[parts.length - 1] += postParts.shift();
    parts.push(...postParts);
  }

  return parts;
}

/**
 * Wraps a string in braces.
 *
 * @param str - The string to embrace.
 * @returns The embraced string.
 */
export function embrace(str: string): string {
  return "{" + str + "}";
}

/**
 * Checks if a string element has padded numeric formatting (e.g., "01",
 * "-02").
 *
 * @param el - The string element to test.
 * @returns True if padded, false otherwise.
 */
export function isPadded(el: string): boolean {
  return /^-?0\d/.test(el);
}

/**
 * A helper that tests if one number is less than or equal to another.
 *
 * @param i - The first number.
 * @param y - The second number.
 * @returns True if `i` is less than or equal to `y`.
 */
export function lte(i: number, y: number): boolean {
  return i <= y;
}

/**
 * A helper that tests if one number is greater than or equal to another.
 *
 * @param i - The first number.
 * @param y - The second number.
 * @returns True if `i` is greater than or equal to `y`.
 */
export function gte(i: number, y: number): boolean {
  return i >= y;
}
