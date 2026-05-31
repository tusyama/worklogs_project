import styled from "styled-components";

type Gap = keyof typeof import("../../../theme/tokens").tokens.spacing;

export const StyledStack = styled.div<{
  $direction: "row" | "column";
  $gap: Gap;
  $align?: string;
  $justify?: string;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  gap: ${({ theme, $gap }) => theme.spacing[$gap]};
  align-items: ${({ $align }) => $align ?? "stretch"};
  justify-content: ${({ $justify }) => $justify ?? "flex-start"};
  flex-wrap: ${({ $wrap }) => ($wrap ? "wrap" : "nowrap")};
`;
