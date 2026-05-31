import { ENTRY_CREATE_DEFAULTS, formatLocalDateOnly, type WorkEntryCreate, type WorkTypeDto } from "@worklog/shared";

export function buildCreateDefaults(workTypes: WorkTypeDto[]): WorkEntryCreate {
  const first = workTypes[0];
  return {
    completedAt: formatLocalDateOnly(),
    workTypeId: first?.id ?? ENTRY_CREATE_DEFAULTS.workTypeId,
    volume: ENTRY_CREATE_DEFAULTS.volume,
    unit: first?.defaultUnit ?? ENTRY_CREATE_DEFAULTS.unit,
    performerName: ENTRY_CREATE_DEFAULTS.performerName,
  };
}
