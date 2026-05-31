import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UI_TEXT } from "@worklog/shared";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import * as useIsMobileModule from "@/shared/hooks/useIsMobile";
import { formatEntryDate, SAMPLE_ENTRY } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { EntriesTable } from "./EntriesTable";

const tableText = UI_TEXT.entriesTable;

describe("EntriesTable", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.spyOn(useIsMobileModule, "useIsMobile").mockReturnValue(false);
  });

  it("shows empty state when there are no items", () => {
    renderWithProviders(<EntriesTable items={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(tableText.emptyTitle)).toBeInTheDocument();
    expect(screen.getByText(tableText.emptyDescription)).toBeInTheDocument();
  });

  it("renders entry rows with formatted data", () => {
    renderWithProviders(
      <EntriesTable items={[SAMPLE_ENTRY]} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText(formatEntryDate(SAMPLE_ENTRY.completedAt))).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_ENTRY.workTypeName)).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_ENTRY.performerName)).toBeInTheDocument();
    expect(screen.getByText(`${SAMPLE_ENTRY.volume} ${SAMPLE_ENTRY.unit}`)).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: tableText.date })).toBeInTheDocument();
  });

  it("calls onEdit and onDelete with the row entry", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <EntriesTable items={[SAMPLE_ENTRY]} onEdit={onEdit} onDelete={onDelete} />,
    );

    await user.click(screen.getByRole("button", { name: tableText.edit }));
    expect(onEdit).toHaveBeenCalledWith(SAMPLE_ENTRY);

    await user.click(screen.getByRole("button", { name: tableText.delete }));
    expect(onDelete).toHaveBeenCalledWith(SAMPLE_ENTRY);
  });

  it("renders card list on mobile", () => {
    vi.spyOn(useIsMobileModule, "useIsMobile").mockReturnValue(true);

    renderWithProviders(
      <EntriesTable items={[SAMPLE_ENTRY]} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText(formatEntryDate(SAMPLE_ENTRY.completedAt))).toBeInTheDocument();
    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });
});
