import { ENTRY_SORT_VALUES, UI_TEXT, type EntrySortOrder } from "@worklog/shared";
import { memo, useId } from "react";
import { Button, Card, Inline, Input, Select, Stack, Text } from "../../shared/ui-kit";

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
        <Inline gap="md" wrap align="flex-end">
          <Stack gap="xs" style={{ minWidth: 160 }}>
            <Text as="label" htmlFor={dateFromId} variant="caption">
              {wl.dateFrom}
            </Text>
            <Input
              id={dateFromId}
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
            />
          </Stack>
          <Stack gap="xs" style={{ minWidth: 160 }}>
            <Text as="label" htmlFor={dateToId} variant="caption">
              {wl.dateTo}
            </Text>
            <Input
              id={dateToId}
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
            />
          </Stack>
          <Stack gap="xs" style={{ minWidth: 160 }}>
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
          </Stack>
          <Button $variant="primary" type="button" onClick={onAddEntry} disabled={!canAddEntry}>
            {wl.addEntry}
          </Button>
        </Inline>
        {dateRangeInvalid ? (
          <Text variant="body" style={{ color: "#c62828", marginTop: 12 }}>
            {wl.dateRangeInvalid}
          </Text>
        ) : null}
      </Card.Body>
    </Card.Root>
  );
});
