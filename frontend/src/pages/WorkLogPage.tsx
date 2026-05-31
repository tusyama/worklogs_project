import {
  DEFAULT_ENTRY_SORT,
  ENTRY_MODAL_MODE,
  ENTRY_SORT_VALUES,
  UI_TEXT,
  type EntryModalMode,
  type EntrySortOrder,
  type WorkEntryCreate,
  type WorkEntryDto,
} from "@worklog/shared";
import { useId, useState } from "react";
import {
  useCreateEntryMutation,
  useDeleteEntryMutation,
  useGetWorkTypesQuery,
  useUpdateEntryMutation,
} from "../app/api";
import { DeleteEntryDialog } from "../features/entries/DeleteEntryDialog";
import { EntriesPagination } from "../features/entries/EntriesPagination";
import { EntriesTable } from "../features/entries/EntriesTable";
import { EntryModal } from "../features/entries/EntryModal";
import { usePagination } from "../features/entries/usePagination";
import { Button, Card, Inline, Input, Select, Spinner, Stack, Text } from "../shared/ui-kit";

export function WorkLogPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<EntrySortOrder>(DEFAULT_ENTRY_SORT);

  const dateRangeInvalid = Boolean(dateFrom && dateTo && dateFrom > dateTo);

  const {
    page,
    setPage,
    items: entries,
    total,
    totalPages,
    hasMultiplePages,
    isInitialLoading: entriesInitialLoading,
    isFetching: entriesFetching,
    isError,
    error,
  } = usePagination({
    dateFrom,
    dateTo,
    sort,
    skip: dateRangeInvalid,
  });

  const {
    data: workTypes = [],
    isLoading: typesLoading,
    isError: typesError,
  } = useGetWorkTypesQuery();

  const [createEntry, { isLoading: creating }] = useCreateEntryMutation();
  const [updateEntry, { isLoading: updating }] = useUpdateEntryMutation();
  const [deleteEntry, { isLoading: deleting }] = useDeleteEntryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<EntryModalMode>(ENTRY_MODAL_MODE.CREATE);
  const [editingEntry, setEditingEntry] = useState<WorkEntryDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkEntryDto | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const dateFromId = useId();
  const dateToId = useId();
  const sortId = useId();

  const openCreate = () => {
    setSubmitError(null);
    setModalMode(ENTRY_MODAL_MODE.CREATE);
    setEditingEntry(null);
    setModalOpen(true);
  };

  const openEdit = (entry: WorkEntryDto) => {
    setSubmitError(null);
    setModalMode(ENTRY_MODAL_MODE.EDIT);
    setEditingEntry(entry);
    setModalOpen(true);
  };

  const handleSubmit = async (data: WorkEntryCreate) => {
    try {
      setSubmitError(null);
      if (modalMode === ENTRY_MODAL_MODE.CREATE) {
        await createEntry(data).unwrap();
      } else if (editingEntry) {
        await updateEntry({ id: editingEntry.id, body: data }).unwrap();
      } else {
        setSubmitError(UI_TEXT.workLog.saveEntryError);
        return;
      }
      setModalOpen(false);
    } catch {
      setSubmitError(UI_TEXT.workLog.saveEntryError);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteError(null);
      await deleteEntry(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch {
      setDeleteError(UI_TEXT.workLog.deleteEntryError);
    }
  };

  const loading = typesLoading || entriesInitialLoading;
  const { workLog: wl, sort: sortLabels } = UI_TEXT;
  const canAddEntry = !typesError && workTypes.length > 0;

  return (
    <Stack gap="lg" style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Stack gap="sm">
        <Text as="h1" variant="title">
          {wl.title}
        </Text>
        <Text variant="caption">{wl.subtitle}</Text>
      </Stack>

      <Card.Root>
        <Card.Body>
          <Inline gap="md" wrap align="flex-end">
            <Stack gap="xs" style={{ minWidth: 160 }}>
              <Text as="label" htmlFor={dateFromId} variant="caption">
                {wl.dateFrom}
              </Text>
              <Input id={dateFromId} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </Stack>
            <Stack gap="xs" style={{ minWidth: 160 }}>
              <Text as="label" htmlFor={dateToId} variant="caption">
                {wl.dateTo}
              </Text>
              <Input id={dateToId} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </Stack>
            <Stack gap="xs" style={{ minWidth: 160 }}>
              <Text as="label" htmlFor={sortId} variant="caption">
                {wl.sortLabel}
              </Text>
              <Select
                id={sortId}
                value={sort}
                onChange={(e) => setSort(e.target.value as EntrySortOrder)}
              >
                {ENTRY_SORT_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {sortLabels[value]}
                  </option>
                ))}
              </Select>
            </Stack>
            <Button $variant="primary" type="button" onClick={openCreate} disabled={!canAddEntry}>
              {wl.addEntry}
            </Button>
          </Inline>
          {dateRangeInvalid ? (
            <Text variant="body" style={{ color: "#c62828", marginTop: 12 }}>
              {wl.dateRangeInvalid}
            </Text>
          ) : null}
        </Card.Body>
      </Card.Root>

      {typesError ? (
        <Text variant="body" style={{ color: "#c62828" }}>
          {wl.workTypesLoadError}
        </Text>
      ) : null}

      {loading ? (
        <Stack align="center" gap="md">
          <Spinner />
          <Text variant="caption">{wl.loading}</Text>
        </Stack>
      ) : isError ? (
        <Text variant="body">
          {wl.loadErrorPrefix}{" "}
          {"status" in (error as object)
            ? String((error as { status: unknown }).status)
            : wl.unknownStatus}
        </Text>
      ) : dateRangeInvalid ? null : (
        <Stack gap="md">
          <EntriesTable items={entries} onEdit={openEdit} onDelete={setDeleteTarget} />
          {hasMultiplePages ? (
            <EntriesPagination
              page={page}
              totalPages={totalPages}
              total={total}
              loading={entriesFetching}
              onPageChange={setPage}
            />
          ) : null}
        </Stack>
      )}

      <EntryModal
        open={modalOpen}
        mode={modalMode}
        entry={editingEntry}
        workTypes={workTypes}
        submitError={submitError}
        onClose={() => {
          setSubmitError(null);
          setModalOpen(false);
        }}
        onSubmit={handleSubmit}
        submitting={creating || updating}
      />

      <DeleteEntryDialog
        entry={deleteTarget}
        open={Boolean(deleteTarget)}
        error={deleteError}
        onClose={() => {
          setDeleteError(null);
          setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Stack>
  );
}
