import { DEFAULT_ENTRY_SORT, type EntriesListQuery } from "@worklog/shared";

export const TTL = {
  workTypesCatalog: 3600,
  entriesList: 300,
} as const;

export const KEYS = {
  workTypesActive: "work-types:active",
  entriesVersion: "entries:ver",
} as const;

export function entriesListKey(filter: EntriesListQuery, version: number): string {
  const payload = JSON.stringify({
    dateFrom: filter.dateFrom ?? "",
    dateTo: filter.dateTo ?? "",
    sort: filter.sort ?? DEFAULT_ENTRY_SORT,
  });
  const hash = Bun.hash(payload).toString(16);
  return `entries:ver:${version}:list:${hash}`;
}
