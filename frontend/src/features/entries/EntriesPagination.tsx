import { UI_TEXT } from "@worklog/shared";
import { Button, Text } from "@/shared/ui-kit";
import { PaginationControls, PaginationRoot } from "./EntriesPagination.styles";

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
    <PaginationRoot>
      <Text variant="caption">{t.paginationSummary(page, totalPages, total)}</Text>
      <PaginationControls>
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
      </PaginationControls>
    </PaginationRoot>
  );
}
