import { balanced } from "./balanced.ts";

export const ESC_SLASH = "\0SLASH" + Math.random() + "\0";
export const ESC_OPEN = "\0OPEN" + Math.random() + "\0";
export const ESC_CLOSE = "\0CLOSE" + Math.random() + "\0";
export const ESC_COMMA = "\0COMMA" + Math.random() + "\0";
export const ESC_PERIOD = "\0PERIOD" + Math.random() + "\0";

export const ESC_SLASH_RE = new RegExp(ESC_SLASH, "g");
export const ESC_OPEN_RE = new RegExp(ESC_OPEN, "g");
export const ESC_CLOSE_RE = new RegExp(ESC_CLOSE, "g");
export const ESC_COMMA_RE = new RegExp(ESC_COMMA, "g");
export const ESC_PERIOD_RE = new RegExp(ESC_PERIOD, "g");

export const SLASH_RE = /\\\\/g;
export const OPEN_RE = /\\\{/g;
export const CLOSE_RE = /\\\}/g;
export const COMMA_RE = /\\,/g;
export const PERIOD_RE = /\\\./g;

/**
 * Converts a numeric string to a number; if not numeric, returns the character code
 * of the first character.
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
  return str
    .replace(SLASH_RE, ESC_SLASH)
    .replace(OPEN_RE, ESC_OPEN)
    .replace(CLOSE_RE, ESC_CLOSE)
    .replace(COMMA_RE, ESC_COMMA)
    .replace(PERIOD_RE, ESC_PERIOD);
}

/**
 * Reverses the escape operation applied by escapeBraces.
 *
 * @param str - The string to unescape.
 * @returns The unescaped string.
 */
export function unescapeBraces(str: string): string {
  return str
    .replace(ESC_SLASH_RE, "\\")
    .replace(ESC_OPEN_RE, "{")
    .replace(ESC_CLOSE_RE, "}")
    .replace(ESC_COMMA_RE, ",")
    .replace(ESC_PERIOD_RE, ".");
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
