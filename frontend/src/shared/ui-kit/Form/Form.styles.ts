import styled from "styled-components";
import { media } from "../../../theme/media";

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const FieldError = styled.span.attrs({ role: "alert" })`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.danger};
`;

export const FieldHint = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ActionsRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.sm};

  ${media.down("md")} {
    flex-direction: column-reverse;

    & > button {
      width: 100%;
    }
  }
`;
