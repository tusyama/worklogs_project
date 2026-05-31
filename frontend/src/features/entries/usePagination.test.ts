import { DEFAULT_ENTRY_SORT } from "@worklog/shared";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../../app/api";
import { SAMPLE_ENTRY } from "../../test/fixtures";
import { usePagination } from "./usePagination";

vi.mock("../../app/api", async (importOriginal) => {
  const actual = await importOriginal<typeof api>();
  return {
    ...actual,
    useGetEntriesQuery: vi.fn(),
  };
});

const defaultFilters = {
  dateFrom: "",
  dateTo: "",
  sort: DEFAULT_ENTRY_SORT,
  skip: false,
};

function mockEntriesQuery(
  overrides: Partial<ReturnType<typeof api.useGetEntriesQuery>> = {},
) {
  vi.mocked(api.useGetEntriesQuery).mockReturnValue({
    data: {
      items: [SAMPLE_ENTRY],
      total: 25,
      page: 1,
      pageSize: 10,
      totalPages: 3,
    },
    isLoading: false,
    isFetching: false,
    isError: false,
    error: undefined,
    ...overrides,
  } as ReturnType<typeof api.useGetEntriesQuery>);
}

describe("usePagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEntriesQuery();
  });

  it("passes page and pageSize in query to RTK", () => {
    renderHook(() => usePagination(defaultFilters));

    expect(api.useGetEntriesQuery).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, pageSize: 10, sort: DEFAULT_ENTRY_SORT }),
      { skip: false },
    );
  });

  it("updates page via setPage", () => {
    const { result } = renderHook(() => usePagination(defaultFilters));

    act(() => {
      result.current.setPage(2);
    });

    expect(result.current.page).toBe(2);
    expect(api.useGetEntriesQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2 }),
      { skip: false },
    );
  });

  it("resets page when filters change", () => {
    const { result, rerender } = renderHook(
      (filters) => usePagination(filters),
      { initialProps: defaultFilters },
    );

    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);

    rerender({ ...defaultFilters, dateFrom: "2026-01-01" });

    expect(result.current.page).toBe(1);
  });

  it("skips query when skip is true", () => {
    renderHook(() => usePagination({ ...defaultFilters, skip: true }));

    expect(api.useGetEntriesQuery).toHaveBeenCalledWith(expect.any(Object), { skip: true });
  });

  it("derives pagination metadata from response", () => {
    const { result } = renderHook(() => usePagination(defaultFilters));

    expect(result.current.items).toEqual([SAMPLE_ENTRY]);
    expect(result.current.total).toBe(25);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.hasMultiplePages).toBe(true);
  });
});
