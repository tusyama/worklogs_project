import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UI_TEXT } from "@worklog/shared";
import { describe, expect, it, vi } from "vitest";
import { formatEntryDate, SAMPLE_ENTRY } from "../../test/fixtures";
import { renderWithProviders } from "../../test/render";
import { EntriesCardList } from "./EntriesCardList";

const tableText = UI_TEXT.entriesTable;

describe("EntriesCardList", () => {
  it("shows empty state when there are no items", () => {
    renderWithProviders(<EntriesCardList items={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(tableText.emptyTitle)).toBeInTheDocument();
    expect(screen.getByText(tableText.emptyDescription)).toBeInTheDocument();
  });

  it("renders entry cards with formatted data", () => {
    renderWithProviders(
      <EntriesCardList items={[SAMPLE_ENTRY]} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(screen.getByText(formatEntryDate(SAMPLE_ENTRY.completedAt))).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_ENTRY.workTypeName)).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_ENTRY.performerName)).toBeInTheDocument();
    expect(screen.getByText(`${SAMPLE_ENTRY.volume} ${SAMPLE_ENTRY.unit}`)).toBeInTheDocument();
    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });

  it("calls onEdit and onDelete with the row entry", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWithProviders(
      <EntriesCardList items={[SAMPLE_ENTRY]} onEdit={onEdit} onDelete={onDelete} />,
    );

    await user.click(screen.getByRole("button", { name: tableText.edit }));
    expect(onEdit).toHaveBeenCalledWith(SAMPLE_ENTRY);

    await user.click(screen.getByRole("button", { name: tableText.delete }));
    expect(onDelete).toHaveBeenCalledWith(SAMPLE_ENTRY);
  });
});
