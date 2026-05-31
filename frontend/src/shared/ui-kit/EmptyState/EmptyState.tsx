import { Text } from "@/shared/ui-kit/Text";
import { Stack } from "@/shared/ui-kit/Stack";

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Stack gap="sm" align="center">
      <Text variant="body">{title}</Text>
      {description ? <Text variant="caption">{description}</Text> : null}
    </Stack>
  );
}
