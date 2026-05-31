import { ENTRY_SORT_VALUES, UI_TEXT, type EntrySortOrder } from "@worklog/shared";
import { memo, useId } from "react";
import { Button, Card, Input, Select, Text } from "@/shared/ui-kit";
import {
  AddEntryButtonWrap,
  FilterError,
  FilterField,
  FiltersLayout,
} from "./WorkLogFilters.styles";

type WorkLogFiltersProps = {
  dateFrom: string;
  dateTo: string;
  sort: EntrySortOrder;
  dateRangeInvalid: boolean;
  canAddEntry: boolean;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSortChange: (value: EntrySortOrder) => void;
  onAddEntry: () => void;
};

export const WorkLogFilters = memo(function WorkLogFilters({
  dateFrom,
  dateTo,
  sort,
  dateRangeInvalid,
  canAddEntry,
  onDateFromChange,
  onDateToChange,
  onSortChange,
  onAddEntry,
}: WorkLogFiltersProps) {
  const dateFromId = useId();
  const dateToId = useId();
  const sortId = useId();
  const { workLog: wl, sort: sortLabels } = UI_TEXT;

  return (
    <Card.Root>
      <Card.Body>
        <FiltersLayout>
          <FilterField>
            <Text as="label" htmlFor={dateFromId} variant="caption">
              {wl.dateFrom}
            </Text>
            <Input
              id={dateFromId}
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </FilterField>
          <FilterField>
            <Text as="label" htmlFor={dateToId} variant="caption">
              {wl.dateTo}
            </Text>
            <Input
              id={dateToId}
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </FilterField>
          <FilterField>
            <Text as="label" htmlFor={sortId} variant="caption">
              {wl.sortLabel}
            </Text>
            <Select id={sortId} value={sort} onChange={(e) => onSortChange(e.target.value as EntrySortOrder)}>
              {ENTRY_SORT_VALUES.map((value) => (
                <option key={value} value={value}>
                  {sortLabels[value]}
                </option>
              ))}
            </Select>
          </FilterField>
          <AddEntryButtonWrap>
            <Button $variant="primary" type="button" onClick={onAddEntry} disabled={!canAddEntry}>
              {wl.addEntry}
            </Button>
          </AddEntryButtonWrap>
        </FiltersLayout>
        {dateRangeInvalid ? <FilterError role="alert">{wl.dateRangeInvalid}</FilterError> : null}
      </Card.Body>
    </Card.Root>
  );
});
