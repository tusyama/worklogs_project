import { UI_TEXT, type WorkEntryDto } from "@worklog/shared";
import { Button, Form, Inline, Modal, Text } from "../../shared/ui-kit";

type DeleteEntryDialogProps = {
  entry: WorkEntryDto | null;
  open: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export function DeleteEntryDialog({
  entry,
  open,
  error,
  onClose,
  onConfirm,
  loading,
}: DeleteEntryDialogProps) {
  const titleId = "delete-entry-title";
  const t = UI_TEXT.deleteDialog;

  return (
    <Modal.Root
      open={open}
      onClose={onClose}
      titleId={titleId}
      closeOnEscape={!loading}
      closeOnOverlayClick={!loading}
    >
      <Modal.Header>
        <InlineHeader>
          <Modal.Title id={titleId}>{t.title}</Modal.Title>
          <Modal.Close onClick={onClose} disabled={loading} />
        </InlineHeader>
      </Modal.Header>
      <Modal.Body>
        <Text>{entry ? t.body(entry.completedAt, entry.workTypeName) : ""}</Text>
        {error ? (
          <Text variant="body" role="alert" style={{ color: "#c62828", marginTop: 12 }}>
            {error}
          </Text>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Form.Actions>
          <Button $variant="ghost" type="button" onClick={onClose} disabled={loading}>
            {t.cancel}
          </Button>
          <Button $variant="danger" type="button" onClick={onConfirm} disabled={loading}>
            {loading ? t.deleting : t.delete}
          </Button>
        </Form.Actions>
      </Modal.Footer>
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
