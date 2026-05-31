import styled from "styled-components";
import { StyledStack } from "../Stack/Stack.styles";
import { media } from "../../../theme/media";

export const StyledForm = styled(StyledStack).attrs({
  as: "form",
  $direction: "column",
  $gap: "md",
})``;

export const FieldWrapper = styled(StyledStack).attrs({
  $direction: "column",
  $gap: "xs",
})``;

export const FieldError = styled.span.attrs({ role: "alert" })`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.danger};
`;

export const FieldHint = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ActionsRow = styled(StyledStack).attrs({
  $direction: "row",
  $gap: "sm",
  $justify: "flex-end",
})`
  margin-top: ${({ theme }) => theme.spacing.sm};

  ${media.down("md")} {
    flex-direction: column-reverse;

    & > button {
      width: 100%;
    }
  }
`;
