import { describe, expect, it } from "vitest";
import { DEFAULT_ENTRY_SORT, ENTRY_SORT } from "./constants/sort";
import { DEFAULT_ENTRIES_PAGE, DEFAULT_ENTRIES_PAGE_SIZE } from "./constants/pagination";
import { VALIDATION_MESSAGES } from "./constants/validation-messages";
import { entriesListQuerySchema, entryIdParamSchema, workEntryCreateSchema } from "./schemas";

describe("workEntryCreateSchema", () => {
  const valid = {
    completedAt: "2026-05-31",
    workTypeId: "507f1f77bcf86cd799439011",
    volume: 10,
    unit: "м³",
    performerName: "  Петров П.П.  ",
  };

  it("accepts valid payload and trims performer name", () => {
    const result = workEntryCreateSchema.parse(valid);
    expect(result.performerName).toBe("Петров П.П.");
    expect(result.volume).toBe(10);
  });

  it("rejects invalid date format", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, completedAt: "31.05.2026" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid calendar date", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, completedAt: "2026-02-31" });
    expect(result.success).toBe(false);
  });

  it("rejects infinite volume", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, volume: Number.POSITIVE_INFINITY });
    expect(result.success).toBe(false);
  });

  it("rejects empty workTypeId", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, workTypeId: "" });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive volume", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, volume: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(VALIDATION_MESSAGES.volumePositive);
    }
  });

  it("rejects volume below mongoose minimum", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, volume: 0.00001 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(VALIDATION_MESSAGES.volumePositive);
    }
  });

  it("rejects NaN volume with Russian message", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, volume: Number.NaN });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(VALIDATION_MESSAGES.volumeRequired);
    }
  });

  it("rejects empty unit", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, unit: "" });
    expect(result.success).toBe(false);
  });

  it("accepts custom unit strings within max length", () => {
    const result = workEntryCreateSchema.parse({ ...valid, unit: "  п.м.  " });
    expect(result.unit).toBe("п.м.");
  });

  it("rejects empty performer after trim", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, performerName: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(VALIDATION_MESSAGES.performerRequired);
    }
  });

  it("rejects invalid workTypeId format", () => {
    const result = workEntryCreateSchema.safeParse({ ...valid, workTypeId: "not-an-object-id" });
    expect(result.success).toBe(false);
  });
});

describe("entriesListQuerySchema", () => {
  it("defaults sort, page and pageSize", () => {
    expect(entriesListQuerySchema.parse({})).toEqual({
      sort: DEFAULT_ENTRY_SORT,
      page: DEFAULT_ENTRIES_PAGE,
      pageSize: DEFAULT_ENTRIES_PAGE_SIZE,
    });
  });

  it("accepts date range and asc sort", () => {
    expect(
      entriesListQuerySchema.parse({
        dateFrom: "2026-01-01",
        dateTo: "2026-12-31",
        sort: ENTRY_SORT.ASC,
      }),
    ).toEqual({
      dateFrom: "2026-01-01",
      dateTo: "2026-12-31",
      sort: ENTRY_SORT.ASC,
      page: DEFAULT_ENTRIES_PAGE,
      pageSize: DEFAULT_ENTRIES_PAGE_SIZE,
    });
  });

  it("rejects pageSize above maximum", () => {
    expect(entriesListQuerySchema.safeParse({ pageSize: 101 }).success).toBe(false);
  });

  it("rejects invalid calendar date", () => {
    expect(entriesListQuerySchema.safeParse({ dateFrom: "2026-02-31" }).success).toBe(false);
  });

  it("rejects inverted date range", () => {
    const result = entriesListQuerySchema.safeParse({
      dateFrom: "2026-12-01",
      dateTo: "2026-01-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(VALIDATION_MESSAGES.dateRange);
    }
  });
});

describe("entryIdParamSchema", () => {
  it("accepts valid ObjectId", () => {
    expect(entryIdParamSchema.parse({ id: "507f1f77bcf86cd799439011" })).toEqual({
      id: "507f1f77bcf86cd799439011",
    });
  });

  it("rejects invalid id", () => {
    expect(entryIdParamSchema.safeParse({ id: "bad-id" }).success).toBe(false);
  });
});
