import { describe, expect, it } from "vitest";
import { formatEntryDate, formatLocalDateOnly } from "./format";

describe("formatEntryDate", () => {
  it("formats ISO date in ru-RU locale", () => {
    expect(formatEntryDate("2026-05-31")).toMatch(/31\.05\.2026/);
  });
});

describe("formatLocalDateOnly", () => {
  it("uses local calendar components", () => {
    expect(formatLocalDateOnly(new Date(2026, 4, 31, 23, 59))).toBe("2026-05-31");
  });
});
