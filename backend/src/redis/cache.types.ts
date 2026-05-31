import type { EntriesListQuery, WorkEntryDto, WorkTypeDto } from "@worklog/shared";

export interface ICache {
  ping(): Promise<boolean>;
  getWorkTypesCatalog(): Promise<WorkTypeDto[] | null>;
  setWorkTypesCatalog(items: WorkTypeDto[]): Promise<void>;
  invalidateWorkTypesCatalog(): Promise<void>;
  getEntriesCacheVersion(): Promise<number | null>;
  bumpEntriesCacheVersion(): Promise<number>;
  getEntriesList(filter: EntriesListQuery, version: number): Promise<WorkEntryDto[] | null>;
  setEntriesList(filter: EntriesListQuery, version: number, items: WorkEntryDto[]): Promise<void>;
}
