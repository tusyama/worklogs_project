import styled from "styled-components";
import { media } from "../../theme/media";

export const PaginationRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};

  ${media.down("md")} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  ${media.down("md")} {
    width: 100%;

    & > button {
      flex: 1;
    }
  }
`;
