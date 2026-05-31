import {
  ENTRY_MODAL_MODE,
  UI_TEXT,
  type EntryModalMode,
  type WorkEntryCreate,
  type WorkEntryDto,
  type WorkTypeDto,
} from "@worklog/shared";
import { Inline, Modal } from "../../shared/ui-kit";
import { EntryForm } from "./EntryForm";

type EntryModalProps = {
  open: boolean;
  mode: EntryModalMode;
  entry: WorkEntryDto | null;
  workTypes: WorkTypeDto[];
  submitError?: string | null;
  onClose: () => void;
  onSubmit: (data: WorkEntryCreate) => void | Promise<void>;
  submitting?: boolean;
};

export function EntryModal({
  open,
  mode,
  entry,
  workTypes,
  submitError,
  onClose,
  onSubmit,
  submitting,
}: EntryModalProps) {
  const titleId = "entry-modal-title";
  const title =
    mode === ENTRY_MODAL_MODE.CREATE
      ? UI_TEXT.entryModal.createTitle
      : UI_TEXT.entryModal.editTitle;

  return (
    <Modal.Root
      open={open}
      onClose={onClose}
      titleId={titleId}
      closeOnEscape={!submitting}
      closeOnOverlayClick={!submitting}
    >
      <Modal.Header>
        <InlineHeader>
          <Modal.Title id={titleId}>{title}</Modal.Title>
          <Modal.Close onClick={onClose} disabled={submitting} />
        </InlineHeader>
      </Modal.Header>
      <Modal.Body>
        <EntryForm
          key={mode === ENTRY_MODAL_MODE.EDIT ? (entry?.id ?? "edit") : ENTRY_MODAL_MODE.CREATE}
          workTypes={workTypes}
          initial={mode === ENTRY_MODAL_MODE.EDIT ? (entry ?? undefined) : undefined}
          submitError={submitError}
          onSubmit={onSubmit}
          onCancel={onClose}
          submitting={submitting}
        />
      </Modal.Body>
    </Modal.Root>
  );
}

function InlineHeader({ children }: { children: React.ReactNode }) {
  return (
    <Inline justify="space-between" align="center">
      {children}
    </Inline>
  );
}
