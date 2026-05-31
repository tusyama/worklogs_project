import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ENTRY_FORM_FIELD,
  UI_TEXT,
  UNIT_SELECT_CUSTOM,
  VALIDATION_MESSAGES,
} from "@worklog/shared";
import { describe, expect, it, vi } from "vitest";
import { fillPerformer, setVolume, submitForm } from "@/test/form-helpers";
import { SAMPLE_ENTRY, WORK_TYPE_A, WORK_TYPE_B } from "@/test/fixtures";
import { renderWithProviders } from "@/test/render";
import { EntryForm } from "./EntryForm";

const formText = UI_TEXT.entryForm;

function getNamedInput(scope: HTMLElement, name: string) {
  const el = scope.querySelector(`[name="${name}"]`);
  if (!el) {
    throw new Error(`Field [name="${name}"] not found`);
  }
  return el as HTMLInputElement;
}

function getUnitSelect(scope: HTMLElement) {
  const el = scope.querySelector('[data-testid="entry-unit-select"]');
  if (!el) {
    throw new Error("Unit select not found");
  }
  return el as HTMLSelectElement;
}

describe("EntryForm", () => {
  it("shows validation errors when required fields are missing", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    const { container } = renderWithProviders(
      <EntryForm workTypes={[]} onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    await user.click(within(container).getByRole("button", { name: formText.save }));

    await waitFor(() => {
      expect(within(container).getByText(VALIDATION_MESSAGES.performerRequired)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows volume error for non-positive values", async () => {
    const onSubmit = vi.fn();

    const { container } = renderWithProviders(
      <EntryForm workTypes={[WORK_TYPE_A]} onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    fillPerformer(container, "Петров П.П.");
    setVolume(container, "0");
    submitForm(container);

    await waitFor(() => {
      expect(within(container).getByText(VALIDATION_MESSAGES.volumePositive)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid create payload", async () => {
    const onSubmit = vi.fn();

    const { container } = renderWithProviders(
      <EntryForm
        workTypes={[WORK_TYPE_A, WORK_TYPE_B]}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    fillPerformer(container, "Сидоров С.С.");
    submitForm(container);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    expect(onSubmit.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        workTypeId: WORK_TYPE_A.id,
        unit: "м²",
        performerName: "Сидоров С.С.",
        volume: 1,
      }),
    );
  });

  it("prefills fields in edit mode", async () => {
    const { container } = renderWithProviders(
      <EntryForm
        workTypes={[WORK_TYPE_A]}
        initial={SAMPLE_ENTRY}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(getNamedInput(container, ENTRY_FORM_FIELD.performerName)).toHaveValue(
        SAMPLE_ENTRY.performerName,
      );
    });
    expect(getNamedInput(container, ENTRY_FORM_FIELD.completedAt)).toHaveValue("2026-05-15");
    expect(getNamedInput(container, ENTRY_FORM_FIELD.volume)).toHaveValue(24);
    expect(getUnitSelect(container)).toHaveValue("м²");
  });

  it("updates unit when work type changes", async () => {
    const user = userEvent.setup();

    const { container } = renderWithProviders(
      <EntryForm
        workTypes={[WORK_TYPE_A, WORK_TYPE_B]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const unitSelect = getUnitSelect(container);
    const workTypeSelect = container.querySelector(
      `[name="${ENTRY_FORM_FIELD.workTypeId}"]`,
    ) as HTMLSelectElement;

    await waitFor(() => expect(unitSelect).toHaveValue("м²"));

    await user.selectOptions(workTypeSelect, WORK_TYPE_B.id);

    await waitFor(() => expect(unitSelect).toHaveValue("м³"));
  });

  it("submits custom unit when user selects own option", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    const { container } = renderWithProviders(
      <EntryForm workTypes={[WORK_TYPE_A]} onSubmit={onSubmit} onCancel={vi.fn()} />,
    );

    fillPerformer(container, "Петров П.П.");
    await user.selectOptions(getUnitSelect(container), UNIT_SELECT_CUSTOM);
    const customInput = container.querySelector(
      '[data-testid="entry-unit-custom"]',
    ) as HTMLInputElement;
    await user.type(customInput, "п.м.");
    await user.click(within(container).getByRole("button", { name: formText.save }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({ unit: "п.м." }),
    );
  });

  it("disables submit while submitting", () => {
    renderWithProviders(
      <EntryForm
        workTypes={[WORK_TYPE_A]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitting
      />,
    );

    expect(screen.getByRole("button", { name: formText.saving })).toBeDisabled();
  });

  it("calls onCancel when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    const { container } = renderWithProviders(
      <EntryForm workTypes={[WORK_TYPE_A]} onSubmit={vi.fn()} onCancel={onCancel} />,
    );

    await user.click(within(container).getByRole("button", { name: formText.cancel }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
