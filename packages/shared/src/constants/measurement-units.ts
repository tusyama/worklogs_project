/** Common construction measurement units (aligned with seed catalog). */
export const MEASUREMENT_UNITS = ["м²", "м³", "м", "шт", "т", "кг", "л"] as const;

export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[number];

/** Select value: user enters unit manually (not sent to API). */
export const UNIT_SELECT_CUSTOM = "__custom__" as const;

export function buildUnitOptions(catalogUnits: Array<string | null | undefined>): string[] {
  const fromCatalog = catalogUnits.filter((u): u is string => Boolean(u?.trim()));
  return [...new Set([...MEASUREMENT_UNITS, ...fromCatalog])];
}

export function isPresetUnit(unit: string, options: readonly string[]): boolean {
  return unit !== "" && options.includes(unit);
}
