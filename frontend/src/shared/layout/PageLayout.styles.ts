import styled from "styled-components";
import { media } from "../../theme/media";

export const StyledPageLayout = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
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
