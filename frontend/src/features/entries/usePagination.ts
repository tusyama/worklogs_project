import {
  DEFAULT_ENTRIES_PAGE,
  DEFAULT_ENTRIES_PAGE_SIZE,
  type EntriesListQuery,
  type EntrySortOrder,
} from "@worklog/shared";
import { useEffect, useMemo, useState } from "react";
import { useGetEntriesQuery } from "@/app/api";

export type EntriesListFilters = {
  dateFrom: string;
  dateTo: string;
  sort: EntrySortOrder;
  skip?: boolean;
  resetKey?: number;
};

export function usePagination({
  dateFrom,
  dateTo,
  sort,
  skip = false,
  resetKey = 0,
}: EntriesListFilters) {
  const [page, setPage] = useState(DEFAULT_ENTRIES_PAGE);

  useEffect(() => {
    setPage(DEFAULT_ENTRIES_PAGE);
  }, [dateFrom, dateTo, sort, resetKey]);

  const query = useMemo<EntriesListQuery>(
    () => ({
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
      sort,
      page,
      pageSize: DEFAULT_ENTRIES_PAGE_SIZE,
    }),
    [dateFrom, dateTo, sort, page],
  );

  const { data, isLoading, isFetching, isError, error } = useGetEntriesQuery(query, { skip });

  const totalPages = data?.totalPages ?? 1;

  return {
    page,
    setPage,
    items: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages,
    hasMultiplePages: totalPages > 1,
    isInitialLoading: isLoading && !data,
    isFetching,
    isError,
    error,
  };
}
