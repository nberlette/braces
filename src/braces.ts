/**
 * This module provides the {@linkcode braces} function - the namesake of this
 * package - which expands bash-like brace expressions into an array of strings
 * using a variety of rules. It supports comma-separated options, alphanumeric
 * sequences (stepped and linear/non-stepped), nested brace expressions, and
 * more complex patterns as well.
 *
 * This module was directly adapted to TypeScript from the original JavaScript
 * implementation of `braces-expansion` by Julian Gruber, which is licensed
 * under the MIT license. The original code can be found at:
 *
 *    https://github.com/juliangruber/braces-expansion
 *
 * @module braces
 */

import { escapeBraces, unescapeBraces } from "./_internal.ts";
import { expand } from "./expand.ts";

/**
 * Expands brace expressions in a string using Bash-like rules.
 *
 * @param str - The input string, which may contain brace expressions.
 * @returns An array of expanded strings.
 * @example
 * ```ts
 * import { braces } from "jsr:@nick/braces";
 *
 * const files = braces("./{deno,package}.json{c,}");
 * console.log(files);
 * // ["./deno.jsonc", "./deno.json", "./package.jsonc", "./package.json"]
 *
 * const sequential = braces("./untitled-{1..3}.txt");
 * console.log(sequential);
 * // ["./untitled-1.txt", "./untitled-2.txt", "./untitled-3.txt"]
 *
 * const stepped = braces("./file-part.{100..300..100}");
 * console.log(stepped);
 * // ["./file-part.100", "./file-part.200", "./file-part.300"]
 * ```
 */
export function braces(str: string): string[] {
  if (!str) return [];
  // Bash 4.3 quirk: if a string starts with "{}", escape the leading braces.
  if (str.slice(0, 2) === "{}") str = "\\{\\}" + str.slice(2);
  return expand(escapeBraces(str), true).map(unescapeBraces);
}
