import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UI_TEXT } from "@worklog/shared";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render";
import { SAMPLE_ENTRY } from "../../test/fixtures";
import { DeleteEntryDialog } from "./DeleteEntryDialog";

const dialogText = UI_TEXT.deleteDialog;

describe("DeleteEntryDialog", () => {
  it("does not render dialog content when closed", () => {
    renderWithProviders(
      <DeleteEntryDialog
        entry={SAMPLE_ENTRY}
        open={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows entry details when open", () => {
    renderWithProviders(
      <DeleteEntryDialog
        entry={SAMPLE_ENTRY}
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(dialogText.title)).toBeInTheDocument();
    expect(
      screen.getByText(dialogText.body(SAMPLE_ENTRY.completedAt, SAMPLE_ENTRY.workTypeName)),
    ).toBeInTheDocument();
  });

  it("calls onClose when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <DeleteEntryDialog
        entry={SAMPLE_ENTRY}
        open
        onClose={onClose}
        onConfirm={vi.fn()}
      />,
    );

    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: dialogText.cancel }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when delete is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    renderWithProviders(
      <DeleteEntryDialog
        entry={SAMPLE_ENTRY}
        open
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: dialogText.delete }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables confirm button while loading", () => {
    renderWithProviders(
      <DeleteEntryDialog
        entry={SAMPLE_ENTRY}
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        loading
      />,
    );

    expect(screen.getByRole("button", { name: dialogText.deleting })).toBeDisabled();
  });
});
