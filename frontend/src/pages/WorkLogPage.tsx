import {
  DEFAULT_ENTRY_SORT,
  ENTRY_MODAL_MODE,
  UI_TEXT,
  type EntryModalMode,
  type EntrySortOrder,
  type WorkEntryCreate,
  type WorkEntryDto,
} from "@worklog/shared";
import { useCallback, useState } from "react";
import {
  useCreateEntryMutation,
  useDeleteEntryMutation,
  useGetWorkTypesQuery,
  useUpdateEntryMutation,
} from "../app/api";
import { DeleteEntryDialog } from "../features/entries/DeleteEntryDialog";
import { EntryModal } from "../features/entries/EntryModal";
import { WorkLogEntries } from "../features/entries/WorkLogEntries";
import { WorkLogFilters } from "../features/entries/WorkLogFilters";
import { PageLayout } from "../shared/layout/PageLayout";
import { Stack, Text } from "../shared/ui-kit";

export function WorkLogPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<EntrySortOrder>(DEFAULT_ENTRY_SORT);

  const dateRangeInvalid = Boolean(dateFrom && dateTo && dateFrom > dateTo);

  const { data: workTypes = [], isError: typesError } = useGetWorkTypesQuery();

  const [createEntry, { isLoading: creating }] = useCreateEntryMutation();
  const [updateEntry, { isLoading: updating }] = useUpdateEntryMutation();
  const [deleteEntry, { isLoading: deleting }] = useDeleteEntryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<EntryModalMode>(ENTRY_MODAL_MODE.CREATE);
  const [editingEntry, setEditingEntry] = useState<WorkEntryDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkEntryDto | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [entriesResetKey, setEntriesResetKey] = useState(0);

  const openCreate = useCallback(() => {
    setSubmitError(null);
    setModalMode(ENTRY_MODAL_MODE.CREATE);
    setEditingEntry(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((entry: WorkEntryDto) => {
    setSubmitError(null);
    setModalMode(ENTRY_MODAL_MODE.EDIT);
    setEditingEntry(entry);
    setModalOpen(true);
  }, []);

  const handleSubmit = async (data: WorkEntryCreate) => {
    try {
      setSubmitError(null);
      if (modalMode === ENTRY_MODAL_MODE.CREATE) {
        await createEntry(data).unwrap();
        setEntriesResetKey((key) => key + 1);
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

  const wl = UI_TEXT.workLog;
  const canAddEntry = !typesError && workTypes.length > 0;

  return (
    <PageLayout>
      <Stack gap="sm">
        <Text as="h1" variant="title">
          {wl.title}
        </Text>
        <Text variant="caption">{wl.subtitle}</Text>
      </Stack>

      <WorkLogFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        sort={sort}
        dateRangeInvalid={dateRangeInvalid}
        canAddEntry={canAddEntry}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSortChange={setSort}
        onAddEntry={openCreate}
      />

      {typesError ? (
        <Text variant="body" style={{ color: "#c62828" }}>
          {wl.workTypesLoadError}
        </Text>
      ) : null}

      <WorkLogEntries
        dateFrom={dateFrom}
        dateTo={dateTo}
        sort={sort}
        skip={dateRangeInvalid}
        resetKey={entriesResetKey}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

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
    </PageLayout>
  );
}
