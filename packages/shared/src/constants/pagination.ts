export const DEFAULT_ENTRIES_PAGE = 1;
export const DEFAULT_ENTRIES_PAGE_SIZE = 10;
export const MAX_ENTRIES_PAGE_SIZE = 100;

export function computeTotalPages(total: number, pageSize: number): number {
  if (total <= 0) return 1;
  return Math.ceil(total / pageSize);
}
