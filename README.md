<div align="center">

# @nick/braces

<big><b>Bash-like expansion of brace expressions in TypeScript.</b></big>

<br>

[![][badge-jsr]][JSR] [![][badge-jsr-score]][JSR] [![][badge-jsr-pkg]][JSR]

---

</div>

## Overview

This package provides a TypeScript implementation of Bash-like brace expansion,
allowing you to generate a set of strings based on a pattern with braces. It is
a port of the popular NPM packages [`balanced-match`] and [`brace-expansion`]
into platform-agnostic TypeScript.

This package is designed to work in any JavaScript environment, including
[Deno], [Node], [Bun], and [Cloudflare Workers]. It does not have any
dependencies, making it lightweight and easy to use. It is particularly useful
for generating file paths from glob patterns, and other string interpolations
based on a pattern with braces.

## Install

```bash
deno add jsr:@nick/braces
```

```bash
bunx jsr add @nick/braces
```

```bash
pnpm dlx jsr add @nick/braces
```

```bash
yarn dlx jsr add @nick/braces
```

```bash
npx jsr add @nick/braces
```

## Usage

```ts
import { braces } from "@nick/braces";

const files = braces("./**/*.{ts,tsx,js,jsx}");
console.log(files);
// [
//   "./**/*.ts",
//   "./**/*.tsx",
//   "./**/*.js",
//   "./**/*.jsx"
// ]
```

> [!TIP]
>
> See the [examples section](#examples) below for more usage examples.

## Features

This package's primary export is the `braces` function, which accepts a string
input and returns an array of the fully-expanded brace expressions.

| Status | Syntax                         |   Example    |
| :----: | ------------------------------ | :----------: |
|   ☑️   | **[Basic interpolation]**      |  `{a,b,c}`   |
|   ☑️   | **[Nested expressions]**       | `{{a,b},c}`  |
|   ☑️   | **[Numeric ranges]**           |  `{1..10}`   |
|   ☑️   | **[Stepped numeric ranges]**   | `{1..10..2}` |
|   ☑️   | **[Character ranges]**         |   `{a..z}`   |
|   ☑️   | **[Stepped character ranges]** | `{a..z..2}`  |

[basic interpolation]: #basic-interpolation
[nested expressions]: #nested-expressions
[numeric ranges]: #numeric-ranges
[stepped numeric ranges]: #stepped-numeric-ranges
[character ranges]: #character-ranges
[stepped character ranges]: #stepped-character-ranges

## Examples

### Basic Interpolation

```ts
import { braces } from "@nick/braces";

const files = braces("./**/*.{ts,tsx,js,jsx}");
console.log(files);
// [
//   "./**/*.ts",
//   "./**/*.tsx",
//   "./**/*.js",
//   "./**/*.jsx"
// ]
```

### Nested Expressions

As long as the braces are balanced, this package can handle any level of nested
expressions. Just like in Bash, the order of interpolation is left to right.

```ts
import { braces } from "@nick/braces";

const files = braces("./**/*.{{{,d.}ts,js}{,x},{m,c}{ts,js}}");
console.log(files);
// [
//   "./**/*.ts",
//   "./**/*.tsx",
//   "./**/*.d.ts",
//   "./**/*.d.tsx",
//   "./**/*.js",
//   "./**/*.jsx",
//   "./**/*.mts",
//   "./**/*.mjs",
//   "./**/*.cts",
//   "./**/*.cjs"
// ]
```

### Numeric Ranges

The `braces` function also supports the expansion of Bash-style numeric ranges,
expressed in the form of `n..m`, where `n` and `m` are both integers.

##### Syntax

```
{start..end}
```

###### Notes

- Both `n` and `m` must be positive or negative integers.
- Ranges are inclusive: both `n` and `m` will be in the result set.
- Returns an array of numeric strings (not parsed into JS numbers).

##### Example

```ts
import { braces } from "@nick/braces";

const files = braces("./{1..10}.txt");
console.log(files);
// [
//   "./1.txt",
//   "./2.txt",
//   ...
//   "./10.txt"
// ]
```

### Stepped Numeric Ranges

You can also specify a custom step value for the optional third parameter, to
control the increment between numbers.

##### Syntax

```
{start..end..step}
```

###### Notes

- Step value must be a positive integer.
- Step value must be less than or equal to the difference between `n` and `m`,
  otherwise the result will be an empty array.

##### Example

```ts
import { braces } from "@nick/braces";

const files = braces("./untitled-{1..10..2}.txt");
console.log(files);
// [
//   "./untitled-1.txt",
//   "./untitled-3.txt",
//   "./untitled-5.txt",
//   "./untitled-7.txt",
//   "./untitled-9.txt"
// ]
```

### Character Ranges

Similarly, you can use character ranges in the form of `a..z`, where `a` and `z`
are characters. The range is inclusive, meaning that both `a` and `z` are
included in the result set.

```ts
import { braces } from "@nick/braces";

const files = braces("./{a..e}.txt");
console.log(files);
// [
//   "./a.txt",
//   "./b.txt",
//   "./c.txt",
//   "./d.txt",
//   "./e.txt"
// ]
```

### Stepped Character Ranges

Similar to numeric ranges, character can also specify a step value using the
syntax `{start..end..step}`. This will generate a sequence with a specified step
size.

```ts
import { braces } from "@nick/braces";

const files = braces("./{1..10..2}.txt");
console.log(files);
// [
//   "./1.txt",
//   "./3.txt",
//   "./5.txt",
//   "./7.txt",
//   "./9.txt"
// ]
```

---

### Acknowledgements

This package was ported into platform-agnostic TypeScript from the NPM packages
[`balanced-match`] and [`brace-expansion`]. The original code was written by
[Julian Gruber] and is licensed under the MIT License.

---

<div align="center">

<strong>[MIT] © [Nicholas Berlette]. All rights reserved.</strong>

<!-- deno-fmt-ignore -->
<small><b>⭐️ [GitHub] <!-- --> 🐛 [Issues] <!-- --> 📦 [JSR]</b></small>

</div>

[MIT]: https://nick.mit-license.org "MIT © 2024+ Nicholas Berlette. All rights reserved."
[Nicholas Berlette]: https://github.com/nberlette "Follow Nicholas Berlette on GitHub!"
[GitHub]: https://github.com/nberlette/braces "Give the @nick/brotli project a star on GitHub! 🌟"
[Issues]: https://github.com/nberlette/braces/issues "View issues for the @nick/braces project on GitHub"
[open an issue]: https://github.com/nberlette/braces/issues/new "Open an issue on the nberlette/braces GitHub repository"
[JSR]: https://jsr.io/@nick/braces/doc "View the @nick/braces documentation on jsr.io"
[JSR-nick]: https://jsr.io/@nick "View more packages by Nick Berlette on JSR"
[badge-jsr]: https://jsr.io/badges/@nick "View all of @nick's packages on jsr.io"
[badge-jsr-pkg]: https://jsr.io/badges/@nick/braces "View @nick/braces on jsr.io"
[badge-jsr-score]: https://jsr.io/badges/@nick/braces/score "View the score for @nick/braces on jsr.io"
[Deno]: https://deno.land "Deno - A modern JavaScript and TypeScript runtime"
[Bun]: https://bun.sh "Bun - A fast all-in-one JavaScript runtime"
[Node]: https://nodejs.org "Node.js - A JavaScript runtime built on Chrome's V8 JavaScript engine"
[Cloudflare Workers]: https://workers.cloudflare.com "Cloudflare Workers serverless execution environment"
[`balanced-match`]: https://npmjs.com/package/balanced-match "View the balanced-match package on npm"
[`brace-expansion`]: https://npmjs.com/package/brace-expansion "View the brace-expansion package on npm"
[Julian Gruber]: https://github.com/juliangruber "Julian Gruber on GitHub"
