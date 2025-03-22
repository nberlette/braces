/**
 * # `@nick/braces`
 *
 * This module provides a function to perform Bash-like brace expansion. It
 * supports comma-separated options (e.g. "a{b,c}d" expands to ["abd", "acd"]),
 * numeric sequences (e.g. "file{1..3}.txt"), alpha sequences, and even nested
 * brace expressions.
 *
 * The module follows these steps:
 * - It escapes backslashes and brace-related characters.
 * - It recursively finds balanced pairs of braces and expands their
 *   comma-separated or sequence contents.
 * - Finally, it unescapes the resulting strings.
 *
 * **Note**: A special quirk from Bash 4.3 is handled: strings starting with
 * "{}" are prefixed with escape tokens so that the first two characters remain
 * intact.
 *
 * ## Acknowledgements
 *
 * This module was ported to TypeScript from the original JavaScript package,
 * `braces-expansion`: https://github.com/juliangruber/braces-expansion (MIT)
 *
 * The original code was written by Julian Gruber and is licensed under MIT.
 *
 * @module braces
 */

export * from "./src/braces.ts";
export * from "./src/balanced.ts";
export * from "./src/expand.ts";

export { braces as default } from "./src/braces.ts";
