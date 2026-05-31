import { describe, expect, it } from "vitest";
import { ENTRY_SORT, mongoSortDirection } from "./sort";

describe("mongoSortDirection", () => {
  it("maps asc to 1 and desc to -1", () => {
    expect(mongoSortDirection(ENTRY_SORT.ASC)).toBe(1);
    expect(mongoSortDirection(ENTRY_SORT.DESC)).toBe(-1);
    expect(mongoSortDirection(undefined)).toBe(-1);
  });
});
