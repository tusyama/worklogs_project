import { Text } from "../Text";
import { Stack } from "../Stack";

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
