import styled from "styled-components";
import { media } from "../../../theme/media";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};

  ${media.down("md")} {
    align-items: flex-end;
    padding: 0;
  }
`;

export const Content = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.modal};
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;

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
