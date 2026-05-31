import { DEFAULT_ENTRY_SORT, type EntriesListQuery } from "@worklog/shared";

export const TTL = {
  workTypesCatalog: 3600,
  entriesList: 300,
} as const;

export const KEYS = {
  workTypesActive: "work-types:active",
  entriesVersion: "entries:ver",
} as const;

export function buildEntriesListCachePayload(filter: EntriesListQuery): string {
  return JSON.stringify({
    dateFrom: filter.dateFrom ?? "",
    dateTo: filter.dateTo ?? "",
    sort: filter.sort ?? DEFAULT_ENTRY_SORT,
    page: filter.page ?? 1,
    pageSize: filter.pageSize ?? 10,
  });
}

export function entriesListKey(filter: EntriesListQuery, version: number): string {
  const hash = Bun.hash(buildEntriesListCachePayload(filter)).toString(16);
  return `entries:ver:${version}:list:${hash}`;
}
