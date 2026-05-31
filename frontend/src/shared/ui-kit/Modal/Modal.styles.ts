import styled from "styled-components";
import { StyledStack } from "../Stack/Stack.styles";
import { media } from "../../../theme/media";

export const Overlay = styled(StyledStack).attrs({
  $direction: "row",
  $gap: "sm",
  $align: "center",
  $justify: "center",
})`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing.lg};

  ${media.down("md")} {
    align-items: flex-end;
    padding: 0;
  }
`;

export const Content = styled(StyledStack).attrs({
  $direction: "column",
  $gap: "sm",
})`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.modal};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;

  ${media.down("md")} {
    max-width: none;
    max-height: 92vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;

export const Header = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  ${media.down("md")} {
    padding: ${({ theme }) => theme.spacing.md};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const Body = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;

  ${media.down("md")} {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  ${media.down("md")} {
    padding: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.sm};
  }
`;
