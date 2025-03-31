import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { braces } from "./braces.ts";

describe("[braces] fundamentals", () => {
  it("should be a function", () => expect(typeof braces).toBe("function"));
  it("should be named 'braces'", () => expect(braces.name).toBe("braces"));
  it("should have an arity of 1", () => expect(braces).toHaveLength(1));
  it("should be callable with a string argument", () => {
    expect(() => braces("test")).not.toThrow();
  });
  it("should throw an error for non-string arguments", () => {
    expect(() => braces(123 as unknown as string)).toThrow();
  });
});

describe("[braces] basic behavior", () => {
  it("should return empty array for empty string", () => {
    expect(braces("")).toEqual([]);
  });

  it("should handle leading '{}' by escaping", () => {
    const result = braces("{}test");
    expect(result).toEqual(["{}test"]);
  });

  it("should expand comma separated options", () => {
    const result = braces("./{deno,package}.json{c,}");
    expect(result).toEqual([
      "./deno.jsonc",
      "./deno.json",
      "./package.jsonc",
      "./package.json",
    ]);
  });

  it("should expand numeric sequences", () => {
    const result = braces("./untitled-{1..3}.txt");
    expect(result).toEqual([
      "./untitled-1.txt",
      "./untitled-2.txt",
      "./untitled-3.txt",
    ]);
  });

  it("should expand stepped numeric sequences", () => {
    const result = braces("./file-part.{100..300..100}");
    expect(result).toEqual([
      "./file-part.100",
      "./file-part.200",
      "./file-part.300",
    ]);
  });

  it("should handle nested expressions", () => {
    const result = braces("a{b,c{d,e}}f");
    expect(result).toEqual([
      "abf",
      "acdf",
      "acef",
    ]);
  });

  it("should handle alphanumeric sequences", () => {
    const result = braces("{a..c}");
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should handle negative numeric sequences", () => {
    const result = braces("{-3..-1}");
    expect(result).toEqual(["-3", "-2", "-1"]);
  });

  it("should handle alpha sequence with step", () => {
    const result = braces("{a..f..2}");
    expect(result).toEqual(["a", "c", "e"]);
  });

  it("should handle padded numeric sequences", () => {
    const result = braces("file-{01..03}.txt");
    expect(result).toEqual([
      "file-01.txt",
      "file-02.txt",
      "file-03.txt",
    ]);
  });

  it("should handle unbalanced braces", () => {
    const result = braces("a{b");
    expect(result).toEqual(["a{b"]);
  });

  it("should handle braces with no options", () => {
    const result = braces("{a}");
    expect(result).toEqual(["{a}"]);
  });

  it("should handle braces with no options and no content", () => {
    const result = braces("{}");
    expect(result).toEqual(["{}"]);
  });

  it("should handle braces with no options and empty content", () => {
    const result = braces("{,}");
    expect(result).toEqual([]);
  });

  it("should handle braces with no options and empty content with comma", () => {
    const result = braces("{,a}");
    expect(result).toEqual(["a"]);
  });

  it("should handle braces with 1 option", () => {
    const result = braces("a{b}c");
    expect(result).toEqual(["a{b}c"]);
  });

  it("should support escaped braces", () => {
    const result = braces("\\{a,b\\}");
    expect(result).toEqual(["{a,b}"]);
  });

  it("should handle escaped braces with nested expressions", () => {
    const result = braces("\\{a,{b,c{d,e}}\\}");
    expect(result).toEqual(["{a,b}", "{a,cd}", "{a,ce}"]);
  });
});

describe("[braces] edge cases", () => {
  it("returns input when no braces present", () => {
    expect(braces("plain-string")).toEqual(["plain-string"]);
  });

  it("handles unexpected unmatched closing brace", () => {
    // No expansion if only closing brace exists
    expect(braces("a}b")).toEqual(["a}b"]);
  });

  it("handles multiple nested expressions", () => {
    // Nested deeply with multiple branches
    const input = "pre{a,{b,c{d,e}}}post";
    const expected = [
      "preapost",
      "prebpost",
      "precdpost",
      "precepost",
    ];
    expect(braces(input)).toEqual(expected);
  });
});

describe.ignore("[braces] error handling", () => {
  it("throws error for non-string input", () => {
    expect(() => {
      braces(null as unknown as string);
    }).toThrow();
  });

  it("throws error for undefined input", () => {
    expect(() => {
      braces(undefined as unknown as string);
    }).toThrow();
  });
});
