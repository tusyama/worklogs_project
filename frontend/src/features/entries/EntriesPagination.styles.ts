import styled from "styled-components";
import { StyledStack } from "@/shared/ui-kit/Stack/Stack.styles";
import { media } from "@/theme/media";

export const PaginationRoot = styled(StyledStack).attrs({
  $direction: "row",
  $gap: "sm",
  $align: "center",
  $justify: "space-between",
  $wrap: true,
})`
  ${media.down("md")} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const PaginationControls = styled(StyledStack).attrs({
  $direction: "row",
  $gap: "sm",
})`
  ${media.down("md")} {
    width: 100%;

    & > button {
      flex: 1;
    }
  }
`;
