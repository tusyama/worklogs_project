import styled from "styled-components";
import { media } from "../../theme/media";

export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EntryCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const EntryCardDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

export const EntryCardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const EntryCardLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const EntryCardValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
`;

export const EntryCardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.xs};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${media.down("md")} {
    flex-direction: column;

    & > button {
      width: 100%;
    }
  }
`;

export const EmptyCardList = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;
