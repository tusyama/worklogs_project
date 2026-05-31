import styled from "styled-components";
import { StyledStack } from "@/shared/ui-kit/Stack/Stack.styles";
import { media } from "@/theme/media";

export const FiltersLayout = styled(StyledStack).attrs({
  $direction: "row",
  $gap: "md",
  $align: "flex-end",
  $wrap: true,
})`
  ${media.down("md")} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterField = styled(StyledStack).attrs({
  $direction: "column",
  $gap: "xs",
})`
  min-width: 160px;
  flex: 1 1 160px;

  ${media.down("md")} {
    min-width: 0;
    flex: 1 1 auto;
    width: 100%;
  }
`;

export const AddEntryButtonWrap = styled.div`
  ${media.down("md")} {
    width: 100%;

    & > button {
      width: 100%;
    }
  }
`;

export const FilterError = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0 0;
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;
