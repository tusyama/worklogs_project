import type { EntriesListQuery, EntriesListResult, WorkEntryDto, WorkTypeDto } from "@worklog/shared";

export interface ICache {
  ping(): Promise<boolean>;
  getWorkTypesCatalog(): Promise<WorkTypeDto[] | null>;
  setWorkTypesCatalog(items: WorkTypeDto[]): Promise<void>;
  invalidateWorkTypesCatalog(): Promise<void>;
  getEntriesCacheVersion(): Promise<number | null>;
  bumpEntriesCacheVersion(): Promise<number>;
  getEntriesList(filter: EntriesListQuery, version: number): Promise<EntriesListResult | null>;
  setEntriesList(filter: EntriesListQuery, version: number, result: EntriesListResult): Promise<void>;
}
