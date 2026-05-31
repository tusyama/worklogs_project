import styled from "styled-components";

export const StyledButton = styled.button<{
  $variant: "primary" | "secondary" | "danger" | "ghost";
  $size: "sm" | "md";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid transparent;
  cursor: pointer;
  padding: ${({ $size }) => ($size === "sm" ? "6px 12px" : "10px 16px")};
  font-size: ${({ theme, $size }) => ($size === "sm" ? theme.fontSizes.sm : theme.fontSizes.md)};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition:
    background-color 0.15s,
    border-color 0.15s;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  ${({ theme, $variant }) => {
    switch ($variant) {
      case "primary":
        return `
          background: ${theme.colors.primary};
          color: #fff;
          &:hover:not(:disabled) { background: ${theme.colors.primaryHover}; }
        `;
      case "danger":
        return `
          background: ${theme.colors.danger};
          color: #fff;
          &:hover:not(:disabled) { background: ${theme.colors.dangerHover}; }
        `;
      case "secondary":
        return `
          background: ${theme.colors.surface};
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
          &:hover:not(:disabled) { background: ${theme.colors.bg}; }
        `;
      case "ghost":
        return `
          background: transparent;
          color: ${theme.colors.text};
          &:hover:not(:disabled) { background: ${theme.colors.bg}; }
        `;
    }
  }}
`;
