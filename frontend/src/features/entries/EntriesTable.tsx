import { formatEntryDate, UI_TEXT, type WorkEntryDto } from "@worklog/shared";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { Button, EmptyState, Inline, Table } from "@/shared/ui-kit";
import { EntriesCardList } from "./EntriesCardList";

type EntriesTableProps = {
  items: WorkEntryDto[];
  onEdit: (entry: WorkEntryDto) => void;
  onDelete: (entry: WorkEntryDto) => void;
};

export function EntriesTable({ items, onEdit, onDelete }: EntriesTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <EntriesCardList items={items} onEdit={onEdit} onDelete={onDelete} />;
  }

  const t = UI_TEXT.entriesTable;

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.HeadCell>{t.date}</Table.HeadCell>
          <Table.HeadCell>{t.workType}</Table.HeadCell>
          <Table.HeadCell>{t.volume}</Table.HeadCell>
          <Table.HeadCell>{t.performer}</Table.HeadCell>
          <Table.HeadCell align="right">{t.actions}</Table.HeadCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.length === 0 ? (
          <Table.Empty colSpan={5}>
            <EmptyState title={t.emptyTitle} description={t.emptyDescription} />
          </Table.Empty>
        ) : (
          items.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{formatEntryDate(row.completedAt)}</Table.Cell>
              <Table.Cell>{row.workTypeName}</Table.Cell>
              <Table.Cell>
                {row.volume} {row.unit}
              </Table.Cell>
              <Table.Cell>{row.performerName}</Table.Cell>
              <Table.Cell align="right">
                <Inline gap="sm" justify="flex-end">
                  <Button $variant="ghost" $size="sm" type="button" onClick={() => onEdit(row)}>
                    {t.edit}
                  </Button>
                  <Button $variant="danger" $size="sm" type="button" onClick={() => onDelete(row)}>
                    {t.delete}
                  </Button>
                </Inline>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
}
