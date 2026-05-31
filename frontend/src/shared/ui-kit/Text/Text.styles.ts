import styled from "styled-components";

export const StyledText = styled.p<{
  $variant: "body" | "caption" | "title";
}>`
  margin: 0;
  color: ${({ theme, $variant }) => ($variant === "caption" ? theme.colors.textMuted : theme.colors.text)};
  font-size: ${({ theme, $variant }) => {
    if ($variant === "title") return theme.fontSizes.xl;
    if ($variant === "caption") return theme.fontSizes.sm;
    return theme.fontSizes.md;
  }};
  font-weight: ${({ theme, $variant }) =>
    $variant === "title" ? theme.fontWeights.bold : theme.fontWeights.normal};
`;
