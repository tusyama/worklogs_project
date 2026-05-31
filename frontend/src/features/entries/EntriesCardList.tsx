import { formatEntryDate, UI_TEXT, type WorkEntryDto } from "@worklog/shared";
import { Button, EmptyState } from "../../shared/ui-kit";
import {
  CardList,
  EmptyCardList,
  EntryCard,
  EntryCardActions,
  EntryCardDate,
  EntryCardLabel,
  EntryCardRow,
  EntryCardValue,
} from "./EntriesCardList.styles";

type EntriesCardListProps = {
  items: WorkEntryDto[];
  onEdit: (entry: WorkEntryDto) => void;
  onDelete: (entry: WorkEntryDto) => void;
};

export function EntriesCardList({ items, onEdit, onDelete }: EntriesCardListProps) {
  const t = UI_TEXT.entriesTable;

  if (items.length === 0) {
    return (
      <EmptyCardList>
        <EmptyState title={t.emptyTitle} description={t.emptyDescription} />
      </EmptyCardList>
    );
  }

  return (
    <CardList>
      {items.map((row) => (
        <EntryCard key={row.id}>
          <EntryCardDate>{formatEntryDate(row.completedAt)}</EntryCardDate>
          <EntryCardRow>
            <EntryCardLabel>{t.workType}</EntryCardLabel>
            <EntryCardValue>{row.workTypeName}</EntryCardValue>
          </EntryCardRow>
          <EntryCardRow>
            <EntryCardLabel>{t.volume}</EntryCardLabel>
            <EntryCardValue>
              {row.volume} {row.unit}
            </EntryCardValue>
          </EntryCardRow>
          <EntryCardRow>
            <EntryCardLabel>{t.performer}</EntryCardLabel>
            <EntryCardValue>{row.performerName}</EntryCardValue>
          </EntryCardRow>
          <EntryCardActions>
            <Button $variant="ghost" $size="sm" type="button" onClick={() => onEdit(row)}>
              {t.edit}
            </Button>
            <Button $variant="danger" $size="sm" type="button" onClick={() => onDelete(row)}>
              {t.delete}
            </Button>
          </EntryCardActions>
        </EntryCard>
      ))}
    </CardList>
  );
}
