import styled from "styled-components";
import { StyledStack } from "../ui-kit/Stack/Stack.styles";
import { media } from "../../theme/media";

export const StyledPageLayout = styled(StyledStack).attrs({
  as: "main",
  $direction: "column",
  $gap: "lg",
})`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  width: 100%;

  ${media.down("md")} {
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
  }

  ${media.down("sm")} {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;
