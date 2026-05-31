import { UI_TEXT, type EntrySortOrder, type WorkEntryDto } from "@worklog/shared";
import { EntriesPagination } from "./EntriesPagination";
import { EntriesTable } from "./EntriesTable";
import { usePagination } from "./usePagination";
import { Spinner, Stack, Text } from "../../shared/ui-kit";

type WorkLogEntriesProps = {
  dateFrom: string;
  dateTo: string;
  sort: EntrySortOrder;
  skip: boolean;
  resetKey?: number;
  onEdit: (entry: WorkEntryDto) => void;
  onDelete: (entry: WorkEntryDto) => void;
};

export function WorkLogEntries({
  dateFrom,
  dateTo,
  sort,
  skip,
  resetKey,
  onEdit,
  onDelete,
}: WorkLogEntriesProps) {
  const {
    page,
    setPage,
    items,
    total,
    totalPages,
    hasMultiplePages,
    isInitialLoading,
    isFetching,
    isError,
    error,
  } = usePagination({ dateFrom, dateTo, sort, skip, resetKey });

  const wl = UI_TEXT.workLog;

  if (skip) return null;

  if (isInitialLoading) {
    return (
      <Stack align="center" gap="md">
        <Spinner />
        <Text variant="caption">{wl.loading}</Text>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Text variant="body">
        {wl.loadErrorPrefix}{" "}
        {"status" in (error as object)
          ? String((error as { status: unknown }).status)
          : wl.unknownStatus}
      </Text>
    );
  }

  return (
    <Stack gap="md">
      <EntriesTable items={items} onEdit={onEdit} onDelete={onDelete} />
      {hasMultiplePages ? (
        <EntriesPagination
          page={page}
          totalPages={totalPages}
          total={total}
          loading={isFetching}
          onPageChange={setPage}
        />
      ) : null}
    </Stack>
  );
}
