import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { balanced, range } from "./balanced.ts";

describe("balanced", () => {
  it("returns null if no balanced tokens exist", () => {
    expect(balanced("{", "}", "no tokens")).toEqual(null);
  });

  it("finds a simple balanced substring", () => {
    const str = "a{b}c";
    const result = balanced("{", "}", str);
    expect(result).not.toEqual(null);
    if (result) {
      expect(result.pre).toEqual("a");
      expect(result.body).toEqual("b");
      expect(result.post).toEqual("c");
    }
  });

  it("handles nested tokens correctly", () => {
    const str = "start {outer {inner} end} finish";
    const result = balanced("{", "}", str);
    expect(result?.pre).toEqual("start ");
    expect(result?.body).toContain("outer {inner");
    expect(result?.post).toBe(" finish");
  });
});

describe("balanced - extra cases", () => {
  it("handles identical open and close tokens", () => {
    // When tokens are identical, the first two occurrences form the balanced substring.
    const str = "aaabaaa";
    // Expecting to match the first two "a" as boundary.
    const result = balanced("a", "a", str);
    expect(result).not.toEqual(null);
    if (result) {
      expect(result.pre).toEqual("");
      expect(result.body).toEqual("");
      // post should be "baaa"
      expect(result.post).toEqual("abaaa");
    }
  });

  it("returns null for completely unbalanced input", () => {
    expect(balanced("{", "}", "no open or close")).toEqual(null);
  });

  it("handles multiple balanced sections by finding first occurrence", () => {
    const str = "first {inside} middle {also} end";
    const result = balanced("{", "}", str);
    expect(result).not.toEqual(null);
    if (result) {
      expect(result.pre).toEqual("first ");
      expect(result.body).toEqual("inside");
      expect(result.post).toEqual(" middle {also} end");
    }
  });
});

describe("balanced - error handling", () => {
  it("throws error when input is not a string", () => {
    expect(() => {
      balanced("{", "}", null as unknown as string);
    }).toThrow();
    expect(() => {
      balanced("{", "}", undefined as unknown as string);
    }).toThrow();
  });
});

describe("range", () => {
  it("returns null when tokens are not found", () => {
    expect(range("{", "}", "no tokens")).toEqual(null);
  });

  it("returns the correct range for a balanced substring", () => {
    const str = "x {y} z";
    const result = range("{", "}", str);
    expect(result).not.toEqual(null);
    if (result) {
      const [start, end] = result;
      expect(str.slice(start, end + 1)).toEqual("{y}");
    }
  });
});

describe("range - error handling", () => {
  it("throws error when input is not a string", () => {
    expect(() => {
      range("{", "}", null as unknown as string);
    }).toThrow();
    expect(() => {
      range("{", "}", undefined as unknown as string);
    }).toThrow();
  });
});
