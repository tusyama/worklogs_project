import { describe, expect, it } from "vitest";
import { computeTotalPages } from "./pagination";

describe("computeTotalPages", () => {
  it("returns 1 for empty total", () => {
    expect(computeTotalPages(0, 10)).toBe(1);
  });

  it("computes pages for partial last page", () => {
    expect(computeTotalPages(21, 10)).toBe(3);
  });

  it("computes exact page count", () => {
    expect(computeTotalPages(20, 10)).toBe(2);
  });
});
