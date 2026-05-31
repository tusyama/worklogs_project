import { UI_TEXT } from "@worklog/shared";
import { StyledSpinner } from "./Spinner.styles";

export function Spinner({ size = 24 }: { size?: number }) {
  return <StyledSpinner $size={size} role="status" aria-label={UI_TEXT.a11y.loading} />;
}
