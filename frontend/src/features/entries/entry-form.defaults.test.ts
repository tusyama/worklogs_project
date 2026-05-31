import { ENTRY_CREATE_DEFAULTS, formatLocalDateOnly } from "@worklog/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WORK_TYPE_A, WORK_TYPE_B } from "@/test/fixtures";
import { buildCreateDefaults } from "./entry-form.defaults";

describe("buildCreateDefaults", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-31T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses first work type id and default unit", () => {
    const defaults = buildCreateDefaults([WORK_TYPE_A, WORK_TYPE_B]);
    expect(defaults.workTypeId).toBe(WORK_TYPE_A.id);
    expect(defaults.unit).toBe("м²");
    expect(defaults.volume).toBe(ENTRY_CREATE_DEFAULTS.volume);
    expect(defaults.performerName).toBe(ENTRY_CREATE_DEFAULTS.performerName);
    expect(defaults.completedAt).toBe(formatLocalDateOnly(new Date("2026-05-31T12:00:00.000Z")));
  });

  it("returns empty workTypeId when catalog is empty", () => {
    const defaults = buildCreateDefaults([]);
    expect(defaults.workTypeId).toBe(ENTRY_CREATE_DEFAULTS.workTypeId);
    expect(defaults.unit).toBe(ENTRY_CREATE_DEFAULTS.unit);
  });
});
