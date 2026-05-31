export const ENTRY_SORT = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const ENTRY_SORT_VALUES = [ENTRY_SORT.ASC, ENTRY_SORT.DESC] as const;

export type EntrySortOrder = (typeof ENTRY_SORT_VALUES)[number];

export const DEFAULT_ENTRY_SORT: EntrySortOrder = ENTRY_SORT.DESC;

/** MongoDB sort direction for `completedAt`. */
export function mongoSortDirection(sort: EntrySortOrder | undefined): 1 | -1 {
  return sort === ENTRY_SORT.ASC ? 1 : -1;
}
