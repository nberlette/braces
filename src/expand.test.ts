import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { expand } from "./expand.ts";

describe("expand", () => {
  it("returns original string if no braces present", () => {
    expect(expand("no braces")).toEqual(["no braces"]);
  });

  it("expands simple numeric sequences", () => {
    expect(expand("{1..3}")).toEqual(["1", "2", "3"]);
  });

  it("expands stepped numeric sequences", () => {
    expect(expand("{10..20..5}")).toEqual(["10", "15", "20"]);
  });

  it("expands alpha sequences", () => {
    expect(expand("{a..c}")).toEqual(["a", "b", "c"]);
  });

  it("expands comma separated values", () => {
    expect(expand("{a,b,c}")).toEqual(["a", "b", "c"]);
  });

  it("handles nested brace expressions", () => {
    const input = "a{b,c{d,e}}f";
    expect(expand(input)).toEqual(["abf", "acdf", "acef"]);
  });
});

describe("expand - extra cases", () => {
  it("expands padded numeric sequences", () => {
    const result = expand("file-{01..03}.txt");
    expect(result).toEqual([
      "file-01.txt",
      "file-02.txt",
      "file-03.txt",
    ]);
  });

  it("expands negative numeric sequences", () => {
    const result = expand("{-3..-1}");
    expect(result).toEqual(["-3", "-2", "-1"]);
  });

  it("expands alpha sequence with step", () => {
    const result = expand("{a..f..2}");
    expect(result).toEqual(["a", "c", "e"]);
  });

  it("returns unmodified input with unbalanced braces", () => {
    // If there's an unmatched brace, no expansion occurs.
    expect(expand("a{b")).toEqual(["a{b"]);
  });

  it("handles literal dollar sign prevention", () => {
    // Pre ending with '$' should skip expansion inside braces.
    const input = "price${100,200}";
    const result = expand(input);
    expect(result).toEqual([input]);
  });
});

describe("expand - error handling", () => {
  it("throws error for non-string input", () => {
    expect(() => {
      expand(null as unknown as string);
    }).toThrow();
  });
  it("throws error for undefined input", () => {
    expect(() => {
      expand(undefined as unknown as string);
    }).toThrow();
  });
});
