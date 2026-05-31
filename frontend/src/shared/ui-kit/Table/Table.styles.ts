import styled from "styled-components";
import { media } from "../../../theme/media";

export const TableScroll = styled.div`
  overflow-x: auto;
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

export const StyledTable = styled.table`
  width: 100%;
  min-width: 720px;
`;

export const StyledThead = styled.thead`
  background: ${({ theme }) => theme.colors.bg};
`;

export const StyledTh = styled.th<{ $align?: "left" | "right" | "center" }>`
  text-align: ${({ $align }) => $align ?? "left"};
  padding: 12px 16px;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  ${media.down("lg")} {
    padding: 10px 12px;
  }
`;

export const StyledTd = styled.td<{ $align?: "left" | "right" | "center" }>`
  text-align: ${({ $align }) => $align ?? "left"};
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;

  ${media.down("lg")} {
    padding: 10px 12px;
  }
`;

export const StyledTr = styled.tr`
  &:hover td {
    background: ${({ theme }) => theme.colors.bg};
  }
`;

export const StyledEmptyTd = styled.td`
  padding: 32px 16px;
  text-align: center;
`;
