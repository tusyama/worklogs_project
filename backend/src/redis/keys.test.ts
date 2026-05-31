import { DEFAULT_ENTRIES_PAGE, DEFAULT_ENTRIES_PAGE_SIZE } from "@worklog/shared";
import { describe, expect, it } from "vitest";
import { buildEntriesListCachePayload } from "./keys";

describe("buildEntriesListCachePayload", () => {
  it("includes page and pageSize so cache keys differ per page", () => {
    const page1 = buildEntriesListCachePayload({
      sort: "desc",
      page: DEFAULT_ENTRIES_PAGE,
      pageSize: DEFAULT_ENTRIES_PAGE_SIZE,
    });
    const page2 = buildEntriesListCachePayload({
      sort: "desc",
      page: 2,
      pageSize: DEFAULT_ENTRIES_PAGE_SIZE,
    });
    expect(page1).not.toBe(page2);
  });
});
