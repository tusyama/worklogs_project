import { UI_TEXT } from "@worklog/shared";
import { Button, Inline, Text } from "../../shared/ui-kit";

type EntriesPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
};

export function EntriesPagination({
  page,
  totalPages,
  total,
  loading,
  onPageChange,
}: EntriesPaginationProps) {
  const t = UI_TEXT.workLog;

  return (
    <Inline justify="space-between" align="center" wrap gap="sm">
      <Text variant="caption">{t.paginationSummary(page, totalPages, total)}</Text>
      <Inline gap="sm">
        <Button
          $variant="secondary"
          type="button"
          disabled={loading || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          {t.paginationPrev}
        </Button>
        <Button
          $variant="secondary"
          type="button"
          disabled={loading || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          {t.paginationNext}
        </Button>
      </Inline>
    </Inline>
  );
}
