import { describe, expect, it } from "vitest";
import { MEASUREMENT_UNITS, buildUnitOptions, isPresetUnit } from "./measurement-units";

describe("buildUnitOptions", () => {
  it("merges catalog units with defaults without duplicates", () => {
    expect(buildUnitOptions(["м²", "п.м.", null, "м²"])).toEqual([...MEASUREMENT_UNITS, "п.м."]);
  });
});

describe("isPresetUnit", () => {
  it("returns true for known presets", () => {
    expect(isPresetUnit("м³", MEASUREMENT_UNITS)).toBe(true);
  });

  it("returns false for custom values", () => {
    expect(isPresetUnit("п.м.", MEASUREMENT_UNITS)).toBe(false);
  });
});
