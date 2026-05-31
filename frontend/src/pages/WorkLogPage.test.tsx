import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ENTRY_FORM_FIELD, UI_TEXT } from "@worklog/shared";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../app/api";
import { fillPerformer, submitForm } from "../test/form-helpers";
import { SAMPLE_ENTRY, WORK_TYPE_A } from "../test/fixtures";
import { renderWithProviders } from "../test/render";
import { WorkLogPage } from "./WorkLogPage";

vi.mock("../app/api", async (importOriginal) => {
  const actual = await importOriginal<typeof api>();
  return {
    ...actual,
    useGetWorkTypesQuery: vi.fn(),
    useGetEntriesQuery: vi.fn(),
    useCreateEntryMutation: vi.fn(),
    useUpdateEntryMutation: vi.fn(),
    useDeleteEntryMutation: vi.fn(),
  };
});

const wl = UI_TEXT.workLog;
const modalText = UI_TEXT.entryModal;
const tableText = UI_TEXT.entriesTable;
const deleteText = UI_TEXT.deleteDialog;

function mockQueries({
  typesLoading = false,
  entriesLoading = false,
  isError = false,
  typesError = false,
  workTypes = [WORK_TYPE_A],
  entries = [SAMPLE_ENTRY],
}: {
  typesLoading?: boolean;
  entriesLoading?: boolean;
  isError?: boolean;
  typesError?: boolean;
  workTypes?: typeof WORK_TYPE_A[];
  entries?: typeof SAMPLE_ENTRY[];
} = {}) {
  vi.mocked(api.useGetWorkTypesQuery).mockReturnValue({
    data: typesError ? undefined : workTypes,
    isLoading: typesLoading,
    isError: typesError,
  } as ReturnType<typeof api.useGetWorkTypesQuery>);

  vi.mocked(api.useGetEntriesQuery).mockReturnValue({
    data: entries,
    isLoading: entriesLoading,
    isError,
    error: isError ? { status: 500 } : undefined,
  } as ReturnType<typeof api.useGetEntriesQuery>);
}

function mockMutations() {
  const createUnwrap = vi.fn().mockResolvedValue(SAMPLE_ENTRY);
  const updateUnwrap = vi.fn().mockResolvedValue(SAMPLE_ENTRY);
  const deleteUnwrap = vi.fn().mockResolvedValue(undefined);
  const createTrigger = vi.fn(() => ({ unwrap: createUnwrap }));
  const updateTrigger = vi.fn(() => ({ unwrap: updateUnwrap }));
  const deleteTrigger = vi.fn(() => ({ unwrap: deleteUnwrap }));

  vi.mocked(api.useCreateEntryMutation).mockReturnValue([
    createTrigger,
    { isLoading: false },
  ] as ReturnType<typeof api.useCreateEntryMutation>);

  vi.mocked(api.useUpdateEntryMutation).mockReturnValue([
    updateTrigger,
    { isLoading: false },
  ] as ReturnType<typeof api.useUpdateEntryMutation>);

  vi.mocked(api.useDeleteEntryMutation).mockReturnValue([
    deleteTrigger,
    { isLoading: false },
  ] as ReturnType<typeof api.useDeleteEntryMutation>);

  return { createTrigger, createUnwrap, updateTrigger, updateUnwrap, deleteTrigger, deleteUnwrap };
}

async function openCreateModal(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: wl.addEntry }));
  return screen.getByRole("dialog");
}

describe("WorkLogPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMutations();
  });

  it("shows loading state", () => {
    mockQueries({ typesLoading: true, entries: [] });
    renderWithProviders(<WorkLogPage />);

    expect(screen.getByText(wl.loading)).toBeInTheDocument();
    expect(screen.queryByText(SAMPLE_ENTRY.workTypeName)).not.toBeInTheDocument();
  });

  it("shows error state when entries query fails", () => {
    mockQueries({ isError: true, entries: [] });
    renderWithProviders(<WorkLogPage />);

    expect(screen.getByText(new RegExp(wl.loadErrorPrefix))).toBeInTheDocument();
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it("renders entries table with data", () => {
    mockQueries();
    renderWithProviders(<WorkLogPage />);

    expect(screen.getByText(SAMPLE_ENTRY.workTypeName)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: wl.addEntry })).toBeInTheDocument();
  });

  it("shows empty table state when there are no entries", () => {
    mockQueries({ entries: [] });
    renderWithProviders(<WorkLogPage />);

    expect(screen.getByText(tableText.emptyTitle)).toBeInTheDocument();
  });

  it("opens create entry modal", async () => {
    const user = userEvent.setup();
    mockQueries();
    renderWithProviders(<WorkLogPage />);

    const dialog = await openCreateModal(user);
    expect(within(dialog).getByRole("heading", { name: modalText.createTitle })).toBeInTheDocument();
    expect(dialog.querySelector(`[name="${ENTRY_FORM_FIELD.workTypeId}"]`)).toBeInTheDocument();
  });

  it("closes modal after successful create", async () => {
    const user = userEvent.setup();
    const { createTrigger } = mockMutations();
    mockQueries();
    renderWithProviders(<WorkLogPage />);

    const dialog = await openCreateModal(user);
    fillPerformer(dialog, "Тестов Т.Т.");
    submitForm(dialog);

    await waitFor(() => {
      expect(createTrigger).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("shows form error when create mutation fails", async () => {
    const user = userEvent.setup();
    mockQueries();

    const createTrigger = vi.fn(() => ({
      unwrap: vi.fn().mockRejectedValue(new Error("fail")),
    }));
    vi.mocked(api.useCreateEntryMutation).mockReturnValue([
      createTrigger,
      { isLoading: false },
    ] as ReturnType<typeof api.useCreateEntryMutation>);

    renderWithProviders(<WorkLogPage />);

    const dialog = await openCreateModal(user);
    fillPerformer(dialog, "Тестов Т.Т.");
    submitForm(dialog);

    await waitFor(() => {
      expect(createTrigger).toHaveBeenCalledTimes(1);
      expect(screen.getByText(wl.saveEntryError)).toBeInTheDocument();
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens edit modal with entry data", async () => {
    const user = userEvent.setup();
    mockQueries();
    renderWithProviders(<WorkLogPage />);

    await user.click(screen.getByRole("button", { name: tableText.edit }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: modalText.editTitle })).toBeInTheDocument();
    expect(dialog.querySelector(`[name="${ENTRY_FORM_FIELD.performerName}"]`)).toHaveValue(
      SAMPLE_ENTRY.performerName,
    );
  });

  it("opens delete confirmation dialog", async () => {
    const user = userEvent.setup();
    mockQueries();
    renderWithProviders(<WorkLogPage />);

    await user.click(screen.getByRole("button", { name: tableText.delete }));

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText(deleteText.title)).toBeInTheDocument();
    expect(
      within(dialog).getByText(deleteText.body(SAMPLE_ENTRY.completedAt, SAMPLE_ENTRY.workTypeName)),
    ).toBeInTheDocument();
  });

  it("hides entries table when date range is invalid", async () => {
    const user = userEvent.setup();
    mockQueries();
    renderWithProviders(<WorkLogPage />);

    expect(screen.getByText(SAMPLE_ENTRY.workTypeName)).toBeInTheDocument();

    const dateFrom = screen.getByLabelText(wl.dateFrom);
    const dateTo = screen.getByLabelText(wl.dateTo);
    await user.clear(dateFrom);
    await user.type(dateFrom, "2026-12-01");
    await user.clear(dateTo);
    await user.type(dateTo, "2026-01-01");

    expect(screen.getByText(wl.dateRangeInvalid)).toBeInTheDocument();
    expect(screen.queryByText(SAMPLE_ENTRY.workTypeName)).not.toBeInTheDocument();
  });

  it("shows work types load error", () => {
    mockQueries({ typesError: true, workTypes: [] });
    renderWithProviders(<WorkLogPage />);

    expect(screen.getByText(wl.workTypesLoadError)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: wl.addEntry })).toBeDisabled();
  });

  it("closes modal after successful update", async () => {
    const user = userEvent.setup();
    const { updateTrigger } = mockMutations();
    mockQueries();
    renderWithProviders(<WorkLogPage />);

    await user.click(screen.getByRole("button", { name: tableText.edit }));
    submitForm(screen.getByRole("dialog"));

    await waitFor(() => {
      expect(updateTrigger).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("closes delete dialog after successful delete", async () => {
    const user = userEvent.setup();
    const { deleteTrigger } = mockMutations();
    mockQueries();
    renderWithProviders(<WorkLogPage />);

    await user.click(screen.getByRole("button", { name: tableText.delete }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: deleteText.delete }));

    await waitFor(() => {
      expect(deleteTrigger).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
